<template>
  <div id="insitution_name" class="value-indicator">
      <h3> {{ checkedNames }} </h3>
  </div>
</template>

<script>
export default {
  name: 'fixed-attrs',
  data() {
    return {
      checkedNames: '堆栈可视化'
    };
  },
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.value-indicator{

    border-top: 3px solid #F0B04D;
    position: absolute;
    background: rgba(255,255,255,0.1)
}


.value-indicator h3{

    color: black;
    margin: 0px;
    font-weight: 100
}

#insitution_name{

    top:50px;
    left:50px;
    padding: 10px;

}
</style>
