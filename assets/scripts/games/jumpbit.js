import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs"
const DEBUG = true
document.addEventListener("DOMContentLoaded", () => {
	const k = kaboom({background: [255, 255, 255], global: false, crisp: true})
    k.loadSprite("minamotion","https://minamotion.name/assets/images/minamotion.png")
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
		do { ylevel = k.randi((pipegap / 2) * -1, (pipegap / 2)) } while (Math.abs(lasty - ylevel) <= 20)
		const pipe = k.add(["pipe", k.pos(k.width() + 50, 0), { once: false }])
		pipe.add(["addscore", k.pos(0, k.center().y), k.opacity(0), k.rect(45, k.height()), k.anchor("center"), k.area()])
		pipe.add(["danger", k.pos(0, -ylevel), k.color([0, 0, 0]), k.rect(50, pipegap), k.anchor("center"), k.area()])
		pipe.add(["danger", k.pos(0, k.height() - ylevel), k.color([0, 0, 0]), k.rect(50, pipegap), k.anchor("center"), k.area()])
		return ylevel
	}
	function createParticle(position) {
		let mx = 0
		while (mx == 0) {
			mx = k.randi(-500,500)
		}
		let my = 0
		while (my == 0) {
			my = k.randi(-500,500)
		}
		let size = k.randi(5,25)
		const particle = k.add(["particle", k.opacity(0.8), k.pos(position.x +k.randi(-10,10), position.y +k.randi(-10,10)), k.color([0,0,0]), k.rect(size,size), k.anchor("center"), k.area({collisionIgnore: ["particle"]}), k.body(), {mx: mx, my: my, size: size}])
		return particle
	}
	function splash(position, amount=5) {
		let index = 0
		let array = []
		while (index < amount) {
			array = array.concat([createParticle(position)])
			index += 1
		}
		return array
	}
	k.scene("game", () => {
		let lasty = NaN
		let score = 0
		let reason = 0
		k.add(["scorecounter", k.pos(k.center()), k.text("0"), k.anchor("center"), k.color([0, 0, 0]), k.opacity(.5)])
		k.add(["player", k.pos(k.center().x / 2, k.center().y), k.color([0, 0, 0]), k.rect(50, 50), k.anchor("center"), k.body(), k.area()])
		k.onUpdate("particle", (particle)=>{
			particle.size -= 0.2
			particle.opacity -= 0.01
			particle.use(k.rect(Math.abs(particle.size),Math.abs(particle.size)))
			if (particle.size <= 0) {
				particle.destroy()
			}
			particle.move(particle.mx, particle.my)
		})
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
			const funstuff = k.add([k.z(Infinity),k.rect(k.width(),k.height()),k.color([255,0,0]),k.opacity(0.25)])
			funstuff.onUpdate(()=>{funstuff.opacity -= 0.001; if (funstuff.opacity <= 0) {funstuff.destroy()}})
			k.wait(3, ()=>{
				ulost(score, reason)
			})
		})
		k.onCollide("player", "danger", (player, danger) => {
			reason = 1
			splash(player.pos,50)
			k.shake()
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
	function makePanel() {
		const panel = k.add([k.z(Infinity),k.rect(k.width(),k.height()),k.color([255,255,255]),k.opacity(0.9)])
		return panel
	}
	function addTextButton(position,text,width,func=()=>{k.debug.log("I, button, have been pressed")},parent=k) {
		const btn = parent.add([k.pos(position),k.area(),k.rect(width+20,40),k.anchor("bot"),k.color([0,0,0]),"button"])
		btn.add([k.pos(0,0),k.text(text, {width: width, align: "center"}),k.anchor("bot"),k.color([255,255,255])])
		btn.onClick(func)
		btn.onHover(()=>{btn.use(k.color([0,0,255]))})
		btn.onHoverEnd(()=>{btn.use(k.color([0,0,0]))})
		return btn
	}
	function ulost(score = 0, reason = 0) {
		const panel = makePanel()
		let reasons = [["Don't go offscreen, it ain't healthy", "Welcome to the void!", "I've ran out of ideas, just don't fall, ok?"], ["The rectangles are evil", "You got brutally obliterated by a 4-sided shape", "Don't crash into walls"], ["Don't go offscreen, it ain't healthy", "You want to go to the Moon that badly?", "How's the weather up there?"]]
		panel.add([k.pos(k.center().x, k.height() / 4), k.text("You lost!", { align: "center", size: 80 }), k.anchor("center"), k.color([255, 0, 0])])
		panel.add([k.pos(k.center()), k.text(`${k.choose(reasons[reason])}\nYour score: ${score}\nPress anything to play`, { align: "center", width: k.width() }), k.anchor("top"), k.color([0, 0, 0])])

		addTextButton(k.vec2(k.center().x,k.height()-(75*1)),"Replay",200,()=>{k.go("game")},panel)
		return panel
	}
	k.scene("main", () => {
		k.add([k.pos(k.center().x, k.height() / 4), k.text("Jump Bit", { align: "center", size: 80 }), k.anchor("center"), k.color([0, 0, 0])])
		k.add([k.pos(k.center()), k.text("[SPACE] or [CLICK] to jump\nGoal: To avoid the rectangles", { align: "center", width: k.width() }), k.anchor("top"), k.color([0, 0, 0])])
		addTextButton(k.vec2(k.center().x,k.height()-(75*1)),"Play",200,()=>{k.go("game")})
	})
	k.scene("intro", ()=>{
		const s = k.add([k.pos(k.center()),k.sprite("minamotion"),k.anchor("center"),k.opacity(0),k.scale(1),{disappear:false,appear:true}])
		s.onUpdate(()=>{
			if (s.appear && !s.disappear) {
				s.opacity += 0.01
			}
			if (s.disappear && !s.appear) {
				s.opacity -= 0.01
				if (s.opacity <= 0) {
					k.wait(1,()=>{k.go("main")})
					s.destroy()
				}
			}
			s.scale.x += 0.001
			s.scale.y += 0.001
		})
		k.wait(2,()=>{
			s.appear = false
			s.disappear = true
		})
	})
	k.go("intro")
})
