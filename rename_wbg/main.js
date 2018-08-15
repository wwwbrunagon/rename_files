const { app, BrowserWindow, ipcMain } = require('electron')

app.on('ready', () => {
    console.log('Aplicacao Iniciada')
    let mainWindow = new BrowserWindow({
            width: 550,
            height: 320
        })
   mainWindow.loadURL(`file://${__dirname}/app/index.html`)
   console.log(__dirname)
})

app.on('window-all-closed', () => {
    app.quit()
   
})
