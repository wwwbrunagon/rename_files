const fs = require('fs')
const {dialog} = require('electron').remote
const path = require('path')
const form = document.getElementById('form__copyfile')
const btnCopy = document.getElementById('btn-createfile')
const btnDest= document.getElementById('btn-destfile')
const spreadsheetInput = document.getElementById('spreadsheet__input')
const originResults = document.getElementById('origin__title') 
const destResults = document.getElementById('dest__title') 
let srcFolder = null
let destFolder = null


function getData(spreadsheetId) {
  return new Promise(function (resolve, reject) {
    const req = new XMLHttpRequest()
    req.open('GET', `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1?valueRenderOption=FORMATTED_VALUE&key=AIzaSyCsmkIe9iLWQKSsBFSPmfT53z0rE2csUgY`)
    
    req.onload = function () {      
      if (req.status === 200) {
        resolve(req.response)
      } else {        
        reject(req.status + ' ' + req.statusText)
      }
    }
    req.onerror = function () {
      reject('Erro de conexão')
    }
    req.send()
  })
}


form.addEventListener('submit', function(event){
  event.preventDefault()

  console.log('btnCopy =   '+ btnCopy.value)
  console.log(btnDest.value)

  let spreadsheetId = spreadsheetInput.value
  console.log(spreadsheetId)
  
  let matches = /\/([\w-_]{15,})\/(.*?gid=(\d+))?/.exec(spreadsheetId)
  console.log('Full matches = ' + matches)
  
  if (matches !== null) {
    console.log('valor de spreadsheetId = ' + matches[1])            
    
    getData(matches[1])
    .then(result => {
      //console.log('result is working > > >  ' + result)
      const resultJSON = JSON.parse(result)
      console.log('typeof resultJSON = ' + typeof resultJSON)
      
      
      for(let elem of resultJSON['values']) {        

        let folderBanner = path.join(srcFolder, elem[3], elem[1])
          if (fs.existsSync(folderBanner)){ 
          if (!fs.existsSync( path.join(destFolder, elem[3]))){
            fs.mkdirSync( path.join(destFolder, elem[3]))
          }
   
          let folderBannerDest = path.join(destFolder, elem[3], elem[1])
          if (!fs.existsSync(folderBannerDest)){
            fs.mkdirSync(folderBannerDest)
          }         
          fs.readdir(folderBanner, (err, files) => {
            if( err ) {
              console.error('Could not list the directory.', err )
              return
            } 
            
            files.forEach((file, index) => {
              // Make one pass and make the file complete
              let fromPath = path.join( folderBanner, file )
              let toPath = path.join( folderBannerDest, elem[4] )
              
              fs.stat( fromPath, function( error, stat ) {
                if( error ) {
                  console.error( 'Error stating file.', error )
                  return
                }
                
                if( stat.isFile() && file !== '.DS_Store') { 
                  fs.copyFileSync(fromPath,toPath,(err) => {
                    if (err) throw err;
                    console.log('renamed complete')
                  }) 
                  console.log('elem === ' + elem) 
                }                
              })
            })
          })
        }
      }
    })    
    spreadsheetInput.value = ''
  }
})


btnCopy.addEventListener('click', () => {
  dialog.showOpenDialog({properties: ['openDirectory']},(filenames) => {
    if(filenames === undefined){
      console.log('no files selected')
      return
    }  else {
      srcFolder = filenames[0]
      originResults.innerHTML = (filenames[0])
    }   
  })
},false)


btnDest.addEventListener('click', () => {
  dialog.showOpenDialog({properties: ['openDirectory']},(filenames) => {
    if(filenames === undefined){
      console.log('no files selected')
      return

    }  else{
      destFolder = filenames[0]
      destResults.innerHTML = (filenames[0])
    }   
  })
},false)




