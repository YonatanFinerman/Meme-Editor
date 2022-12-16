'use strict'

let gMemes
let gMyMemes
var gIsMyMemes = false
const MEME_STORAGE_KEY = 'meDB'

_createMemes()
_createMyMemes()

function _createMyMemes() {
    gMyMemes = getFromStorage(MEME_STORAGE_KEY)
    if (!gMyMemes || !gMyMemes.length) {
        gMyMemes = []
    }
}

function setGIsMyMemes(val) {
    gIsMyMemes = val
}
function getMyMemes() {
    return gMyMemes
}

function saveMeme(canvas, id) {
    var memer = findMemeById(id)
    if (memer.myid) {
        var idx = gMyMemes.findIndex(meme => { meme.myid === memer.myid })
        gMyMemes.splice(idx, 1)
    }
    var currMeme = JSON.parse(JSON.stringify(memer))
    currMeme.url = canvas.toDataURL("image/jpg")
    currMeme.myid = makeId()
    gMyMemes.push(currMeme)
    console.log(currMeme)
    saveToStorage(MEME_STORAGE_KEY, gMyMemes)
}

function findMemeById(id) {
    return getMemes().find(meme => (+meme.id) === id)
}

function findMemeByIdx(idx) {
    return gMemes[idx]
}

function createMeme(id) {
    return {
        id,
        selectedLineIdx: 0,
        url: `img/${id}.jpg`,

        lines: [
            {
                text: 'hi how are you?',
                size: 50,
                align: 'center',
                color: 'white',
                font: 'Impact'
            }
        ]
    }
}

function updateNewLineIdx(id) {
    let currMeme = findMemeById(id)
    currMeme.selectedLineIdx++
  
}

function changeCurrExistingLine(id) {
    let currMeme = findMemeById(id)
    currMeme.selectedLineIdx++
    if (currMeme.selectedLineIdx >= currMeme.lines.length) {
        currMeme.selectedLineIdx = 0
    }
}




function _createMemes() {
    let memes = []

    for (let i = 0; i < 18; i++) {
        memes.push(createMeme(i))
    }
    gMemes = memes
}

function getMemes() {
    if (gIsMyMemes) {
        return gMyMemes
    }
    else return gMemes
}

function updateLineIdx(id) {
    let currMeme = gMemes.find(meme => meme.id === id)
    currMeme.selectedLineIdx++
}
function addNewLine() {
    return {
        txt: '',
        size: 60,
        align: 'center',
        color: 'white',
        font: 'Impact'
    }
}