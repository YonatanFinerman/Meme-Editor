'use strict'

let gMemes




function findMemeById(id){
    console.log('id',id)
    return gMemes.find(meme=>(+meme.id) === id)
}
function findMemeByIdx(idx){
    console.log('idx',idx)
    return gMemes[idx]
}

function createMeme(id) {
    return {
        id,
        selectedLineIdx: 0,

        lines: [
            {
                text: 'hi how are you?',
                size: 50,
                align: 'center',
                color: 'white'
            }
        ]
    }
}
function updateLineIdx(id) {
    let currMeme = gMemes.find(meme => meme.id === id)
    currMeme.selectedLineIdx++
}


createMemes()

function createMemes() {
    let memes = []
    
    for (let i = 0; i < 18; i++) {
        memes.push(createMeme(i))
    }
    gMemes = memes
}

function getMemes() {
    return gMemes
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
        color: 'white'
    }
}