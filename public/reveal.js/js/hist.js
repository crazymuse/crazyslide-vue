/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.4 - Adding SVGs with D3
*/

function getHistogram(pAry, xRange, nBins) {
    step = (xRange[1]-xRange[0])/nBins
    pFiltAry = pAry.filter(x=>xRange[0]<=x<=xRange[1])
    pOutAry = Array(nBins).fill(0)
    for(e of pFiltAry){
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
           'x':d3.format('0.1f')((i+0.5)*step+xRange[0])
            }
      })
    }
  
  }

function invMappingFunction(nPts,xRange,nBins){
    pts = jStat.rand((1,nPts))[0].map(d=>xRange[0]+d*(xRange[1]-xRange[0]))
    hout = getHistogram(pts,xRange,nBins)
    return function(f,mu,sigma){
        hcum=0
        hout.hist = hout.hist.map(o =>{
            o.yn = o.y*f(o.x,mu,sigma)
            hcum=hcum+o.yn
            o.ycum=hcum
            return o
        })
        ysum = hout.hist.map(o=>o.yn).reduce((a,b)=>a+b)
        hout.hist.map(o=>{
            o.ycumnorm=o.ycum/ysum
            o.yprob = o.yn/ysum
            return o
        })

        return function(xval){
                    
            filteredAry = hout.hist.find(d=>d.ycumnorm>xval)
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
  
  params = {
    fullWidth : 600,
    fullHeight :400,
    leftMargin : 100,
    rightMargin: 10,
    topMargin : 10,
    bottomMargin : 130,
    getWidth(){
      return this.fullWidth-this.leftMargin-this.rightMargin
    },
    getHeight(){  
      return this.fullHeight - this.topMargin - this.bottomMargin
    }
  }

  function createPlotPath(g,pData){
    const paths = g.append("path")
    .datum(pData.hist)
    return paths           
  }
  function plotPath(paths,pData,axis){
        let y = axis.y
        let x = axis.x
        paths
        .datum(pData.hist)           
          .attr("fill", "rgb(47,168,198,0.3)")
          .attr("d", d3.area()
                        .x((d) => x(d.x))
                        .y0( d => this.params.getHeight())
                        .y1(d =>y(d.y))   
          )
  }