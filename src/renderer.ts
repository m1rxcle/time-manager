const timerElement = document.querySelector("#timer")
const statusElement = document.querySelector("#status")
const startButton = document.querySelector("#start") as HTMLButtonElement
const stopButton = document.querySelector("#stop") as HTMLButtonElement
const resetButton = document.querySelector("#reset") as HTMLButtonElement
const workButton = document.querySelector("#work") as HTMLButtonElement
const chillButton = document.querySelector("#chill") as HTMLButtonElement

const title = document.querySelector("#title")
const titleLogo = document.querySelector("#title-logo") as HTMLImageElement
const progressRing = document.querySelector("#timer-ring-progress") as SVGCircleElement
const timerContainer = document.querySelector("#timer-container")

const alarm = new Audio("./src/public/sounds/alarm.mp3")
alarm.volume = 1
alarm.loop = true

let wasCompleted = false

async function getTimeDifference() {
	const duration = await window.timerAPI.getCurrentDuration()

	return duration
}

async function getProgressPercentage(state: TimerState) {
	const duration = await window.timerAPI.getCurrentDuration()

	if (duration <= 0) return 0

	const remainingSeconds = state.hours * 3600 + state.minutes * 60 + state.seconds

	return Math.max(0, Math.min(100, (remainingSeconds / duration) * 100))
}

async function renderTimer(state: TimerState) {
	if (timerElement) {
		timerElement.textContent = [state.hours, state.minutes, state.seconds].map((value) => String(value).padStart(2, "0")).join(":")
	}

	if (statusElement) {
		const modes = {
			work: "Работа",
			chill: "Отдых",
		}

		if (stopButton && resetButton) {
			stopButton.disabled = state.status === "idle" || state.status === "stopped"
			resetButton.disabled = state.status === "idle"
		}

		if (startButton) {
			startButton.disabled = state.status === "running"
		}

		document.querySelectorAll(".mode").forEach((button) => {
			button.classList.toggle("active", state.mode === button.id)
		})

		statusElement.textContent = `${modes[state.mode]}`
	}

	if (titleLogo) {
		titleLogo.src = state.mode === "work" ? "./src/public/svg/work-icon-accent.svg" : "./src/public/svg/coffe-icon-accent.svg"
	}

	if (progressRing) {
		const percentage = await getProgressPercentage(state)

		progressRing.style.strokeDasharray = "100"
		progressRing.style.strokeDashoffset = String(100 - percentage)
	}

	if (timerContainer && wasCompleted) {
		timerContainer.classList.toggle("completed", state.status === "completed")
	}
}

function playAlarm(state: TimerState) {
	if (state.status === "completed") {
		alarm.currentTime = 0
		void alarm.play()
		wasCompleted = true
	}
}

function stopAlarm() {
	alarm.pause()
	alarm.currentTime = 0
	wasCompleted = false
}

window.timerAPI.onUpdate((state) => {
	playAlarm(state)

	renderTimer(state)
})

timerContainer?.addEventListener("click", async () => {
	if (!wasCompleted) return

	stopAlarm()
	timerContainer.classList.remove("completed")

	const state = await window.timerAPI.get()
	const nextMode = state.mode === "work" ? "chill" : "work"

	await window.timerAPI.reset()
	renderTimer(await window.timerAPI.switchMode(nextMode))
	renderTimer(await window.timerAPI.start())
})

startButton?.addEventListener("click", async () => {
	wasCompleted = false
	renderTimer(await window.timerAPI.start())
})

stopButton?.addEventListener("click", async () => {
	renderTimer(await window.timerAPI.stop())
})

resetButton?.addEventListener("click", async () => {
	stopAlarm()
	renderTimer(await window.timerAPI.reset())
})

workButton?.addEventListener("click", async () => {
	renderTimer(await window.timerAPI.switchMode("work"))
})

chillButton?.addEventListener("click", async () => {
	renderTimer(await window.timerAPI.switchMode("chill"))
})

window.timerAPI.get().then(renderTimer)
