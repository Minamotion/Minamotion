import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs"
const DEBUG = false
document.addEventListener("DOMContentLoaded", () => {
    const k = kaboom({ global: false, crisp: true })
    const playerspeed = 250
    const minSize = 110
    const maxSize = 250
    const minSpawnTime = 0.2
    const maxSpawnTime = 1
    const tiniestStableSize = 50
    const dangerSpeedFormula = (size) => { return ((maxSize * 2.2) + 20) - (size * 2.2) }
    if (DEBUG) { k.debug.log("Welcome developer! Debug mode is true! Press CTRL to see debug info!") }
    let palette = { bgColor: [], objectColor: [] }
    let settings = { darkmode: false, particles: true, epilepsy: false }
    const background = { pos: k.vec2(0, 0), width: k.width(), height: k.height(), color: k.rgb(255, 255, 255) }
    const debugObj = k.add([k.stay(), k.z(-Infinity)])
    debugObj.onUpdate(() => {
        if (k.isKeyPressed("control") && DEBUG) {
            k.debug.inspect = !k.debug.inspect
        }
        palette.bgColor = (!settings.darkmode) ? [255, 255, 255] : [0, 0, 0]
        palette.objectColor = (!settings.darkmode) ? [0, 0, 0] : [255, 255, 255]
        background.width = k.width()
        background.height = k.height()
        background.color = k.rgb(palette.bgColor)
    })
    debugObj.onDraw(() => {
        k.drawRect(background)
    })
    function addEffect(tag, object, time = 3) {
        if (object.effects != null) {
            let severity = 1
            object.effects.forEach((item) => {
                if (item.tag === tag) {
                    item.time = -9999
                    if (item.severity > severity) {
                        severity = item.severity
                    }
                }
            })
            object.effects = object.effects.concat([{ tag: tag, time: time, severity: severity }])
            return true
        } else {
            return false
        }
    }
    function determineColorArray(shade = [false, false, false]) {
        let color = [0, 0, 0]
        if (!settings.darkmode) {
            color[0] = shade[0] ? 127 : 0
            color[1] = shade[1] ? 127 : 0
            color[2] = shade[2] ? 127 : 0
        } else {
            color[0] = shade[0] ? 255 : 127
            color[1] = shade[1] ? 255 : 127
            color[2] = shade[2] ? 255 : 127
        }
        if (!(shade.includes(true))) {
            color = palette.objectColor
        }
        return color
    }
    function createObstacle() {
        let ylevel = k.randi(0, k.height())
        let size = k.randi(minSize, maxSize)
        let speed = dangerSpeedFormula(size)
        const danger = k.add(["danger", k.pos(k.width() + size, ylevel), k.color(palette.objectColor), k.rect(size, size), k.anchor("center"), k.area(), { speed: speed, size: size, effects: [] }])
        return danger
    }
    function createBullet(position) {
        const isPoison = k.chance(0.1)
        const isFreeze = k.chance(0.1)
        const isCritical = k.chance(0.05)
        let onHitBehaviors = ["destroyBullet", (isPoison) ? "poisonDanger" : "damageDanger"]
        if (isFreeze) { onHitBehaviors = onHitBehaviors.concat(["freezeDanger"]) }
        if (isCritical) { onHitBehaviors = onHitBehaviors.concat(["worsenEffects"]) }
        const bullet = k.add(["bullet", k.pos(position), k.color(determineColorArray([isCritical, isPoison, isFreeze])), k.rect(20, 20), k.anchor("center"), k.area(), { speed: 500, onHit: onHitBehaviors, damage: (isCritical) ? 100 : 50, size: 20 }])
        return bullet
    }
    function createParticle(position, colorArray = palette.objectColor) {
        if (!settings.particles) {
            return null;
        }
        let mx = 0
        while (mx == 0) {
            mx = k.randi(-500, 500)
        }
        let my = 0
        while (my == 0) {
            my = k.randi(-500, 500)
        }
        let size = k.randi(5, 25)
        const particle = k.add(["particle", k.opacity(0.25), k.pos(position.x + k.randi(-10, 10), position.y + k.randi(-10, 10)), k.color(colorArray), k.rect(size, size), k.anchor("center"), { mx: mx, my: my, size: size }])
        return particle
    }
    function splash(position, amount = 5, colorArray = palette.objectColor) {
        let index = 0
        while (index < amount) {
            createParticle(position, colorArray)
            index += 1
        }
    }
    k.scene("game", () => {
        let score = 0
        let diescore = 0
        let time = 0
        let lasttime = 0
        let waittime = 0
        let stopstuff = false
        k.onUpdate(() => {
            time += k.dt()
            if (lasttime + waittime <= time) {
                createObstacle()
                lasttime = time
                waittime = k.randi(minSpawnTime * 1000, maxSpawnTime * 1000) / 1000
            }
        })
        k.loop(1, () => {
            if (!stopstuff) {
                score += k.randi(5, 10)
            }
        })
        const scorecounter = k.add([k.pos(k.center()), k.text("0"), k.anchor("center"), k.color(palette.objectColor), k.opacity(.5)])
        k.onUpdate(() => {
            if (!(stopstuff)) {
                scorecounter.text = `${score}`
            } else {
                scorecounter.text = "Ouch!"
                scorecounter.use(k.color([255, 0, 0]))
                scorecounter.opacity -= 0.005
            }
        })
        k.add(["player", k.pos(k.center().x / 2, k.center().y), k.color(palette.objectColor), k.rect(50, 50), k.anchor("center"), k.body(), k.area()])
        k.onUpdate("particle", (particle) => {
            particle.size -= 0.2
            particle.use(k.rect(Math.abs(particle.size), Math.abs(particle.size)))
            if (particle.size <= 0) {
                particle.destroy()
            }
            particle.move(particle.mx, particle.my)
        })
        k.onUpdate("player", (player) => {
            let speedx = 0
            if (!(k.isKeyDown("left") && k.isKeyDown("right"))) {
                if (k.isKeyDown("left")) { speedx = -playerspeed }
                if (k.isKeyDown("right")) { speedx = playerspeed }
            }
            if (Math.abs(speedx) > 0) {
                if (player.pos.x < 25 && Math.sign(speedx) == -1) { speedx = 0 }
                if (player.pos.x > (k.width() - 25) && Math.sign(speedx) == 1) { speedx = 0 }
            }
            let speedy = 0
            if (!(k.isKeyDown("up") && k.isKeyDown("down"))) {
                if (k.isKeyDown("up")) { speedy = -playerspeed }
                if (k.isKeyDown("down")) { speedy = playerspeed }
            }
            if (Math.abs(speedy) > 0) {
                if (player.pos.y < 25 && Math.sign(speedy) == -1) { speedy = 0 }
                if (player.pos.y > (k.height() - 25) && Math.sign(speedy) == 1) { speedy = 0 }
            }
            if (k.isKeyDown("z")) { speedx *= 2; speedy *= 2 }
            if (k.isKeyPressed("x")) { createBullet(player.pos) }
            player.move(speedx, speedy)
        })
        k.onUpdate("danger", (danger) => {
            let shade = [false, false, false]
            if (danger.effects.length > 0) {
                danger.effects.forEach((effect) => {
                    switch (effect.tag) {
                        case "frozen":
                            shade[2] = true
                            danger.speed = 0
                            break;
                        case "poison":
                            shade[1] = true
                            danger.size -= 0.5 * effect.severity
                            score += 1
                            break;
                        default:
                            throw new TypeError(`Invalid effect "${effect.tag}" (supposed to last ${effect.time} seconds) found in dangerous object.`)
                    }
                    effect.time -= k.dt()
                })
                danger.effects = danger.effects.filter((item) => { if (item != null) { return !(item.time <= 0) } else { return false } })
            }
            danger.use(k.color(determineColorArray(shade)))
            danger.move(-danger.speed, 0)
            if (danger.pos.x < -danger.size) {
                danger.destroy()
            }
            if (danger.size >= tiniestStableSize) {
                danger.speed = dangerSpeedFormula(danger.size)
                danger.use(k.rect(danger.size, danger.size))
            } else {
                score += k.randi(90, 110)
                splash(danger.pos, 10, danger.color)
                danger.destroy()
            }
        })
        k.onUpdate("bullet", (bullet) => {
            bullet.move(bullet.speed, 0)
            if (bullet.pos.x > k.width() + bullet.size) {
                bullet.destroy()
            }
        })
        k.onCollide("bullet", "danger", (bullet, danger) => {
            bullet.onHit.forEach(behavior => {
                switch (behavior) {
                    case "destroyBullet":
                        bullet.destroy()
                        break;
                    case "damageDanger":
                        danger.size -= bullet.damage
                        if (danger.size >= tiniestStableSize) {
                            score += k.randi(40, 60)
                            splash(danger.pos, 2, danger.color)
                        }
                        break;
                    case "freezeDanger":
                        addEffect("frozen", danger, 4)
                        break;
                    case "poisonDanger":
                        addEffect("poison", danger, 2)
                        break;
                    case "worsenEffects":
                        if (danger.effects.length > 0) {
                            for (const index in danger.effects) {
                                const item = danger.effects[index]
                                item.time = 5
                                item.severity += 1
                            }
                        }
                        break;
                    default:
                        throw new TypeError(`Invalid behavior "${behavior}" found in bullet.`)
                }
            })
        })
        k.onCollide("player", "danger", (player, danger) => {
            splash(player.pos, 50)
            player.destroy()
            diescore = score
            stopstuff = true
            scorecounter.opacity = 1
        })
        k.onDestroy("player", (player) => {
            if (!settings.epilepsy) {
                const funstuff = k.add([k.z(Infinity), k.rect(k.width(), k.height()), k.color([255, 0, 0]), k.opacity(0.5)])
                funstuff.onUpdate(() => { funstuff.opacity -= 0.005; if (funstuff.opacity <= 0) { funstuff.destroy() } })
            }
            k.wait(3, () => {
                ulost(diescore)
            })
        })
    })
    function makePanel() {
        const panel = k.add([k.z(Infinity), k.rect(k.width(), k.height()), k.color(palette.bgColor), k.opacity(0.9)])
        return panel
    }
    function ulost(score = 0) {
        const panel = makePanel()
        panel.add([k.pos(k.center().x, k.height() / 4), k.text("You lost!", { align: "center", size: 80 }), k.anchor("center"), k.color([255, 0, 0])])
        panel.add([k.pos(k.center()), k.text(`You scored ${score} points`, { align: "center", width: k.width() }), k.anchor("top"), k.color(palette.objectColor)])
        addTextButton(k.vec2(k.center().x, k.height() - (75 * 1)), "Menu", 200, () => { k.go("main") }, panel)
        addTextButton(k.vec2(k.center().x, k.height() - (75 * 2)), "Replay", 200, () => { k.go("game") }, panel)
        return panel
    }
    k.scene("settings", () => {
        k.add([k.pos(k.center().x, k.height() / 4), k.text("Settings", { align: "center", size: 80 }), k.anchor("center"), k.color(palette.objectColor)])
        addTextButton(k.center(), settings.darkmode ? "Dark mode" : "Light mode", 325, () => { settings.darkmode = !settings.darkmode; k.go("settings") })
        addTextButton(k.vec2(k.center().x, k.center().y + (75 * 1)), settings.particles ? "Particles On" : "Particles Off", 325, () => { settings.particles = !settings.particles; k.go("settings") })
        addTextButton(k.vec2(k.center().x, k.center().y + (75 * 2)), settings.epilepsy ? "Epilepsy On" : "Epilepsy Off", 325, () => { settings.epilepsy = !settings.epilepsy; k.go("settings") })
        addTextButton(k.vec2(k.width() - 225, k.height() - 25), "Go back", 200, () => { k.go("main") })
    })
    function addTextButton(position, text, width, func = () => { k.debug.log("I, button, have been pressed") }, parent = k) {
        const btn = parent.add([k.pos(position), k.area(), k.rect(width + 20, 40), k.anchor("bot"), k.color(palette.objectColor), "button"])
        btn.add([k.pos(0, 0), k.text(text, { width: width, align: "center" }), k.anchor("bot"), k.color(palette.bgColor)])
        btn.onClick(func)
        btn.onHover(() => { btn.use(k.color([0, 0, 255])) })
        btn.onHoverEnd(() => { btn.use(k.color(palette.objectColor)) })
        return btn
    }
    k.scene("main", () => {
        k.add([k.pos(k.center().x, k.height() / 4), k.text("Bit Avalanche", { align: "center", size: 80 }), k.anchor("center"), k.color(palette.objectColor)])
        k.add([k.pos(k.center()), k.text("[Arrows] to move\n[X] to shoot obstacles\n[Z] to speed up\nAvoid the obstacles", { align: "center", width: k.width() }), k.anchor("top"), k.color(palette.objectColor)])
        addTextButton(k.vec2(k.center().x - 200, k.height() - (75 * 1)), "Play", 200, () => { k.go("game") })
        addTextButton(k.vec2(k.center().x + 200, k.height() - (75 * 1)), "Settings", 200, () => { k.go("settings") })
    })
    k.scene("intro", () => {
        const s = k.add([k.pos(k.center()), k.text(DEBUG ? "A game made-\n...wait, why is this orange?" : "A game made by\nMinamotion", { align: "center", width: k.width() }), k.anchor("top"), k.color(DEBUG ? [255, 127, 39] : [63, 72, 204]), { disappear: false, appear: true }, k.opacity(0), k.scale(1)])
        s.onUpdate(() => {
            if (s.appear && !s.disappear) {
                s.opacity += 0.01
            }
            if (s.disappear && !s.appear) {
                s.opacity -= 0.01
                if (s.opacity <= 0) {
                    k.wait(1, () => { k.go("warning") })
                    s.destroy()
                }
            }
            s.scale.x += 0.001
            s.scale.y += 0.001
        })
        k.wait(2, () => {
            s.appear = false
            s.disappear = true
        })
    })
    k.scene("warning", () => {
        k.add([k.pos(k.center()), k.text("If you suffer from epilepsy, I'd like to let you know that this game features flashing lights", { align: "center", width: k.width() }), k.anchor("top"), k.color(palette.objectColor)])
        addTextButton(k.vec2(k.center().x, k.center().y + 150), "I do not suffer from epilepsy", 640, () => { k.go("main") })
        addTextButton(k.vec2(k.center().x, k.center().y + 200), "I do suffer from epilepsy", 640, () => { settings.epilepsy = true; k.go("main") })
    })
    k.go("intro")
})