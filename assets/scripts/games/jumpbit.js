import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs"
const DEBUG = false
document.addEventListener("DOMContentLoaded", () => {
    const k = kaboom({background: [255, 255, 255], global: false, crisp: true})
    const pipespeed = 250
    const pipegap = k.height() * .65
    const pipespawnrate = 1.24
    k.setGravity(1000)
    if (DEBUG) { k.debug.log("Welcome developer! Debug mode is true! Press CTRL to see debug info!") }
    k.add([k.stay()]).onUpdate(() => {
        if (k.isKeyPressed("control") && DEBUG) {
            k.debug.inspect = !k.debug.inspect
        }
    })
    function createPipe(lasty) {
        let ylevel = k.randi((pipegap / 2) * -1, (pipegap / 2))
        do { ylevel = k.randi((pipegap / 2) * -1, (pipegap / 2)) } while (ylevel === lasty)
        const pipe = k.add(["pipe", k.pos(k.width() + 50, 0), { once: false }])
        pipe.add(["addscore", k.pos(0, k.center().y), k.opacity(0), k.rect(45, k.height()), k.anchor("center"), k.area()])
        pipe.add(["danger", k.pos(0, -ylevel), k.color([0, 0, 0]), k.rect(50, pipegap), k.anchor("center"), k.area()])
        pipe.add(["danger", k.pos(0, k.height() - ylevel), k.color([0, 0, 0]), k.rect(50, pipegap), k.anchor("center"), k.area()])
        return ylevel
    }
    k.scene("game", () => {
        let lasty = NaN
        let score = 0
        let reason = 0
        k.add(["scorecounter", k.pos(k.center()), k.text("0"), k.anchor("center"), k.color([0, 0, 0]), k.opacity(.5)])
        k.add(["player", k.pos(k.center().x / 2, k.center().y), k.color([0, 0, 0]), k.rect(50, 50), k.anchor("center"), k.body(), k.area()])
        k.onUpdate("player", (player) => {
            if (k.isKeyPressed("space") || k.isMousePressed()) {
                player.jump(k.getGravity() * .375)
            }
            if (player.pos.y < -25 || player.pos.y > (k.height() + 25)) {
                if (player.pos.y < -25) {
                    reason = 2
                } else if (player.pos.y > (k.height() + 25)) {
                    reason = 0
                }
                player.destroy()
            }
        })
        k.onUpdate("pipe", (pipe) => {
            pipe.move(-pipespeed, 0)
            if (pipe.pos.x < -50) {
                pipe.destroy()
            }
        })
        k.onDestroy("player", (player) => {
            k.go("ulost", score, reason)
        })
        k.onCollide("player", "danger", (player, danger) => {
            reason = 1
            player.destroy()
        })
        k.onCollide("player", "addscore", (player, addscore) => {
            score++
            addscore.destroy()
        })
        k.onUpdate("scorecounter", (scorecounter) => {
            scorecounter.text = `${score}`
        })
        k.loop(pipespawnrate, () => {
            lasty = createPipe(lasty)
        })
    })
    k.scene("ulost", (score = 0, reason = 0) => {
        let reasons = [["Don't go offscreen, it ain't healthy", "Welcome to the void!", "I've ran out of ideas, just don't fall, ok?"], ["The rectangles are evil", "You got brutally obliterated by a 4-sided shape", "Don't crash into walls"], ["Don't go offscreen, it ain't healthy", "You want to go to the Moon that badly?", "How's the weather up there?"]]
        k.add([k.pos(k.center().x, k.height() / 4), k.text("You lost!", { align: "center", size: 80 }), k.anchor("center"), k.color([255, 0, 0])])
        k.add([k.pos(k.center()), k.text(`${k.choose(reasons[reason])}\nYour score: ${score}\nPress anything to play`, { align: "center", width: k.width() }), k.anchor("top"), k.color([0, 0, 0])])

        // Restart the game
        k.onUpdate(() => { if (k.isKeyPressed()) { k.go("game") } })
        k.onMousePress(() => { k.go("game") })
    })
    k.scene("main", () => {
        k.add([k.pos(k.center().x, k.height() / 4), k.text("Jump Bit", { align: "center", size: 80 }), k.anchor("center"), k.color([0, 0, 0])])
        k.add([k.pos(k.center()), k.text("[SPACE] or [CLICK] to jump\nAvoid the rectangles\nPress anything to play", { align: "center", width: k.width() }), k.anchor("top"), k.color([0, 0, 0])])

        // Start the game
        k.onUpdate(() => { if (k.isKeyPressed()) { k.go("game") } })
        k.onMousePress(() => { k.go("game") })
    })
    k.go("main")
})