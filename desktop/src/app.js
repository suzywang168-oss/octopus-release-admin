const { app, BrowserWindow, shell } = require("electron");

function launchDesktopApp({ title, url }) {
  app.setAppUserModelId(`chatgpt.suzywang168.octopus.${title.toLowerCase().replace(/\s+/g, "-")}`);

  const createWindow = () => {
    const window = new BrowserWindow({
      width: 1440,
      height: 960,
      minWidth: 1024,
      minHeight: 720,
      title,
      backgroundColor: "#08111f",
      autoHideMenuBar: true,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
      },
    });

    window.webContents.setWindowOpenHandler(({ url: target }) => {
      shell.openExternal(target);
      return { action: "deny" };
    });

    window.webContents.on("will-navigate", (event, target) => {
      const allowedOrigin = new URL(url).origin;
      if (new URL(target).origin !== allowedOrigin) {
        event.preventDefault();
        shell.openExternal(target);
      }
    });

    window.loadURL(url);
  };

  app.whenReady().then(() => {
    createWindow();
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}

module.exports = { launchDesktopApp };
