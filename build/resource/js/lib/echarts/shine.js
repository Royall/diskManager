(function(e,t){typeof define=="function"&&define.amd?define(["exports","echarts"],t):typeof exports=="object"&&typeof exports.nodeName!="string"?t(exports,require("echarts")):t({},e.echarts)})(this,function(e,t){var n=function(e){typeof console!="undefined"&&console&&console.error&&console.error(e)};if(!t){n("ECharts is not Loaded");return}var r=["#c12e34","#e6b600","#0098d9","#2b821d","#005eaa","#339ca8","#cda819","#32a487"],i={color:r,title:{textStyle:{fontWeight:"normal"}},visualMap:{color:["#1790cf","#a2d4e6"]},toolbox:{iconStyle:{normal:{borderColor:"#06467c"}}},tooltip:{backgroundColor:"rgba(0,0,0,0.6)"},dataZoom:{dataBackgroundColor:"#dedede",fillerColor:"rgba(154,217,247,0.2)",handleColor:"#005eaa"},timeline:{lineStyle:{color:"#005eaa"},controlStyle:{normal:{color:"#005eaa",borderColor:"#005eaa"}}},candlestick:{itemStyle:{normal:{color:"#c12e34",color0:"#2b821d",lineStyle:{width:1,color:"#c12e34",color0:"#2b821d"}}}},graph:{color:r},map:{label:{normal:{textStyle:{color:"#c12e34"}},emphasis:{textStyle:{color:"#c12e34"}}},itemStyle:{normal:{borderColor:"#eee",areaColor:"#ddd"},emphasis:{areaColor:"#e6b600"}}},gauge:{axisLine:{show:!0,lineStyle:{color:[[.2,"#2b821d"],[.8,"#005eaa"],[1,"#c12e34"]],width:5}},axisTick:{splitNumber:10,length:8,lineStyle:{color:"auto"}},axisLabel:{textStyle:{color:"auto"}},splitLine:{length:12,lineStyle:{color:"auto"}},pointer:{length:"90%",width:3,color:"auto"},title:{textStyle:{color:"#333"}},detail:{textStyle:{color:"auto"}}}};t.registerTheme("shine",i)});