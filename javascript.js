const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 300
canvas.height = 540
ctx.fillStyle = 'black'
ctx.fillRect(0, 0, canvas.width, canvas.height)
ctx.fillStyle = 'white'
ctx.font = '18pt Arial'
ctx.fillText('Press "ENTER" to play', 32, 300)
ctx.fillText('Rotate \u2191', 120, 360)
ctx.fillText('Acelerate\u2193', 100, 420)
ctx.fillText('\u2190left   right\u2192', 80, 480)

const scorePrint = document.getElementById('score')
const levelPrint = document.getElementById('level')
const preview = document.getElementById('next')
const impactLine = new Audio('/public/line.wav')
impactLine.volume = 0.1
const musicGame = new Audio('/public/Tetris2024.mp3')
musicGame.volume = 0.1
const spinSound = new Audio('/public/spin.wav')
spinSound.volume = 0.1
const levelPass = new Audio('/public/levelpass.wav')
levelPass.volume = 0.1
const gameOver = new Audio('/public/gameover.mp3')
gameOver.volume = 0.1

let matrixTetris = {}

const defineMatrix = () => {
    for (let i = 0; i < 200; i++) {
        pieces.push(randPiece[Math.trunc(Math.random() * 7)])
    }
    matrixTetris = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
}

const tetriminos = {
    i: {
        color: 'r',
        spin: 2,
        0: [0, 1, 1, 1, 2, 1, 3, 1],
        1: [1, 0, 1, 1, 1, 2, 1, 3]
    },
    l: {
        color: 'm',
        spin: 4,
        0: [0, 0, 1, 0, 2, 0, 0, 1],
        1: [0, 0, 0, 1, 0, 2, 1, 2],
        2: [0, 1, 1, 1, 2, 1, 2, 0],
        3: [0, 0, 1, 0, 1, 1, 1, 2]
    },
    j: {
        color: 'y',
        spin: 4,
        0: [0, 0, 0, 1, 1, 1, 2, 1],
        1: [0, 2, 1, 0, 1, 1, 1, 2],
        2: [0, 0, 1, 0, 2, 0, 2, 1],
        3: [0, 0, 1, 0, 0, 1, 0, 2]
    },
    z: {
        color: 'o',
        spin: 2,
        0: [0, 0, 1, 0, 1, 1, 2, 1],
        1: [1, 0, 0, 1, 1, 1, 0, 2]
    },
    s: {
        color: 'c',
        spin: 2,
        0: [1, 0, 2, 0, 0, 1, 1, 1],
        1: [0, 0, 0, 1, 1, 1, 1, 2]
    },
    t: {
        color: 'g',
        spin: 4,
        0: [0, 0, 1, 0, 2, 0, 1, 1],
        1: [0, 0, 0, 1, 0, 2, 1, 1],
        2: [1, 0, 0, 1, 1, 1, 2, 1],
        3: [1, 0, 0, 1, 1, 1, 1, 2]
    },
    o: {
        color: 'b',
        spin: 1,
        0: [0, 0, 1, 0, 0, 1, 1, 1]
    }
}

let colorRgb = {
    r: 'rgb(255,0,0)', m: 'rgb(255,0,255)', y: 'rgb(255,255,0)',
    o: 'rgb(255,127,0)', c: 'rgb(0,255,255)', g: 'rgb(0,255,0)', b: 'rgb(0,0,255)'
}

let randPiece = ['i', 'l', 'j', 'z', 's', 't', 'o']
let pieces = []
let piecesOrder = 0
let score = 0
let spinPieces = 0
let levelVelocity = 15
let coordX = 5
let coordY = 0
let time = 0
let endGame = 0
let key = ''
let gameState = 'stoped'
let level = 1
let gameStatePause = 0

const startGame = () => {
    level = 1
    pieces = []
    piecesOrder = 0
    score = 0
    scorePrint.innerHTML = score.toString().padStart(6, '0')
    levelPrint.innerHTML = level
    spinPieces = 0
    levelVelocity = 15
    coordX = 5
    coordY = 0
    time = 0
    endGame = 0
    key = ''
    gameState = 'play'
    defineMatrix()
    musicGame.currentTime = 0
    musicGame.play()
    runGame()
}

const drawCubes = (x, y, color) => {
    ctx.fillStyle = color
    ctx.fillRect(x + 1, y + 1, 28, 28)
}

const drawMatrix = () => {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, 300, 540)
    for (let y = 0; y < 18; y++) {
        for (let x = 0; x < 10; x++) {
            if (matrixTetris[y][x] != 0) {
                drawCubes(x * 30, y * 30, colorRgb[matrixTetris[y][x]])
            }
        }
    }
}

const drawTetromino = () => {
    for (let i = 0; i < 7; i = i + 2) {
        let x = coordX + (tetriminos[pieces[piecesOrder]][spinPieces][i])
        let y = coordY + (tetriminos[pieces[piecesOrder]][spinPieces][i + 1])
        let color = colorRgb[tetriminos[pieces[piecesOrder]].color]
        drawCubes(x * 30, y * 30, color)
    }
}

const drawTetrominoPreview = () => {
    preview.innerHTML = `<img src="/public/${pieces[piecesOrder + 1]}.jpg" alt="tetrimino"></img>`
}

const mergeTetrominoMatrix = () => {
    for (let m = 0; m < 7; m = m + 2) {
        let typeTetri = pieces[piecesOrder]
        let cox = coordX + (tetriminos[typeTetri][spinPieces][m])
        let coy = coordY + (tetriminos[typeTetri][spinPieces][m + 1])
        let tetri = tetriminos[pieces[piecesOrder]].color
        let tetrisLine = [...matrixTetris[coy]]
        tetrisLine[cox] = tetri
        matrixTetris[coy] = tetrisLine
    }
}

const chekColision = () => {
    for (let i = 0; i < 7; i = i + 2) {
        let x = coordX + (tetriminos[pieces[piecesOrder]][spinPieces][i])
        let y = coordY + (tetriminos[pieces[piecesOrder]][spinPieces][i + 1])
        if (y > 17) return true
        if (matrixTetris[y][x] !== 0 || x > 9 || x < 0) return true
    } return false
}

const chekColisionFloor = () => {
    for (let i = 0; i < 7; i = i + 2) {
        let x = coordX + (tetriminos[pieces[piecesOrder]][spinPieces][i])
        let y = coordY + (tetriminos[pieces[piecesOrder]][spinPieces][i + 1])
        if (y >= 17) {
            mergeTetrominoMatrix()
            checkLine()
            spinPieces = 0
            piecesOrder += 1
            coordX = 5
            coordY = -1
            return true
        }

        if (matrixTetris[y + 1][x] != 0) {
            mergeTetrominoMatrix()
            checkLine()
            spinPieces = 0
            piecesOrder += 1
            coordX = 5
            coordY = -1
            return true
        }
    } return false
}

const checkLine = () => {
    for (let y = 0; y < 18; y++) {
        if (!matrixTetris[y].includes(0)) {
            score += 100
            impactLine.play()
            scorePrint.innerHTML = score.toString().padStart(6, '0')
            for (let del = y; del > 1; del--) {
                matrixTetris[del] = matrixTetris[del - 1]
            }
        }
    }
}

musicGame.addEventListener('ended', () => {
    musicGame.currentTime = 0
    musicGame.play()
})

document.addEventListener('keydown', (keyb) => {
    key = keyb.key
    if (keyb.key === 'Enter' && gameState === 'stoped') startGame()
})

const keyGame = () => {
    if (key === 'ArrowUp') {
        let back = spinPieces
        spinPieces += 1
        if (spinPieces >= (tetriminos[pieces[piecesOrder]].spin)) spinPieces = 0
        let test = chekColision()
        if (test) { spinPieces = back }
        else { spinSound.play() }
        key = ''
    }
    if (key === 'ArrowLeft') {
        coordX -= 1
        let test = chekColision()
        if (test) coordX += 1
        key = ''
    }
    if (key === 'ArrowRight') {
        coordX += 1
        let test = chekColision()
        if (test) coordX -= 1
        key = ''
    }
}

const levelPassLabel = () => {
    musicGame.pause()
    ctx.fillStyle = 'rgb(142,32,59)'
    ctx.fillRect(10, 190, 280, 120)
    ctx.fillStyle = 'rgb(200,71,91)'
    ctx.fillRect(20, 200, 260, 100)
    ctx.fillStyle = 'white'
    ctx.font = '40pt Arial'
    ctx.fillText(`LEVEL ${level}`, 50, 270)
    gameState = 'paused'
    gameStatePause = 0
}

const checkLevel = () => {
    if (level === 5 && score >= 8000) newLevel(6, 4)
    if (level === 4 && score >= 7000) newLevel(5, 8)
    if (level === 3 && score >= 6000) newLevel(4, 8)
    if (level === 2 && score >= 4000) newLevel(3, 10)
    if (level === 1 && score >= 2000) newLevel(2, 12)
}

const newLevel = (l, lv) => {
    score = score + 100
    level = l
    scorePrint.innerHTML = score.toString().padStart(6, '0')
    levelPrint.innerHTML = level
    levelVelocity = lv
    coordX = 5
    coordY = 0
    time = 0
    levelPassLabel()
}

const runGame = () => {
    time += 1

    if (gameState === 'paused' && gameStatePause === 0) {
        levelPass.play()
    }

    if (gameState === 'paused') gameStatePause += 1

    if (gameStatePause > 260) {
        gameStatePause = 0
        musicGame.play()
        defineMatrix()
        gameState = 'play'
    }

    if (gameState === 'play') {
        keyGame()
        drawMatrix()
        drawTetromino()
        drawTetrominoPreview()
        checkLevel()
        if (time >= levelVelocity || key === 'ArrowDown') {
            endGame += 1
            if (key === 'ArrowDown') key = ''
            let back = coordY
            let chekGame = chekColisionFloor()
            time = 0
            coordY += 1
            if (chekGame && back === 0) {
                ctx.fillStyle = 'white'
                ctx.font = '40pt Arial'
                ctx.fillText(`GAME OVER`, 50, 400)
                ctx.fillStyle = 'black'
                ctx.strokeText(`GAME OVER`, 50, 400)
                gameState = 'stoped'
                gameOver.play()
                musicGame.pause()

                return
            }
        }
    }
    requestAnimationFrame(runGame)
}
