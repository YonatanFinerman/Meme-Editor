'use strict'
let gElCanvas
let gCtx
var gCurrMemeId


function init() {
    gElCanvas = document.getElementById('my-canvas')
    gCtx = gElCanvas.getContext('2d')
    renderMemeImgs()
    resizeCanvas()
    // addEventListeners()
    window.addEventListener('resize', () => {
        drawImg(id)
    })
}

function renderMemeImgs() {
    var imgs = getMemes()
    var strHTML = imgs.map((img) => {
        return `<img class="meme-card" onclick="onCardClick(${img.id})"  src="img/${img.id}.jpg">`
    })
    document.querySelector('.gallery-container').innerHTML = strHTML.join('')
}


function onCardClick(id) {
    document.querySelector('.main-cont').hidden = true
    document.querySelector('.meme-editor').hidden = false
    drawImg(id)
    gCurrMemeId = id
    console.log(gCurrMemeId)
}

function drawImg(id) {
    const elImg = new Image()
    elImg.src = `img/${id}.jpg`
    elImg.onload = () => {

        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
        addTextTOcanvas()
    }
}

function onMemeTextInput(val){
    var currMeme = getMemes().find(meme => meme.id === gCurrMemeId)
    currMeme.lines[(+currMeme.selectedLineIdx)].text = val
    addTextTOcanvas()
    drawImg(gCurrMemeId)

}

function addTextTOcanvas() {
    let currMeme = getMemes().find(meme => meme.id === gCurrMemeId)
    console.log('cur mem',currMeme)
    let canvasXCenter = gElCanvas.width / 2
    let canvasYCenter = gElCanvas.height / 2

    currMeme.lines.forEach((line, idx) => {
        if (idx === 0) {
            
            drawText(line.text, canvasXCenter, line.size, line.size, line.color)
        }
        else if (idx === 1) {
            drawText(line.text, canvasXCenter, gElCanvas.height - line.size, line.size, line.color)
        }
        else {
            drawText(line.text, canvasXCenter, canvasYCenter, line.size, line.color)
        }
    })


}
function drawText(text, x, y, size = 40, color) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = color
    gCtx.font = `${size}px Impact`;
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'

    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}

function onAddTextLine(){
    updateLineIdx(gCurrMemeId)
    let elMemeInput = document.querySelector('.meme-text')
    let currMeme = getMemes().find(meme => meme.id === gCurrMemeId)
    currMeme.lines.push(addNewLine())
    elMemeInput.value = ''
}