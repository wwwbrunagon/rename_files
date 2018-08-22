
'use strict'
const { app, BrowserWindow, Menu} = require('electron')


require('electron-reload')(__dirname)



app.on('ready', () => {
    console.log('Aplicacao Iniciada')
    let mainWindow = new BrowserWindow({
            width: 550,
            height: 600
        })

   mainWindow.loadURL(`file://${__dirname}/app/index.html`)
   console.log(__dirname)
   let template = [{
    label: "Application",
    submenu: [
        { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
        { label: "DevTools", role: "toggledevtools" },
        { type: "separator" },
        { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
    ]}, {
    label: "Edit",
    submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        
    ]}
]


Menu.setApplicationMenu(Menu.buildFromTemplate(template))
})

app.on('window-all-closed', () => {
    app.quit()
   
})



