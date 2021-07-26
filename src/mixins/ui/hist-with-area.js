import * as d3 from "d3"
import * as hist from "../math/core/hist" 
import * as mirrorutil from "../math/common/mirror-func-util"



export class PlotDistribution {
    constructor(svgSelector, pAry, xRange, nBins, params) {
      this.svg = d3.select(svgSelector).append("svg")
      this.pAry=pAry
      this.xRange = xRange
      this.nBins=nBins
      this.params = params
      this.pData = hist.getHistogram(pAry,xRange,nBins)
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
                          .tickFormat(d=>d3.format('0.1f')(d))
  
  
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
      .transition( d3.transition().duration(750))
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
        .transition( d3.transition().duration(750))
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
      this.pData = hist.getHistogram(this.pAry,this.xRange,this.nBins)
      let axis = this.updateAxis(this.g,this.pData)
      this.plotData(axis.g,this.pData,axis)
      this.axis = axis
    }
  }
  


export function plotPath(paths,pData,axis,params){
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


///////////////////////////////////////////////
export function genericGenerator(nPts,xRange,nBins){
    //let pAry=window.jStat.rand(1,10000)[0]
    let finv = mirrorutil.invMappingFunction(nPts,xRange,nBins)
    return finv
}


