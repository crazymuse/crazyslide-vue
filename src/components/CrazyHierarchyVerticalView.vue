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
            <div class="row center">
                  <form action="#">
                    <p class="range-field">
                    <input type="range" id="crazyhierarchyverticalview" min=1 max=5 @change="updatehierarchy" v-model="sliderValue"/>
                    </p>
                </form>
            </div>
            <div class="row center">
                <div class="crazy-hierarchy-vertical-ui"></div>
            </div>
        </div>    
</template>
<script>


import * as hierarchy_vertical_ui from "../mixins/ui/hierarcy-vertical-view-d3"

export default {
    name: "CrazyHierarcyVerticalView",
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
      scale:{
          type: Number,
          default: 1.2
      },
        canvasWidth:{
            default:1000,

        },
        canvasHeight:{
            default:480
        },
    },
    data(){
        return {
            sliderValue:this.slider_value
        }
    },
    mounted(){
        let params={
            canvasWidth: this.canvasWidth,
            canvasHeight: this.canvasHeight,
            workingWidth : this.canvasWidth-100,
            workingHeight : this.canvasHeight-100,
            scale:this.scale
        }
        this.model_data = [
                {name:"typeofdist",
                title:"Types of Distribution",
                highlight:false,
                parent:""},
                {name:"discrete",
                title:"Discrete Distribution",
                highlight:false,
                parent:"typeofdist"},
                {name:"continuous",
                highlight:false,
                title:"Continuous Distribution",
                parent:"typeofdist"},
                {name:"piecewise",
                highlight:false,
                title:"Piecewise",
                parent:"continuous"},
                {name:"differentiable",
                highlight:true,
                title:"differentiable",
                parent:"continuous"}


        ]
        /**
         * @var		mixed	this.sliderValu
         */
        this.sliderValue=1
        this.ui = new hierarchy_vertical_ui.HierarcyVerticalViewD3(".crazy-hierarchy-vertical-ui",params,this.model_data.slice(0,this.sliderValue))
        
    },
    methods:{
        updatehierarchy(){
            console.log(this.sliderValue)
            console.log(this.model_data.slice(0,this.sliderValue))
            this.ui.update(this.model_data.slice(0,this.sliderValue))
        }
    }
}
</script>


<style scoped>
    * {
        font-size: 21px;
        font-family: 'Poppins';
    }
</style>    