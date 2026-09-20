const { app, BrowserWindow } = require('electron');
const path = require('node:path');
function createWindow() {
  const window = new BrowserWindow({
    width: 1440, height: 940, minWidth: 390, minHeight: 640,
    backgroundColor: '#f5f4ed', autoHideMenuBar: true,
    webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true },
  });
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', (event) => event.preventDefault());
  window.loadFile(path.join(__dirname, '../dist/index.html'));
}
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
