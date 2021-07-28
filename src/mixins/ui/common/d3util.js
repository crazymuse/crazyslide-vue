export function init_ui(svgelem,params){
    svgelem.attr("width", params.canvasWidth)
    .attr("height", params.canvasHeight)
    .attr("viewBox",`0 0 ${params.canvasWidth*params.scale} ${params.canvasHeight*params.scale}`)
    return svgelem
}
