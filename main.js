const {app, BrowserWindow, Menu, ipcMain, Tray, nativeImage} = require('electron')
const fetch = require('electron-fetch') 
const path = require('path')



const assetsDir = path.join(__dirname, 'assets')

let tray = undefined
let window = undefined


// This method is called once Electron is ready to run our code
// It is effectively the main method of our Electron app
app.on('ready', () => {
  createTray()
  createWindow()
})

const createTray = () => {
  // Setup the menubar with an icon
  //let icon = nativeImage.createFromDataURL(base64Icon)
  tray = new Tray(path.join(assetsDir, 'bitcoin-logo.png'))
  const contextMenu = Menu.buildFromTemplate([
    //{label: 'Item1', type: 'radio'},
    //{label: 'About',click() { dialog.showMessageBox({title: "Bitcoin Ticker", type:"info", message: "A realtime trading price for Luno. \nMIT Copyright (c) 2017 Shafiq Mustapa <sicksand@gmail.com>", buttons: ["Close"] })}},
    {label: 'Exit', click() { app.quit() }}
  ])
  // Add a click handler so that when the user clicks on the menubar icon, it shows
  // our popup window
  tray.on('right-click', toggleWindow)
  tray.on('double-click', toggleWindow)
  
  tray.on('click', function (event) {
    toggleWindow()

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({mode: 'detach'})
    }
  })
  tray.setContextMenu(contextMenu)
}

const createWindow = () => {
  // Make the popup window for the menubar
  window = new BrowserWindow({
    width: 350,
    height: 350,
    show: false,
    frame: false,
    resizable: false,
  })

  // Tell the popup window to load our index.html file
  window.loadURL(`file://${path.join(__dirname, 'index.html')}`)

  // Only close the window on blur if dev tools isn't opened
  window.on('blur', () => {
    if(!window.webContents.isDevToolsOpened()) {
      window.hide()
    }
  })
}
const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide()
  } else {
    showWindow()
  }
}

const showWindow = () => {
  const trayPos = tray.getBounds()
  const windowPos = window.getBounds()
  let x, y = 0
  if (process.platform == 'darwin') {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height)
  } else {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height * 10)
  }


  window.setPosition(x, y, false)
  window.show()
  window.focus()
}

ipcMain.on('show-window', () => {
  showWindow()
})

//get price updated
ipcMain.on('price-updated', (event, price) => {
  //set price on tray
  tray.setToolTip('RM ' + `${price}`)
  tray.setTitle('RM ' + `${price}`)
})

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})