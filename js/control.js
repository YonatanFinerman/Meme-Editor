'use strict'
let gElCanvas
let gCtx
var gCurrMemeId
var gCurrMemeUrl

function init() {
    gElCanvas = document.getElementById('my-canvas')
    gCtx = gElCanvas.getContext('2d')
    setGIsMyMemes(false)
    renderMemeImgs()
    renderKeyWordsSizes()
    resizeCanvas()
    window.addEventListener('resize', () => {
        resizeCanvas()
        drawImg(gCurrMemeUrl)
    })
}

// didnt have enught time to fix I know im close
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
    }
}



function onMemeTextInput(val) {
    var currMeme = findMemeById(gCurrMemeId)
    currMeme.lines[(+currMeme.selectedLineIdx)].text = val
    addTextTOcanvas()
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

            drawText(line.text, canvasXCenter, line.size, line.size, line.color, line.align, line.font)
        }
        else if (idx === 1) {
            drawText(line.text, canvasXCenter, gElCanvas.height - line.size, line.size, line.color, line.align, line.font)
        }
        else {
            drawText(line.text, canvasXCenter, canvasYCenter, line.size, line.color, line.align, line.font)
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

function drawText(text, x, y, size = 40, color, align, font) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = color
    gCtx.font = `${size}px ${font}`;
    gCtx.textAlign = align
    gCtx.textBaseline = 'middle'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
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





