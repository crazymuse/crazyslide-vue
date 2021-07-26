<template>
        <div class="container section center">
            <div class="row center">
                <header class="ghostwhite section">
                    <h2 class="center darkslategrey-text">
                        {{displayTitle}}
                    </h2>
                    <p class="float-text darkslate-text center text-lighten-2">
                        {{displaySubTitle}}
                    </p>
                </header>
            </div>
            <div class="row">
                
                <div class="col s12 m12">
                  
                    <form action="" class="card z-depth-0 center">
                        <div class="container" >
                            <div class="row">
                                <div class="col s6 m3">
                                    <span class="darkslategray-text">
                                        mean
                                    </span>            
                                </div>
                                <div class="col s6 m6">
                                    <div class="range-field" style="margin-top: -7px;">
                                        <input type="range" class="mean-field-name" min="0" max="100"   v-model="meanVal" @change="updateDisplay"/>
                                    </div>    
                                </div>
                                <div class="col s6 m3">
                                    <span class="darkslategray-text mean-field-value">
                                        {{meanVal/10}}
                                    </span>            
                                </div>
                                
                                        
                            </div>

                        </div>
                        <div class="container params">
                            <div class="row">
                                <div class="col s6 m3">
                                    <span class="darkslategray-text">
                                        std
                                    </span>            
                                </div>
                                <div class="col s6 m6">
                                    <div class="range-field" style="margin-top: -7px;">
                                        <input type="range" class="std-field-name" min="0" max="100"  v-model="stdVal" @change="updateDisplay"/>
                                    </div>    
                                </div>

                                <div class="col s6 m3">
                                    <span class="darkslategray-text std-field-value">
                                        {{stdVal/20}}
                                    </span>            
                                </div>
                                
                                        
                            </div>

                        </div>

                    </form>
               </div>
                <div class="col s12 m12">
                    <div class="canvasabc">
                    </div>
                </div>
            </div>
        </div>

</template>

<script>
/////////////////////////////////////////////
/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.4 - Adding SVGs with D3
*/

import {PlotDistribution,genericGenerator,plotPath} from '../mixins/ui/hist-with-area'


  function createPlotPath(g,pData){
    const paths = g.append("path")
    .datum(pData.hist)
    return paths           
  }


let pAry = window.jStat.rand(1,10000)[0]
let normalfunc = (x,mu,sigma)=>(1/(Math.sqrt(2*Math.PI)*sigma))*Math.exp(-1*(x-mu)*(x-mu)/(2*sigma*sigma))

let generator = genericGenerator(20000,[-10,10],50)

function updatePlot(ph,paths,params,mu,sigma){
    //mu = parseFloat(document.querySelector('.mean-field-name').value)/10
    //sigma = parseFloat(document.querySelector('.std-field-name').value)/20
    //console.log(mu,sigma)
    if (Math.random()>0){
      let ftf = generator(normalfunc,mu/10,sigma/20)
      //console.log(ftf(0),normalfunc(0,0,1))
      ph.update(pAry.map(d=>ftf(d)))
    }else{
    ph.update(pAry)
    }
    plotPath(paths,ph.pData,ph.axis,params)        
}


//////////////////////////////////////////////////////////////////////////////



  
export default {
  name: 'TwoSlider',
  components: {
    //HelloWorld    
  },
  props:{
      displayTitle:{
          //Title to be displayed
          type: String,
          default:'Visualization'
      },
      displaySubTitle:{
          type: String,
          default: 'Gaussian Plot with variable mean and standard deviation'
      },
      nPts:{
          type:Number,
          default:10000
      },
      mean:{
          type:Number,
          default:50
      },
      std:{
          type:Number,
          default:20
      },
      nBins:{
          type:Number,
          default: 20
      },
      nTicks:{
          type:Number,
          default:20
      },
      nGeneratorPts:{
          type: Number,
          default:20000,

      },
      nGeneratorBins:{
          type:Number,
          default:20
      }
  },
  data : function(){
        return  {
            meanVal : this.mean,
            stdVal :this.std
        }
    },
  methods:{
      updateDisplay(){
          console.log
          //let paths = createPlotPath(this.this.ph.g,this.ph.pData)
          updatePlot(this.ph,this.paths,this.params,this.meanVal,this.stdVal)
          //console.log(this.mean,this.std)
      }
  },
  computed:{
    plotsvg(){
      return '123'
    },
  },
  mounted: function(){
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
      let ph = new PlotDistribution('.canvasabc',pAry,[-10,10],20,params)
      this.ph = ph
      this.params = params
      ph.create()
      let paths = createPlotPath(ph.g,ph.pData)
      this.paths=paths
      updatePlot(ph,paths,params,this.meanVal,this.stdVal)
  },
}

</script>

<style scoped>
    * {
        font-size: 21px;
        font-family: 'Poppins';
    }
</style>    