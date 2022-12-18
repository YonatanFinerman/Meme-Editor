'use strict'
let gElCanvas
let gCtx
var gCurrMemeId
var gCurrMemeUrl
var isSelectedLine = false
const  TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

function init() {
    gElCanvas = document.getElementById('my-canvas')
    gCtx = gElCanvas.getContext('2d')
    setGIsMyMemes(false)
    renderMemeImgs()
    renderKeyWordsSizes()
    resizeCanvas()
    addListeners()
   
}
function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        resizeCanvas()
        drawImg(gCurrMemeUrl)
    })

}


function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    // gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    // gElCanvas.addEventListener('touchend', onUp)
}


function renderKeyWordsSizes(){
    var keyWordsSizes = getKeyWordsSize()
    Object.keys(keyWordsSizes).forEach(key => {
      document.querySelector(`.${key}`).style.fontSize = keyWordsSizes[key] + 'px'
      });
}

function onMyMemes() {
    document.querySelector('.main-cont').style.display = 'grid'
    document.querySelector('.meme-editor').style.display = 'none'
    document.querySelector('.gallery-nav').style.display = 'none'

    document.body.classList.remove('menu-open')
    setGIsMyMemes(true)
    renderMemeImgs()
    setgFilterBy('')
}

function onGallery() {
    document.querySelector('.main-cont').style.display = 'grid'
    document.querySelector('.meme-editor').style.display = 'none'
    document.querySelector('.gallery-nav').style.display = 'flex'
    document.body.classList.remove('menu-open')
    setGIsMyMemes(false)
    renderMemeImgs()
}


function renderMemeImgs() {
    var imgs = getMemes()
    var strHTML = imgs.map((img) => {
        return `<img class="meme-card" onclick="onCardClick(${img.id})"  src="${img.url}">`
    })
    document.querySelector('.gallery-container').innerHTML = strHTML.join('')
}

function onCardClick(id) {
    var curMeme = findMemeById(id)
    document.querySelector('.main-cont').style.display = 'none'
    document.querySelector('.meme-editor').style.display = 'flex'
    gCurrMemeId = id
    gCurrMemeUrl = curMeme.url
    resizeCanvas()
    drawImg(gCurrMemeUrl)
}

function drawImg(url) {
    const elImg = new Image()
    var currMeme = findMemeById(gCurrMemeId)
    console.log(currMeme)
    if (currMeme.oldUrl) {
        elImg.src = `${currMeme.oldUrl}`
    }
    else {
        elImg.src = `${url}`
    }
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
        
        addTextTOcanvas()
        // if (isSelectedLine){
        //     addLineSelector(currMeme.selectedLineIdx)
        // }
        
       
    }
}



function onMemeTextInput(val) {
    var currMeme = findMemeById(gCurrMemeId)
    currMeme.lines[(+currMeme.selectedLineIdx)].text = val
    
    addTextTOcanvas()
    // var yStart = currMeme.lines[currMeme.selectedLineIdx].size/2
    
    drawImg(gCurrMemeUrl)
}

function onChangeLine() {
    changeCurrExistingLine(gCurrMemeId)
}

function addTextTOcanvas() {
    let currMeme = findMemeById(gCurrMemeId)
    let canvasXCenter = gElCanvas.width / 2
    let canvasYCenter = gElCanvas.height / 2
    currMeme.lines.forEach((line, idx) => {
        if (idx === 0) {

            drawText(line.text, canvasXCenter, line.size, line.size, line.color, line.align, line.font,idx)

            
        }
        else if (idx === 1) {
            drawText(line.text, canvasXCenter, gElCanvas.height - line.size, line.size, line.color, line.align, line.font,idx)
        }
        else {
            drawText(line.text, canvasXCenter, canvasYCenter, line.size, line.color, line.align, line.font,idx)
        }

    })
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container')
    const elEditor = document.querySelector('.editor')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}

function onAddTextLine() {
    addTextTOcanvas()
    updateNewLineIdx(gCurrMemeId)
    let elMemeInput = document.querySelector('.meme-text')
    // let currMeme = getMemes().find(meme => meme.id === gCurrMemeId)
    let currMeme = findMemeById(gCurrMemeId)
    currMeme.lines.push(addNewLine())
    elMemeInput.value = ''
}

function onSetFont(val) {
    let curMeme = findMemeById(gCurrMemeId)
    curMeme.lines[curMeme.selectedLineIdx].font = val
    let elMemeInputValue = document.querySelector('.meme-text').value
    onMemeTextInput(elMemeInputValue)
}



function onTrashClick() {
    let curMeme = findMemeById(gCurrMemeId)
    let elMemeInputValue = document.querySelector('.meme-text').value = ''
    onMemeTextInput(elMemeInputValue)
}

function onColorSet(val) {
    let curMeme = findMemeById(gCurrMemeId)
    curMeme.lines[curMeme.selectedLineIdx].color = val
    let elMemeInputValue = document.querySelector('.meme-text').value
    onMemeTextInput(elMemeInputValue)
}

function onSaveClick() {
    saveMeme(gElCanvas, gCurrMemeId)
}

function onChangeFontSize(val) {
    console.log(val)
    let curMeme = findMemeById(gCurrMemeId)
    if (curMeme.lines[curMeme.selectedLineIdx].size < 90 && val === '+') {
        curMeme.lines[curMeme.selectedLineIdx].size += 5
    }
    else if (curMeme.lines[curMeme.selectedLineIdx].size > 20 && val === '-') {
        curMeme.lines[curMeme.selectedLineIdx].size -= 5
    }
    let elMemeInputValue = document.querySelector('.meme-text').value
    onMemeTextInput(elMemeInputValue)
}

function onAlignText(val) {
    let curMeme = findMemeById(gCurrMemeId)
    if (val === 'right') {
        curMeme.lines[curMeme.selectedLineIdx].align = 'start'
    }
    else if (val === 'left') {
        curMeme.lines[curMeme.selectedLineIdx].align = 'end'
    }
    else if (val === 'center') {

        curMeme.lines[curMeme.selectedLineIdx].align = 'center'
    }

    let elMemeInputValue = document.querySelector('.meme-text').value
    onMemeTextInput(elMemeInputValue)
}

function drawText(text, x, y, size = 40, color, align, font,idx) {
   
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = color
    gCtx.font = `${size}px ${font}`;
    gCtx.textAlign = align
    gCtx.textBaseline = 'middle'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)

    // var currMeme = findMemeById(gCurrMemeId)
    
    // if(currMeme.selectedLineIdx=== idx){
    //     if(idx===0){
    //         drawImg(gCurrMemeUrl)
    //         drawLine(0,(y/2),gElCanvas.width,(y/2))
    //         drawLine(0,(y/2)+size,gElCanvas.width,(y/2)+size)
    //     }
    //     if(idx===1){
    //         drawImg(gCurrMemeUrl)
    //         drawLine(0,gElCanvas.height-size-(size/2),gElCanvas.width,gElCanvas.height-size-(size/2))
    //         drawLine(0,gElCanvas.height-(size/2),gElCanvas.width,gElCanvas.height-(size/2))
    //     }
    //     else if(idx>=2){
    //         drawImg(gCurrMemeUrl)
    //         drawLine(0,(gElCanvas.height/2)-(size/2),gElCanvas.width,(gElCanvas.height/2)-(size/2))
    //         drawLine(0,(gElCanvas.height/2)+(size/2),gElCanvas.width,(gElCanvas.height/2)+(size/2))
    //     }
    // }
}

function onUploadImg() {
    const imgDataUrl = gElCanvas.toDataURL('image/jpeg')

    function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`)
    }
    doUploadImg(imgDataUrl, onSuccess)
}

function toggleMenu() {
    document.body.classList.toggle('menu-open')
}

function onFilterMemes(val,ev) {
    ev.preventDefault()
    console.log(val)
    filterMemes(val,)
    var isExist = checkIfExists(val)
    if (isExist) {
        var Sizes = getKeyWordsSize()
        var size = ++Sizes[val]
        var elKeyWord = document.querySelector(`.${val}`)
        elKeyWord.style.fontSize = size + 'px'
        saveSizes(val)
    }
    renderMemeImgs()
}

function drawLine(x, y, xEnd = 250, yEnd = 250) {

    gCtx.lineWidth = 2
    gCtx.moveTo(x, y)
    gCtx.lineTo(xEnd, yEnd)
    gCtx.strokeStyle = 'black'
    gCtx.stroke()

}
 
function addLineSelector(LineIdx){
        var currMeme = findMemeById(gCurrMemeId)
    
      var lineSize = currMeme.lines[LineIdx].size
        if(LineIdx===0){

            var yS = currMeme.lines[currMeme.selectedLineIdx].yStart = (currMeme.lines[currMeme.selectedLineIdx].size/2) -5
        
        }
        else if(LineIdx===1){
            var yS = currMeme.lines[currMeme.selectedLineIdx].yStart = gElCanvas.height - lineSize - (lineSize/2)-5
            
        }
        else if(LineIdx>=2){
            var yS = currMeme.lines[currMeme.selectedLineIdx].yStart = (gElCanvas.height/2) - (lineSize/2)-5
           
        }
        var yE = currMeme.lines[currMeme.selectedLineIdx].yEnd = yS + currMeme.lines[currMeme.selectedLineIdx].size + 5
         drawLine(0,yS,gElCanvas.width,yS)
         drawLine(0,yE,gElCanvas.width,yE)
         console.log('yssss',yS,yE)
         resizeCanvas()
}



// function getEvPos(ev) {
//     // Gets the offset pos , the default poss
//     let pos = {
//         x: ev.offsetX,
//         y: ev.offsetY,
//     }
//     console.log('ev:', ev)
//     // Check if its a touch ev
//     if (TOUCH_EVS.includes(ev.type)) {
//         console.log('ev:', ev)
//         //soo we will not trigger the mouse ev
//         ev.preventDefault()
//         //Gets the first touch point
//         ev = ev.changedTouches[0]
//         //Calc the right pos according to the touch screen
//         pos = {
//             x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
//             y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
//         }
//     }
//     return pos
// }
// function onDown(ev){
//     getEvPos(ev)
// }
// function onMove(ev){
//     getEvPos(ev)
// }





