export function getHistogram(pAry, xRange, nBins) {
    let step = (xRange[1]-xRange[0])/nBins
    let pFiltAry = pAry.filter(x=>xRange[0]<=x<=xRange[1])
    let pOutAry = Array(nBins).fill(0)
    for(const e of pFiltAry){
      pOutAry[parseInt((e-xRange[0])/step)]+=1
    }

    return {
      xRange,
      nBins,
      'hist':pOutAry.map(function(e,i){
        return {
            'y':e,
           'xst':i*step+xRange[0],
           'xed':(i+1)*(step)+xRange[0],
           'x':(i+0.5)*step+xRange[0]
            }
      })
    }
  
  }
  

