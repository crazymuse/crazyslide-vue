<template>
  <div class="reveal">
  <div class="slides">
      <section>
						<h2>Basement Level 1</h2>
						<p>Nested slides are useful for adding additional detail underneath a high level horizontal slide.</p>
      </section>
      <section>
						<h2>Basement Level 2</h2>
						<p>Nested slides are useful for adding additional detail underneath a high level horizontal slide.</p>
      </section>
      <section>
        <div class="container section">
            <div class="row">
                <div class="col s12 m6">
                  <TwoSlider></TwoSlider>
               </div>

                <div class="col s12 m5 push-m1">
                    <div class="canvasabc" v-on:load="loaddata">
                    </div>
                </div>
            </div>
        </div>
                  
      </section>
    </div>      
  </div>
  
</template>

<script>
import TwoSlider from './components/TwoSlider.vue'
import * as d3 from "d3"
/////////////////////////////////////////////
/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.4 - Adding SVGs with D3
*/

function getHistogram(pAry, xRange, nBins) {
    let step = (xRange[1]-xRange[0])/nBins
    let pFiltAry = pAry.filter(x=>xRange[0]<=x<=xRange[1])
    let pOutAry = Array(nBins).fill(0)
    for(const e of pFiltAry){
      pOutAry[parseInt((xRange[1]-e)/step)]+=1
    }
    return {
      xRange,
      nBins,
      'hist':pOutAry.map(function(e,i){
        return {
            'y':e,
           'xst':i*step+xRange[0],
           'xed':(i+1)*(step)+xRange[0],
            }
      })
    }
  
  }

function invMappingFunction(nPts,xRange,nBins){
    let pts = window.jStat.rand((1,nPts))[0].map(d=>xRange[0]+d*(xRange[1]-xRange[0]))
    let hout = getHistogram(pts,xRange,nBins)
    return function(f,mu,sigma){
        let hcum=0
        hout.hist = hout.hist.map(o =>{
            o.yn = o.y*f(o.x,mu,sigma)
            hcum=hcum+o.yn
            o.ycum=hcum
            return o
        })
        let ysum = hout.hist.map(o=>o.yn).reduce((a,b)=>a+b)
        hout.hist.map(o=>{
            o.ycumnorm=o.ycum/ysum
            o.yprob = o.yn/ysum
            return o
        })

        return function(xval){
                    
            let filteredAry = hout.hist.find(d=>d.ycumnorm>xval)
            if ((!filteredAry) || (filteredAry.length==0)){
                return hout.hist[0].xst
            }
            else{
                return (filteredAry.xst+filteredAry.xed)/2
            }
        }

    }
}
  
  class PlotDistribution {
    constructor(svgSelector, pAry, xRange, nBins, params) {
      this.svg = d3.select(svgSelector).append("svg")
      this.pAry=pAry
      this.xRange = xRange
      this.nBins=nBins
      this.params = params
      this.pData = getHistogram(pAry,xRange,nBins)
      this.t = d3.transition().duration(750)
  
    }
    
    createDims() {
      this.svg.attr("width", this.params.fullWidth)
        .attr("height", this.params.fullHeight)
  
      const g = this.svg.append('g')
        .attr('transform', `translate(${this.params.leftMargin},${this.params.topMargin})`)
      return g
    }
  
    createLabels(g,xLabel,yLabel) {
      //Added X-Title
      g.append('text')
        .attr("class", "x axis-label")
        .attr("x", this.params.getWidth() / 2)
        .attr("y", this.params.getHeight() + 60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text(xLabel)
      //Create Y-Title
      g.append('text')
        .attr("class", "y axis-label")
        .attr("x", - (this.params.getHeight() / 2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text(yLabel)
        }
    
    createAxis(g){
      this.xAxisGroup = g.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${this.params.getHeight()})`)
      this.yAxisGroup = g.append("g")
        .attr("class", "y axis")
    }
  
    updateAxis(g,pData){
      //Create the axis for the data
      const x = d3.scaleBand()
      .domain(pData.hist.map(d => d.x ))
      .range([0, this.params.getWidth()])
      .paddingInner(0.3)
      .paddingOuter(0.2)   
    
    const y = d3.scaleLinear()
      .domain([0, d3.max(pData.hist, d => d.y)])
      .range([this.params.getHeight(), 0])
    
      const xAxisCall = d3.axisBottom(x)
                          //.tickFormat(d=>d3.format('0.2f')(d))
  
  
      this.xAxisGroup.call(xAxisCall)
        .selectAll("text")
          .attr("y", "10")
          .attr("x", "-5")
          .attr("text-anchor", "end")
  
  
      const yAxisCall = d3.axisLeft(y)
        .ticks(10)
        .tickFormat(d => d)
      this.yAxisGroup
        .call(yAxisCall)
      
      return {x:x,y:y,g:g}
    }
  
    plotData(g,pData,axis){    
      let y = axis.y
      let x = axis.x
      const rects = g.selectAll("rect")
      .data(pData.hist)
      // Exit old Data
      rects.exit()
      .attr("fill", "red")
      .transition(this.t)
        .attr("height", 0)
        .attr("y", y(0))
        .remove()
          
      rects.enter().append("rect")
        .attr("fill", "rgb(47,168,198)")
        .attr("y", y(0))
        .attr("height", 0)
        .attr("x", (d) => x(d.x))
        .attr("width", x.bandwidth)
        .merge(rects)
        .transition(this.t)
        .attr("y", d => y(d.y))
        .attr("height", d => this.params.getHeight() - y(d.y))
    }
        
    create(){
      this.g = this.createDims()
      this.createLabels(this.g,'bins','count')
      this.createAxis(this.g)
      this.update(this.pAry)
    } 
    update(pAry){
      this.pAry=pAry
      this.pData = getHistogram(this.pAry,this.xRange,this.nBins)
      let axis = this.updateAxis(this.g,this.pData)
      this.axis=axis
      this.plotData(axis.g,this.pData,axis)
    }
  }
  
  let params = {
    fullWidth : 600,
    fullHeight :400,
    leftMargin : 100,
    rightMargin: 10,
    topMargin : 10,
    bottomMargin : 130,
    getWidth(){
      return 600-110;
    },
    getHeight(){  
      return 400-140;
      }
  }

  function createPlotPath(g,pData){
    const paths = g.append("path")
    .datum(pData.hist)
    return paths           
  }




///////////////////////////////////////////////
function GenericGenerator(){
    //let pAry=window.jStat.rand(1,10000)[0]
    let finv = invMappingFunction(1000,[-10,10],100)
    return finv
}


let pAry = window.jStat.rand(1,10000)[0]
let normalfunc = (x,mu,sigma)=>(1/(Math.sqrt(2*Math.PI)*sigma))*Math.exp(-1*(x-mu)*(x-mu)/(2*sigma*sigma))
let mu=5
let sigma = 1
let ftf = GenericGenerator()(normalfunc,mu,sigma)




//////////////////////////////////////////////////////////////////////////////



  
export default {
  name: 'App',
  components: {
    TwoSlider
    //HelloWorld    
  },
  data: function (){
    return {
      randomval : window.window.jStat.randn(1,10)
    }
  },
  methods:{
      loaddata(){
        console.log('load called')
      }
  },
  computed:{
    plotsvg(){
      d3.select('.canvas').append('svg')
      return '123'
    },
  },
  mounted: function(){
      let ph = new PlotDistribution('.canvasabc',pAry.map(d=>ftf(d)),[-10,10],20,params)
      ph.create()
      let paths = createPlotPath(ph.g,ph.pData)
      function updatePlot(){
        let mu = 5
        let sigma = 1
        console.log(mu,sigma)
        //console.log(pAry.map(d=>ftf(d)))
        ph.update(pAry)
        function plotPath(paths,pData,axis){
              let y = axis.y
              let x = axis.x
              paths
              .datum(pData.hist)           
                .attr("fill", "rgb(47,168,198,0.3)")
                .attr("d", d3.area()
                              .x((d) => x(d.x))
                              .y0( () => params.getHeight())
                              .y1(d =>y(d.y))   
                ) 
        }
        plotPath(paths,ph.pData,ph.axis)        
      }
      updatePlot()
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>