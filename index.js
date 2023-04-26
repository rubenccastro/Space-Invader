const canvas = document.getElementById('game');
const scoreEl = document.querySelector('#scoreEl');
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
    constructor() {

        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 60
        this.height = 60

        const image = new Image()
        image.src = './images/ship.png'
        this.image = image

        this.position = {
            x: canvas.width / 2 - this.width / 2,
            y: canvas.height - this.height - 20
        }
        this.rotation = 0
        this.opacity = 1
    }

    draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity;
        ctx.translate(
            player.position.x + player.width / 2,
            player.position.y + player.height / 2
        )
        ctx.rotate(this.rotation)
        ctx.translate(
            -player.position.x - player.width / 2,
            -player.position.y - player.height / 2
        )

        // ctx.fillStyle = 'blue'
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height)
        ctx.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
    }
}

class Projectile {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity

        this.radius = 5
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'white'
        ctx.fill()
        ctx.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Particle {
    constructor({ position, velocity, radius, color, fades }) {
        this.position = position
        this.velocity = velocity

        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }

    draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.fades)
            this.opacity -= 0.01
    }
}


class InvaderProjectile {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity

        this.width = 3
        this.height = 10
    }

    draw() {
        ctx.fillStyle = '#c6a0fd'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Invader {
    constructor({ position }) {

        this.velocity = {
            x: 0,
            y: 0
        }

        this.position = {
            x: position.x,
            y: position.y
        }
        const image = new Image()
        image.src = './images/invader.png'
        this.image = image
        this.width = image.width * .04
        this.height = image.height * .04
    }

    draw() {
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height)
    }

    update({ velocity }) {
        this.draw()
        this.position.x += velocity.x
        this.position.y += velocity.y
    }

    shoot(InvaderProjectiles) {
        InvaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        }))
    }
}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 3,
            y: 0
        }
        this.invaders = []
        const cols = Math.floor(Math.random() * 10 + 5)
        const rows = Math.floor(Math.random() * 5 + 2)
        this.width = cols * 30
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(
                    new Invader({
                        position: {
                            x: x * 30,
                            y: y * 30
                        }
                    }))
            }
        }
    }
    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0

        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }

    }
}

const player = new Player()
const projectiles = []
const grids = []
const InvaderProjectiles = []
const particles = []
const keys = {
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

let frames = 0
let randomInt = Math.floor((Math.random() * 500) + 500)
let game = {
    over: false,
    active: true
}
let score = 0
for (let i = 0; i < 100; i++) {
    particles.push(
        new Particle({
            position: {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height
            },
            velocity: {
                x: 0,
                y: 2
            },
            radius: Math.random() * 2,
            color: 'white'
        })
    )
}

function createParticles({ object, color, fdaes }) {
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle({

            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 3,
            color: color || '#c6a0fd',
            fades: true
        })
        )
    }
}

function animate() {
    if (!game.active) return
    requestAnimationFrame(animate)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    if (game.over) {
        let text = "Game Over";
        ctx.fillStyle = "white";
        ctx.font = "70px Arial";
        ctx.fillText(text, canvas.width / 2.25, canvas.height / 2);
    }

    particles.forEach((particle, i) => {

        if (particle.position.y - particle.radius >= canvas.height) {
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius
        }

        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(i, 1)
            }, 0)
        } else {
            particle.update()
        }
    })

    InvaderProjectiles.forEach((InvaderProjectile, Index) => {
        if (InvaderProjectile.position.y + InvaderProjectile.height >= canvas.height)
            setTimeout(() => {
                InvaderProjectiles.splice(Index, 1)
            }, 0)
        else {
            InvaderProjectile.update()
        }
        if (InvaderProjectile.position.y + InvaderProjectile.height >= player.position.y && InvaderProjectile.position.x + InvaderProjectile.width >= player.position.x && InvaderProjectile.position.x <= player.position.x + player.width) {
            setTimeout(() => {
                InvaderProjectiles.splice(Index, 1)
                player.opacity = 0
                game.over = true
            }, 0)
            setTimeout(() => {
                game.active = false
            }, 2000)

            createParticles({
                object: player,
                color: 'white',
                fades: true
            })
        }
    })

    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        }
        else {
            projectile.update()
        }
    })

    grids.forEach((grid, gridIndex) => {
        grid.update()
        //invaderprojectilesrandom
        if (frames % 100 == 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(InvaderProjectiles)
        }

        grid.invaders.forEach((invader, i) => {
            invader.update({ velocity: grid.velocity })


            //player projectiles
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <= invader.position.y + invader.height && projectile.position.x + projectile.radius >= invader.position.x && projectile.position.x - projectile.radius <= invader.position.x + invader.width && projectile.position.y + projectile.radius >= invader.position.y) {
                    createParticles({
                        object: invader,
                        fades: true
                    })

                    setTimeout(() => {
                        const invaderFound = grid.invaders.find((invader2) => invader2 == invader
                        )
                        const projectileFound = projectiles.find((projectile2) => projectile2 == projectile)

                        //remove um invader e projectile
                        if (invaderFound && projectileFound) {
                            score += 100
                            scoreEl.innerHTML = score

                            createParticles({
                                object: invader,
                                fades: true
                            })
                            grid.invaders.splice(i, 1)
                            projectiles.splice(j, 1)

                            if (grid.invaders.length > 0) {
                                const firstInvader = grid.invaders[0]
                                const lastInvader = grid.invaders[grid.invaders.length - 1]
                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
                                grid.position.x = firstInvader.position.x
                            } else {
                                grids.splice(gridIndex, 1)
                            }
                        }

                    }, 0)
                }
            })
        })
    })

    if (keys.ArrowLeft.pressed && player.position.x >= 0) {
        player.velocity.x = -8
        player.rotation = -.15
    } else if (keys.ArrowRight.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 8
        player.rotation = .15
    } else {
        player.velocity.x = 0
        player.rotation = 0
    }

    if (frames % randomInt === 0) {
        grids.push(new Grid())
        randomInt = Math.floor((Math.random() * 500) + 500)
        frames = 0
    }



    frames++
}
animate()

addEventListener('keydown', ({ key }) => {
    if (game.over) return
    switch (key) {
        case 'ArrowLeft':
            // console.log('left')
            keys.ArrowLeft.pressed = true
            break
        case 'ArrowRight':
            // console.log('right')
            keys.ArrowRight.pressed = true
            break
        case ' ':
            // console.log('space')
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -8
                }
            })
            )
            break
    }
})
addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'ArrowLeft':
            // console.log('left')
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowRight':
            // console.log('right')
            keys.ArrowRight.pressed = false
            break
        case ' ':
            // console.log('space')
            keys.space.pressed = false
            break
    }
})

function startGame() {
    let gamestart = document.getElementById("gamestart");
    let startDiv = document.getElementById("start");
    let gameCanvas = document.getElementById("game");
    gamestart.style.display = "none";
    startDiv.style.display = "none";
    gameCanvas.style.display = "block";
}