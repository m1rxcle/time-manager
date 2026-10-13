type TimerStatus = "idle" | "running" | "stopped" | "completed"

export class Timer {
	private totalSeconds: number = 0
	private interval: ReturnType<typeof setInterval> | null = null

	public timerStatus: TimerStatus = "idle"

	setDuration(seconds: number) {
		this.totalSeconds = seconds
	}

	getTime() {
		return {
			hours: Math.floor(this.totalSeconds / 3600),
			minutes: Math.floor((this.totalSeconds % 3600) / 60),
			seconds: this.totalSeconds % 60,
		}
	}

	start(onTick?: () => void) {
		if (this.timerStatus === "running") return

		if (this.totalSeconds <= 0) return

		this.timerStatus = "running"

		this.interval = setInterval(() => {
			this.totalSeconds--
			onTick?.()
			if (this.totalSeconds <= 0) {
				this.stopInterval()
				this.timerStatus = "completed"
				onTick?.()
			}
		}, 1000)
	}

	stop() {
		this.stopInterval()

		if (this.timerStatus === "running") {
			this.timerStatus = "stopped"
		}
	}

	reset(seconds = 0) {
		this.stopInterval()
		this.totalSeconds = seconds
		this.timerStatus = "idle"
	}

	private stopInterval() {
		if (this.interval !== null) {
			clearInterval(this.interval)
			this.interval = null
		}
	}
}
