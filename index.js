const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
const collisionMap = []
for (let i = 0; i < collision.length; i+=70) {
    collisionMap.push(collision.slice(i, 70 + i))
}
const battlezonesMap = []
for (let i = 0; i < battlezones.length; i+=70) {
    battlezonesMap.push(battlezones.slice(i, 70 + i))
}

const offset = {
    x: -450,
    y: -375
}
const boundaries = []
const battleZones = []
collisionMap.forEach((row, i) => {
   row.forEach((symbol, j) => {
    if(symbol === 1025)
    boundaries.push( 
        new Boundary({position:{
        x: j * Boundary.width + offset.x,
        y: i * Boundary.height + offset.y
    }}))
   }) 
})
battlezonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
     if(symbol === 1025)
     battleZones.push( 
         new Boundary({position:{
         x: j * Boundary.width + offset.x,
         y: i * Boundary.height + offset.y
     }}))
    }) 
 })
console.log(battleZones)
const image = new Image();
image.src = './img/Pokemon Mapz.png';

const playerDownImage = new Image();
playerDownImage.src = './img/playerDown.png';

const playerUpImage = new Image();
playerUpImage.src = './img/playerUp.png';

const playerLeftImage = new Image();
playerLeftImage.src = './img/playerLeft.png';

const playerRightImage = new Image();
playerRightImage.src = './img/playerRight.png';
const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 130 / 2
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 10
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage
    }
})
const background = new Sprite({
    position:{
        x:offset.x,
        y:offset.y
    },
    image
})

const keys = {
    w:{
        pressed: false
    },
        a:{
        pressed: false
    },
        s:{
        pressed: false
    },
       d:{
        pressed: false
    },
     
}
const moveables = [background, ...boundaries, ...battleZones]
function rectangularCollision({rectangle1, rectangle2}){
    return(
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}

const battle = {
    initiated: false
}

function animate() {
    const animationId = window.requestAnimationFrame(animate)
    console.log(animationId)
    background.draw()
    boundaries.forEach(boundary =>{
        boundary.draw()
   
    })
    battleZones.forEach(boundary =>{
        boundary.draw()
    })
    player.draw()
    let moving = true;
    player.animate = false;
    if(battle.initiated) return
    //Activating Battle
    if (keys.w.pressed || keys.a.pressed || keys.d.pressed || keys.s.pressed){
        
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i]
            const overlappingArea = (Math.min(player.position.x +
                player.width, battleZone.position.x + battleZone.width) - Math.max(player.position.x, battleZone.position.x)) * (Math.min( player.position.y + player.height, battleZone.position.y + battleZone.height) -
                Math.max(player.position.y, battleZone.position.y))
            if(
                rectangularCollision({
                 rectangle1: player,
                 rectangle2: battleZone
                }) && 
                overlappingArea > player.width * player.height / 2 &&
                Math.random() < .01
                 ){
                 console.log('battle')
                //Deactivate old Animation
                 window.cancelAnimationFrame(animationId)

                 battle.initiated = true
                 gsap.to('#overlappingDiv', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: .4,
                    onComplete(){
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            duration: 0.4,
                            onComplete(){
                            //Avtivate new Animation
                            animateBattle()
                            gsap.to('#overlappingDiv', {
                                opacity: 0,
                                duration: 0.4,
                            })
                            }
                        })

                        
                    }
                })
                 break
             }
        }
    }

    if (keys.w.pressed && lastkey === 'w') {
        player.animate = true
        player.image = player.sprites.up
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if(
                rectangularCollision({
                 rectangle1: player,
                 rectangle2: {...boundary, position:{
                    x: boundary.position.x,
                    y: boundary.position.y + 6
                 }}
                })
                 ){
                 console.log('colliding')
                 moving = false
                 break
             }
        }


        if(moving) {moveables.forEach((movable) =>{
            movable.position.y += 6
        })}
    } else if (keys.a.pressed && lastkey === 'a'){ 
        player.image = player.sprites.left
        player.animate = true  
        for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
        if(
            rectangularCollision({
             rectangle1: player,
             rectangle2: {...boundary, position:{
                x: boundary.position.x + 6,
                y: boundary.position.y
             }}
            }) 
             ){
             console.log('colliding')
             moving = false
             break
         }
    }
       if(moving) { moveables.forEach((movable) =>{
        movable.position.x += 6
    })}
    } else if (keys.s.pressed && lastkey === 's') {
        player.image = player.sprites.down
        player.animate = true
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if(
                rectangularCollision({
                 rectangle1: player,
                 rectangle2: {...boundary, position:{
                    x: boundary.position.x,
                    y: boundary.position.y - 6
                 }}
                })
                 ){
                 console.log('colliding')
                 moving = false
                 break
             }
        }
        if(moving){moveables.forEach((movable) =>{
        movable.position.y -= 6
    })}
    } else if (keys.d.pressed && lastkey === 'd') {
        player.image = player.sprites.right
        player.animate = true
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if(
                rectangularCollision({
                 rectangle1: player,
                 rectangle2: {...boundary, position:{
                    x: boundary.position.x - 6,
                    y: boundary.position.y
                 }}
                })
                 ){
                 console.log('colliding')
                 moving = false
                 break
             }
        }
    if(moving){moveables.forEach((movable) =>{
    movable.position.x -= 6
    })}
    }
}


//animate()

const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
const battleBackground = new Sprite({
    position:{
        x: 0,
        y:0
    },
    image: battleBackgroundImage
})

const draggleImage = new Image()
draggleImage.src = './img/draggleSprite.png'
const draggle = new Sprite({
    position: {
        x:800,
        y:100
    },
    image: draggleImage,
    frames:{
        max:4,
        hold:30
    },
    animate: true,
    isEnemy: true,
    name: 'Draggle'
})


const embyImage = new Image()
embyImage.src = './img/embySprite.png'
const emby = new Sprite({
position: {
    x:280,
    y:325
},
image: embyImage,
frames:{
    max:4,
    hold:30
},
animate: true,
name: 'Emby'
})

const renderedSprites = [draggle, emby]
function animateBattle(){
    window.requestAnimationFrame(animateBattle)
    // console.log('animating battle')
    battleBackground.draw()

    renderedSprites.forEach((sprite) =>{
        sprite.draw()
    })
}
animateBattle()

document.querySelectorAll('button').forEach((button) =>{
    button.addEventListener('click', (e) =>{
        const selectedAttack = attacks[e.currentTarget.innerHTML]
        draggle.attack({ attack: selectedAttack,
        recipient: emby,
        renderedSprites
    })
    })
})

let lastkey = ''
window.addEventListener('keydown', (e) =>{
    switch (e.key) {
        case 'w':
          keys.w.pressed = true
          lastkey = 'w' 
            break;
        case 'a':
            keys.a.pressed = true
            lastkey = 'a'
            break;
        case 's':
            keys.s.pressed = true
            lastkey = 's'
            break;
        case 'd':
            keys.d.pressed = true
            lastkey = 'd'
            break;
        default:
            break;
    }
})
window.addEventListener('keyup', (e) =>{
    switch (e.key) {
        case 'w':
          keys.w.pressed =  false 
            break;
        case 'a':
            keys.a.pressed = false 
            break;
        case 's':
            keys.s.pressed = false 
            break;
        case 'd':
            keys.d.pressed = false 
            break;
        default:
            break;
    }
})