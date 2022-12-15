'use strict'

function downloadCanvas(elLink) {
    const data = gElCanvas.toDataURL() 
    elLink.href = data 
   
}