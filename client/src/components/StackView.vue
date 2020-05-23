<template>
  <div id="stack-view-container">
    <div class="name">Stack and Heap Profiler</div>
    <div id="stack-view">
      <div id="tooltip" class="hidden">
        <p>
          <strong id="name">Stack Info</strong>
        </p>
        <p>
          <span id="value">100</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import * as d3 from "d3";
import DataProvider from "../DataProvider";

let colors = ["#FF6600", "#FFD443", "#FF6361", "#484C7F", "#BABEEA", "#E2ECF2"];

export default {
  name: "stack-view",
  data() {
    return {};
  },
  methods: {
    chartInit(data) {
      let heapDict = {};

      let originData = [];

      let countData = [];

      let accent = d3.scaleOrdinal(d3.schemeSet2);

      let typeDict = {};

      for (let index in data) {
        let len = data[index].length;
        let ele = { len: len, index: parseInt(index) };
        countData.push(ele);

        let _ele = data[index];
        let metas = [];
        _ele.forEach(function(d) {
          let words = d.split("|");

          let heapLoc = words[0];
          let type = words[1];

          typeDict[type] = 1;

          let meta = {};
          meta["type"] = type;
          meta["heapLoc"] = heapLoc;

          if (type == "NSupercomb") {
            let subType = words[2];

            meta["subType"] = subType;
          }
          if (type == "NAp") {
            let subType = words[4];

            let add1 = words[2];
            let add2 = words[3];

            meta["subType"] = subType;
            meta["add1"] = add1;
            meta["add2"] = add2;

            if (subType == "NNum") {
              let value = words[5];
              meta["value"] = value;
            }
            if (subType == "NAp") {
              let add3 = words[5];
              let add4 = words[6];
              meta["add3"] = add3;
              meta["add4"] = add4;
            }
            if (subType == "NData") {
              let value = words[5];
              let dataType = words[6];
              meta["value"] = value;
              meta["dataType"] = dataType;
            }
          }
          if (type == "NPrim") {
            let operator = words[2];
            meta["operator"] = operator;
          }
          if (type == "NInd") {
            let value = words[2];
            meta["value"] = value;
          }
          if (type == "NNum") {
            let value = words[2];
            meta["value"] = value;
          }

          if (type == "NData") {
            let length = words[2];
            meta["length"] = length;
          }

          heapDict[heapLoc] = meta;

          metas.push(meta);
        });
        originData.push(metas);
      }

      console.log(originData);

      let heapList = [];

      for (let heap in heapDict) {
        heapList.push(heapDict[heap]);
      }

      let width = this.width;
      let height = this.height;

      let that = this;

      let margin = { top: 50, right: 20, bottom: 30, left: 30 };

      let curve = d3.curveBasis;

      d3.select("#stack-view")
        .select("svg")
        .remove();

      let extent = d3.extent(countData, d => parseInt(d.index));

      let x  = d3.scaleBand().rangeRound([margin.left, width - margin.right]).padding(0.2);

      x.domain(countData.map(function(d) { return d.index; }));

      let y = d3
        .scaleLinear()
        .domain([0, d3.max(countData, d => d.len)])
        .nice()
        .range([height - margin.bottom, margin.top]);

      let area = d3
        .area()
        .curve(curve)
        .x(d => x(d.index))
        .y0(y(0))
        .y1(d => y(d.len));

      let line = d3
        .line()
        .curve(curve)
        .x(d => (d.x))
        .y(d => (d.y));

      const svg = d3
        .select("#stack-view")
        .append("svg")
        .attr("width", width)
        .attr("height", height + 200)
        .attr("font-size", 16)
        .attr("font-family", "sans-serif");

      let yAxis = svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(5))
        .call(g => g.select(".domain").remove())
        .call(g =>
          g
            .select(".tick:last-of-type text")
            .clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
        );

      svg.append('g').selectAll(".line")
          .data([1,2,3,4])
          .enter().append("line")
          .attr("x1", margin.left)
          .attr("x2", width - margin.right)
          .attr("y1", function(d) { return y(d); })
          .attr("y2", function(d) { return y(d); })
          .attr('stroke', '#ccc')
          .attr('opacity', 1)
      
      svg.append('g').selectAll(".bar")
          .data(countData)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.index); })
          .attr("y", function(d) { return y(d.len); })
          .attr("width", x.bandwidth())
          .attr('fill', '#aaa')
          .attr('opacity',1)
          .attr("height", function(d) { return (height - margin.bottom) - y(d.len); });

      svg.append('g').selectAll(".barH")
          .data(countData)
          .enter().append("rect")
          .attr("class", "barH")
          .attr("x", function(d) { return x(d.index); })
          .attr("y", function(d) { return y(d.len); })
          .attr("width", x.bandwidth())
          .attr('fill','black')
          .attr('opacity',0.9)
          .attr("height", 2);

      svg
        .selectAll("rg")
        .data(originData)
        .enter()
        .append("g")
        .attr("transform", function(d, i) {
          d.x = (margin.left + (i * (width - margin.left - margin.right)) / countData.length)
          return (
            "translate(" + d.x + "," + 10 + ")"
          );
        })

        .attr('x', d=>d.x)
        .selectAll("r")
        .data(d => d)
        .enter()
        .append("circle")
        .attr("fill", d => accent(d.type))
        .attr("stroke", "grey")
        .attr('stroke-width', 0)
        .attr("r", 4)
        .attr("cx", 0)
        .attr("cy", function(d, i) {
          return height + i * 10 - 25;
        })
        .on("mouseover", function(d) {

          let x = parseInt(d3.select(this.parentNode).attr('x')) + 20
          let y = parseInt(d3.select(this).attr('cy'))
          let string = ""

          for(let key in d){

            string += (key + ':' + d[key] + '<br>')
          }

          d3.select("#tooltip")
            .select("#name")
            .html('Stack Info');
          
          d3.select("#tooltip")
            .style("left", x + "px")
            .style("top", 130 + "px")
            .select("#value")
            .html(string);

          d3.select("#tooltip").classed("hidden", false);

          let startPoint = {'x': x-20, 'y': y + 15}
          let targets = []

          targets.push(d.heapLoc)
          if (d['add1'] != undefined) targets.push(d.add1)
          if (d['add2'] != undefined) targets.push(d.add2)
          if (d['add3'] != undefined) targets.push(d.add3)
          if (d['add4'] != undefined) targets.push(d.add4)

          let links = []

          svg.selectAll('.heap').attr('fill','none')

          targets.forEach(function(target){

            let node = svg.select('#Heap' + target)

            node.attr('fill', d => accent(d.type))
            
            let x = parseInt(node.attr('x'))
            let y = parseInt(node.attr('y'))
            let endPoint = {'x': x + 5, 'y': y + 5}
            let middlePoint = {'x': (startPoint.x + x) / 2, 'y': 440}
            links.push([startPoint, middlePoint, endPoint])
          })

          svg.selectAll('.link').remove()

          svg.selectAll('.link')
          .data(links)
          .enter()
          .append('path')
          .datum(d => d)
          .attr('d', line)
          .attr('fill','none')
          .attr('stroke', '#e74c3c')
          .attr('stroke-width', 2)
          .attr('class','link')
          .attr('opacity', 0)
          
          svg.selectAll('.link')
          .transition()
          .attr('opacity', 0.6)
         
        })
        .on("mouseout", function() {

          d3.select("#tooltip").classed("hidden", true);
          svg.selectAll('.link').remove()
          svg.selectAll('.heap').attr('fill', d => accent(d.type))

			  })

      svg
        .append("text")
        .text("Heap Info")
        .attr("x", 50)
        .attr("y", 310)
        .attr('font-size', 14)

       svg
        .append("text")
        .text("Stack Len")
        .attr("x", 15)
        .attr("y", 30)
        .attr('font-size', 14)

      svg
        .append("rect")
        .attr("x", 150)
        .attr("y", 300)
        .attr("fill", "#bbb")
        .attr("width", 107 * 10)
        .attr("height", 10);

      svg
        .selectAll("heap")
        .data(heapList)
        .enter()
        .append("rect")
        .attr('class','heap')
        .attr("id", d => "Heap" + d.heapLoc)
        .attr("fill", d => accent(d.type))
        .attr("stroke", "none")
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", function(d, i) {
          return d.heapLoc * 10 + 150;
        })
        .attr("y", 300)
        .on("mouseover", function(d) {

          let x = parseInt(d3.select(this).attr('x')) + 20
          let y = parseInt(d3.select(this).attr('y')) 
          let string = ""

          for(let key in d){
            
            if(key == 'type' || key == 'heapLoc')
              string += (key + ':' + d[key] + '<br>')
            if(d['type'] == 'NNum' && key == 'value')
              string += (key + ':' + d[key] + '<br>')
          }

          d3.select("#tooltip")
            .select("#name")
            .html('Heap Info');
          
          d3.select("#tooltip")
            .style("left", x + "px")
            .style("top", y + "px")
            .select("#value")
            .html(string);

          d3.select("#tooltip").classed("hidden", false);
         
        })
        .on("mouseout", function() {

					d3.select("#tooltip").classed("hidden", true);

        })
        
      /*svg
        .selectAll("heap_value")
        .data(heapList.filter(d => d.type == 'NNum'))
        .enter()
        .append("text")
        .attr("x", function(d, i) {
          return d.heapLoc * 10 + 150;
        })
        .attr("y", 325)
        .attr('font-size',14)
        .text(d => d.value)*/

      svg
        .append("text")
        .text("Used space:" + heapList.length)
        .attr("x", 1230)
        .attr("y", 310)
        .attr('font-size', 14)

      let typeList = [];

      for (let type in typeDict) {
        typeList.push(type);
      }

      let legend = svg
        .selectAll("legend")
        .data(typeList)
        .enter()
        .append("g");

      legend
        .append("circle")
        .attr("r", 5)
        .attr("fill", d => accent(d))
        .attr("cx", function(d, i) {
          return i * 100 + 800;
        })
        .attr("cy", 5);

      legend
        .append("text")
        .text(d => d)
        .attr("font-size", 14)
        .attr("x", function(d, i) {
          return i * 100 + 810;
        })
        .attr("y", 10);
    },
    update() {
      let that = this;

      DataProvider.getStackData().then(
        response => {
          that.data = response.data;

          that.chartInit(that.data);
        },
        error => {
          that.loading = false;
        }
      );
    }
  },
  mounted() {
    d3.select("#" + "stack-view-container")
      .style("position", "absolute")
      .style("top", "30%")
      .style("left", "10%");

    this.width = 1400;
    this.height = 250;
    this.update();
  }
};
</script>

<style scoped>
#stack-view-container {
  width: 70%;
  height: 40%;
}

.name {
  border-left: #333 solid 35px;
  border-right: #aaa solid 5px;
  color: black;
  font-size: 30px;
  padding-left: 10px;
  margin-left: 20px;
  margin-bottom: 10px;
  left: 0px;
  font-family: Helvetica;
}

#tooltip {
  position: absolute;
  width: 150px;
  height: auto;
  padding: 10px;
  background-color: white;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  -webkit-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  pointer-events: none;
}

#tooltip.hidden {
  display: none;
}

#tooltip p {
  margin: 0;
  font-family: "Microsoft Yahei";
  font-size: 12px;
  line-height: 20px;
}
</style>