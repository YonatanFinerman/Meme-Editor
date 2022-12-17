'use strict'

let gMemes
let gMyMemes
let gFilterBy
var gIsMyMemes = false
let gKeyWords = ['funny','man','animal','baby','smile','comic']
let gKeywordsSize
const MEME_STORAGE_KEY = 'meDB'
const POP_STORAGE_KEY = 'poDB'


_createMemes()
_createMyMemes()
_addAllKeyWords()
_loadKeyWordsSizes()




function getKeyWordsSize(){
    return gKeywordsSize
}

function saveSizes(val){
    saveToStorage(POP_STORAGE_KEY,gKeywordsSize)
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
    currMeme.oldUrl = currMeme.url
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
                font: 'Impact',


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

function getMemes() {
    if (gFilterBy) {
        return gMemes.filter(meme => {
           return meme.keyWords.some(keyWord =>keyWord === gFilterBy)
            
        })
       
    }
    else if (gIsMyMemes) {
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

function checkIfExists(val){
    return (gKeyWords.find(keyWord => val===keyWord))
}

function filterMemes(val) {
    gFilterBy = val
}

function _loadKeyWordsSizes(){
    gKeywordsSize = getFromStorage(POP_STORAGE_KEY)
    if(!gKeywordsSize || !gKeywordsSize.length ){
        gKeywordsSize = {funny:15, man:15, animal:15, baby:15, comic:15}
    }
    
}

function _createMyMemes() {
    gMyMemes = getFromStorage(MEME_STORAGE_KEY)
    if (!gMyMemes || !gMyMemes.length) {
        gMyMemes = []
    }
}

function _createMemes() {
    let memes = []

    for (let i = 0; i < 18; i++) {
        memes.push(createMeme(i))
    }
    gMemes = memes
}

function _addKeywords(id, keywords) {
    var currMeme = findMemeById(id)
    currMeme.keyWords = keywords
}

function _addAllKeyWords() {
    _addKeywords(0, ['funny', 'man'])
    _addKeywords(1, ['animal'])
    _addKeywords(2, ['animal', 'baby'])
    _addKeywords(3, ['animal'])
    _addKeywords(4, ['funny', 'baby'])
    _addKeywords(5, ['smile', 'man'])
    _addKeywords(6, ['funny', 'baby'])
    _addKeywords(7, ['smile', 'man'])
    _addKeywords(8, ['smile', 'baby', 'funny'])
    _addKeywords(9, ['smile', 'man', 'funny'])
    _addKeywords(10, ['funny', 'man'])
    _addKeywords(11, ['funny', 'man'])
    _addKeywords(12, ['funny', 'man'])
    _addKeywords(13, ['man'])
    _addKeywords(14, ['smile', 'man'])
    _addKeywords(15, ['smile', 'man', 'funny'])
    _addKeywords(16, ['man'])
    _addKeywords(17, ['comic'])
}