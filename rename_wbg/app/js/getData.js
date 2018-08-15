const fs = require('fs')
const {dialog} = require('electron').remote
const path = require('path')
const form = document.getElementById("form__copyfile")
const btn__copy = document.getElementById("btn-createfile")
const btn__dest= document.getElementById("btn-destfile")
const spreadsheet__input = document.getElementById('spreadsheet__input')
const origin__results = document.getElementById('origin__title') 
const dest__results = document.getElementById('dest__title') 

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


form.addEventListener("submit", function(event){
  event.preventDefault()
  
  let spreadsheetId = spreadsheet__input.value
  console.log(spreadsheetId)
  
  let matches = /\/([\w-_]{15,})\/(.*?gid=(\d+))?/.exec(spreadsheetId)
  console.log("Full matches = " + matches)
  
  if (matches !== null) {
    console.log("valor de spreadsheetId = " + matches[1])            
    
    getData(matches[1])
    .then(result => {
      //console.log('result is working > > >  ' + result)
      const resultJSON = JSON.parse(result)
      console.log('typeof resultJSON = ' + typeof resultJSON)
      
      
      for(let ele of resultJSON["values"]) {
        if (fs.existsSync(path.join(srcFolder,ele[3], ele[1], 'test.png'))){
          
          
          //dificuldade: definir path, criar uma variavel para o path que esta definido como 'test.png' 


          fs.copyFileSync(path.join(srcFolder,ele[3], ele[1], 'test.png'),path.join(destFolder, ele[4]+ '.png'),function (err) {
            if (err) throw err;
            console.log('renamed complete')
          }) 
          console.log('ele === ' + ele)
          console.log('length esta aqui ' + srcFolder.length)
          
        }
      }
    })    
    spreadsheet__input.value = 'https://docs.google.com/spreadsheets/d/1bGcrVSoPs9d-Qy879E0MieF48xaUC6xv9y-GY7L4T98/edit#gid=0'
  }
})



btn__copy.addEventListener('click', () => {
  
  dialog.showOpenDialog({properties: ['openDirectory']},(filenames) => {
    if(filenames === undefined){
      console.log('no files selected')
      return
    }  else {
      srcFolder = filenames[0]
      origin__results.innerHTML = (filenames[0])
    }   
  })
},false)


btn__dest.addEventListener('click', () => {
  dialog.showOpenDialog({properties: ['openDirectory']},(filenames) => {
    if(filenames === undefined){
      console.log('no files selected')
      return
      
    }  else{
      destFolder = filenames[0]
      dest__results.innerHTML = (filenames[0])
    }   
  })
},false)





