import * as d3util from "./common/d3util"
import * as d3 from "d3"






export class HierarcyVerticalViewD3{

    constructor(dom_selector,params,model_data){
        this.svgelem=d3.select(dom_selector).append("svg")
        this.params = params
        this.model_data=model_data
        this.elements={'canvas': d3util.init_ui(this.svgelem,this.params)}
        this.elements.working=this.elements.canvas.append('g').attr('transform','translate(50,50)')
        this.colormap={
            primary:'#00ADB5',
            secondary:"#393E46",
            light: "#EEEEEE",
            dark: "#222831"
        }
        this.init_model()

    }
    init_model(){
        // Stratifies edge data to a hierarchy
        this.d3_tree = d3.tree().size([this.params.workingWidth,this.params.workingHeight])
        this.stratifier = d3.stratify()
            .id(d=>d.name)
            .parentId(d=>d.parent)
        this.update(this.model_data)
    }

    update(model_data,highlight_last=true){
        if (highlight_last==true){
            this.model_data = JSON.parse(JSON.stringify(model_data))
            this.model_data[this.model_data.length-1].highlight=true
            //highlight_last=false
        }
        let graph = this.elements.working
        graph.selectAll('.node').remove()
        graph.selectAll('.link').remove()
        
        // Attach Model Data to stratifier
        this.root_node = this.stratifier(this.model_data)
        // Add positioning and other d3 view options to the data
        const tree_data = this.d3_tree(this.root_node)
        let nodes = graph.selectAll('.node')
                            .data(tree_data.descendants())
        let links = graph.selectAll('.link')
            .data(tree_data.links())
        this.drawLinks(links)
        this.drawNodes(nodes)
    }
    
    /**
     * 
     * @param {*} nodes Node select Group to be drawn
     */
    drawNodes(nodes){
        
        const enterNodes = nodes.enter()
            .append('g')
            .attr('class','node')
            .attr('transform',d=>`translate(${d.x},${d.y})`)
        
        enterNodes.append('rect')
            .merge(nodes)
            .attr('fill',(d)=>{
                if(d.data.highlight==true){
                    return this.colormap.primary
                }else{
                    return this.colormap.light
                }}
                )
            .attr('stroke',this.colormap.primary)
            .attr('stroke-width',2)
            .attr("rx", 10)
            .attr('height',45)
            .attr('width',d=>d.data.title.length*10+30)
            .attr('transform',d=>{
                let x = d.data.title.length*10/2
                return `translate(${-x-15},-15)`
            })
        
        enterNodes.append('text')
            .attr('text-anchor','middle')
            .attr('fill',(d)=> d.data.highlight?this.colormap.light:this.colormap.dark)
            .text(d=>d.data.title)
            .attr('transform',()=>'translate(0,15)')
   
    }

    /**
     * 
     * @param {*} links Links select Group to be drawn 
     */
    drawLinks(links){
        links.enter()
            .merge(links)
            .append('path')
            .transition().duration(300)
            .attr('class','link')
            .attr('fill','none')
            .attr('stroke',this.colormap.primary)
            .attr('stroke-width',2)
            .attr('d',d3.linkVertical()
                        .x(d=>d.x)
                        .y(d=>d.y))
            
                
    }



}
