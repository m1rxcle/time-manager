import { Timer } from "./timer"

type TimerMode = "work" | "chill"

export class Manager {
	private timer = new Timer()

	private mode: TimerMode = "work"

	public workTime: number = 60 * 60 * 2
	public chillTime: number = 0.3 * 60

	constructor() {
		this.timer.setDuration(this.workTime)
	}

	start(onTick?: () => void) {
		this.timer.start(onTick)
	}

	stop() {
		this.timer.stop()
	}

	reset() {
		this.timer.reset(this.getCurrentDuration())
	}

	switchMode(mode: TimerMode) {
		this.mode = mode
		this.reset()
	}

	getCurrentMode() {
		return this.mode
	}

	getTimer() {
		return {
			...this.timer.getTime(),
			status: this.timer.timerStatus,
			mode: this.mode,
		}
	}

	getCurrentDuration() {
		return this.mode === "work" ? this.workTime : this.chillTime
	}
}
