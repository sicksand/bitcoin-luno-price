const {app, BrowserWindow, Menu, ipcMain, Tray} = require('electron')
const fetch = require('electron-fetch') 
const path = require('path')



const assetsDir = path.join(__dirname, 'assets')

let tray = undefined
let window = undefined

if (process.platform == 'darwin') {
  app.dock.hide()
} 


// This method is called once Electron is ready to run our code
// It is effectively the main method of our Electron app
app.on('ready', () => {
  createTray()
  createWindow()
})

// Quit the app when the window is closed
app.on('window-all-closed', () => {
  app.quit()
})

const createTray = () => {
  // Setup the menubar with an icon
  //let icon = nativeImage.createFromDataURL(base64Icon)
  tray = new Tray(path.join(assetsDir, 'bitcoin-logo16.png'))
  /*
  const contextMenu = Menu.buildFromTemplate([
    //{label: 'Item1', type: 'radio'},
    //{label: 'About',click() { dialog.showMessageBox({title: "Bitcoin Ticker", type:"info", message: "A realtime trading price for Luno. \nMIT Copyright (c) 2017 Shafiq Mustapa <sicksand@gmail.com>", buttons: ["Close"] })}},
    {label: 'Exit', click() { app.quit() }}
  ])
  // Add a click handler so that when the user clicks on the menubar icon, it shows
  // our popup window
  */
  tray.on('right-click', toggleWindow)
  tray.on('double-click', toggleWindow)
  
  tray.on('click', function (event) {
    toggleWindow()
  })
  //tray.setContextMenu(contextMenu)
}

const getWindowPosition = () => {
  const windowBounds = window.getBounds()
  const trayBounds = tray.getBounds()

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 3)

  return {x: x, y: y}
}

const createWindow = () => {
  // Make the popup window for the menubar
  window = new BrowserWindow({
    width: 350,
    height: 175,
    show: false,
    frame: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false
    }
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
  const position = getWindowPosition()
  window.setPosition(position.x, position.y, false)
  window.show()
  window.focus()
}

ipcMain.on('show-window', () => {
  showWindow()
})

//get price updated
ipcMain.on('price-updated', (event, bp) => {
  //set price on tray
  var date = new Date(+(`${bp[0].timestamp}`))
  var formattedDate = date.getDate() + '-' + ('0' +(date.getMonth()+1)).slice(-2) + '-' + date.getFullYear() + ' ' + date.getHours() + ":" + ('0' + date.getMinutes()).slice(-2) + ":" + ('0' + date.getSeconds()).slice(-2)
  var bPrice = Number(`${bp[0].bid}`).toLocaleString()
  var aPrice = Number(`${bp[0].ask}`).toLocaleString()
  var hPrice = (+(`${bp[0].bid}`) + +(`${bp[0].ask}`)) / 2
  hPrice = hPrice.toString().split('.')
  var sPrice = Number(hPrice[0]).toLocaleString()
  tray.setToolTip('RM ' + `${sPrice} at ${formattedDate}`)
  tray.setTitle('RM ' + `${sPrice}`)
})
