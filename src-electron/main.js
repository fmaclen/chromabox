import path from 'path';
import { fileURLToPath } from 'url';
import { app, BrowserWindow } from 'electron';

// Get __dirname equivalent in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 1536,
		height: 1046,
		minWidth: 640,
		minHeight: 480
	});

	// Hides the menu bar in Windows
	mainWindow.menuBarVisible = false;

	// Load the built static site from /build directory
	mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
