import { app, BrowserWindow, ipcMain } from "electron"
import { join } from "node:path"
import { Manager } from "./core/manager"

const manager = new Manager()

let mainWindow: BrowserWindow | null = null
let wasCompleted = false

function sendTimerUpdate() {
	const state = manager.getTimer()

	if (!mainWindow || mainWindow.isDestroyed()) {
		return
	}

	mainWindow.webContents.send("timer:update", state)

	if (state.status === "completed" && !wasCompleted) {
		wasCompleted = true
		mainWindow.setAlwaysOnTop(true)
		mainWindow.show()
		mainWindow.focus()
	}

	if (state.status !== "completed") {
		wasCompleted = false
		mainWindow.setAlwaysOnTop(false)
	}
}

ipcMain.handle("timer:get", () => manager.getTimer())

ipcMain.handle("timer:start", () => {
	manager.start(sendTimerUpdate)
	return manager.getTimer()
})

ipcMain.handle("timer:stop", () => {
	manager.stop()
	sendTimerUpdate()
	return manager.getTimer()
})

ipcMain.handle("timer:reset", () => {
	manager.reset()
	sendTimerUpdate()
	return manager.getTimer()
})

ipcMain.handle("timer:switch-mode", (_event, mode: TimerMode) => {
	manager.switchMode(mode)
	sendTimerUpdate()
	return manager.getTimer()
})

ipcMain.handle("timer:get-current-duration", () => {
	return manager.getCurrentDuration()
})

const createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 600,
		height: 700,
		webPreferences: {
			preload: join(__dirname, "preload.js"),
			contextIsolation: true,
			nodeIntegration: true,
		},
		resizable: false,
		transparent: false,
		frame: true,
		titleBarStyle: "hidden",
	})

	mainWindow.setBackgroundMaterial("acrylic")

	mainWindow.loadFile(join(__dirname, "../index.html"))
}

app.whenReady().then(() => {
	createWindow()

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	})
})

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit()
	}
})
