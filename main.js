const {app, BrowserWindow} = require('electron');

const DONT_OPEN_IN_BROWSER = [
  'https://example.org',
  'http://localhost',
  'http://127.0.0.1'
];

// Function domainAndPathSame() taken from: https://github.com/Automattic/wp-desktop/blob/411381139e089cecb446f659aee30921ecd4f810/desktop/window-handlers/external-links/index.js#L35
// Authors: the WordPress.com for Desktop contributors
// GPL v2 licensed, see: https://github.com/Automattic/wp-desktop/blob/411381139e089cecb446f659aee30921ecd4f810/LICENSE.md
const domainAndPathSame = (first, second) => first.hostname === second.hostname && (first.pathname === second.pathname || second.pathname === '/*');

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');

  // Hook adapted after: https://github.com/Automattic/wp-desktop/blob/411381139e089cecb446f659aee30921ecd4f810/desktop/window-handlers/external-links/index.js#L58-L79
  // Authors: the WordPress.com for Desktop contributors
  // GPL v2 licensed, see: https://github.com/Automattic/wp-desktop/blob/411381139e089cecb446f659aee30921ecd4f810/LICENSE.md
  mainWindow.webContents.on('new-window', function(event, url) {
    const parsedUrl = new URL(url);

    for (let x = 0; x < DONT_OPEN_IN_BROWSER.length; x++) {
      const dontOpenUrl = new URL(DONT_OPEN_IN_BROWSER[ x ]);

      if (domainAndPathSame(parsedUrl, dontOpenUrl)) {
        console.log('Open in-app for: ' + url);
        return;
      }
    }

    console.log('Open in new browser for ' + url);
    require('electron').shell.openExternal(url);
    event.preventDefault();
  });

  mainWindow.webContents.openDevTools();
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  app.quit()
});