<template>
  <div id="app">
    <div class="float-layer left-float-layer">
  
    </div>

    <stack-view />

   
  </div>


</template>

<script>

import stackView from './components/StackView'
import DynamicAttrIndicator from './components/DynamicAttrIndicator'
import FixedAttrIndicator from './components/FixedAttrIndicator'
import DataProvider from './DataProvider';

export default {
  name: 'App',
  components: {
   stackView,
   FixedAttrIndicator,
   DynamicAttrIndicator
   
  },
  data () {
    return {
      bubbleData: {}
    }
  },
  mounted: function() {

  }
}
</script>

<style>
#app {
  font-family: 'Microsoft Yahei', 'Avenir', Helvetica, Arial, sans-serif;
}

.float-layer {
  position: absolute;
  z-index:999;
  width:27%;
  height:100%;

}

.left-float-layer{

  left:0px;
  height:50%;
}

.right-float-layer{

  right:0px;
  background:#F3F3F3;
  
}


body {
    margin:0; 
    padding:0;
    width:100%;
    height:100%;
}

.chart-name{
    color:white; 
    margin-bottom:30px;
    border-top: 3px solid #F0B04D;
    background: rgba(255,255,255,0.1);
    padding:10px;
    
}

.chart-name-right{

    float:right; 
    right:0px;
    margin: 0%;
    
}

.chart-name-left{

    float:left; 
    left:10px; 
    margin: 5%;
   

}
</style>
