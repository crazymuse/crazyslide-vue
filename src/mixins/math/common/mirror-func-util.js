import * as hist from '../core/hist'
export function invMappingFunction(nPts,xRange,nBins){
    let pts = Array.from(Array(nPts).keys()).map(()=>Math.random()).map(d=>xRange[0]+d*(xRange[1]-xRange[0]))
    let hout = hist.getHistogram(pts,xRange,nBins)
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
