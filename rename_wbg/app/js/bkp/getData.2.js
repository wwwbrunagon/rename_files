const fs = require('fs')
const {dialog} = require('electron').remote
const path = require('path')
const form = document.getElementById("form__copyfile")
const btn__copy = document.getElementById("btn-createfile")
const btn__dest= document.getElementById("btn-destfile")
const spreadsheet__input = document.getElementById('spreadsheet__input')
const results = document.getElementById('results') 
const origin__results = document.getElementById('origin__title') 
const dest__results = document.getElementById('dest__title') 


let srcFolder = 'src'



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
      console.log("spreadsheetId = " + matches[1])            
      //results.innerHTML = ("spreadsheetId: " + matches[1])

      getData(matches[1])
      .then(result => {
          //console.log('result = ' + result)
          const resultJSON = JSON.parse(result)
          console.log('typeof resultJSON = ' + typeof resultJSON)

          for(let ele of resultJSON["values"]) {
            fs.copyFileSync(srcFolder, `dest/watch/${ele[4]}`+ '.jpg',function (err) {
              if (err) throw err;
              console.log('renamed complete')
            }) 

            results.innerHTML = ("path test spreadsheetId: " + ele[3])
            console.log('length esta aqui ' + srcFolder.length)
            
          }
      })

      spreadsheet__input.value = ' '
    }
 })

  
   
  btn__copy.addEventListener('click', () => {

      dialog.showOpenDialog((filenames) => {
        if(filenames === undefined){
          console.log('no files selected')
            return
        }

        fs.readFile(filenames[0], 'utf-8', (err, data) => {
          if(err){
          console.log ('An Error ocurred' + err.message)
          return
      }
      origin__results.innerHTML = (filenames[0] + data)
      
    })
  })
  },false)


  btn__dest.addEventListener('click', () => {

      dialog.showOpenDialog((filenames) => {
        if(filenames === undefined){
          console.log('no files selected')
            return
        }
        console.log(dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']}))

        fs.readFile(filenames[0], 'utf-8', (err, data) => {
          if(err){
          console.log ('An Error ocurred' + err.message)
          return
      }
      dest__results.innerHTML = (filenames[0] + data)
      
    })
  })
  },false)


