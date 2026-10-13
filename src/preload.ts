import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("timerAPI", {
	get: () => ipcRenderer.invoke("timer:get"),
	start: () => ipcRenderer.invoke("timer:start"),
	stop: () => ipcRenderer.invoke("timer:stop"),
	reset: () => ipcRenderer.invoke("timer:reset"),
	switchMode: (mode: TimerMode) => ipcRenderer.invoke("timer:switch-mode", mode),
	getCurrentDuration: () => ipcRenderer.invoke("timer:get-current-duration"),

	onUpdate: (callback: (state: TimerState) => void) => {
		const listener = (_event: Electron.IpcRendererEvent, state: TimerState) => {
			callback(state)
		}

		ipcRenderer.on("timer:update", listener)

		return () => {
			ipcRenderer.removeListener("timer:update", listener)
		}
	},
})
