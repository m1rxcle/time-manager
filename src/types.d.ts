type TimerMode = "work" | "chill"
type TimerStatus = "idle" | "running" | "stopped" | "completed"

interface TimerState {
	hours: number
	minutes: number
	seconds: number
	status: TimerStatus
	mode: TimerMode
}

interface Window {
	timerAPI: {
		get: () => Promise<TimerState>
		start: () => Promise<TimerState>
		stop: () => Promise<TimerState>
		reset: () => Promise<TimerState>
		switchMode: (mode: TimerMode) => Promise<TimerState>
		getCurrentDuration: () => Promise<number>
		onUpdate: (callback: (state: TimerState) => void) => () => void
	}
}
