const fs = require('fs')
const {dialog} = require('electron').remote
const path = require('path')
const btnCopy = document.getElementById('btn-createfile')
const btnDest= document.getElementById('btn-destfile')
const spreadsheetInput = document.getElementById('spreadsheet__input')
const originResults = document.getElementById('origin__title') 
const destResults = document.getElementById('dest__title') 
const input = document.getElementById('btn-input') 
const validation = document.getElementById('results') 

let srcFolder = null
let destFolder = null

function getData(spreadsheetId) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    req.open('GET', `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:Z?valueRenderOption=FORMATTED_VALUE&key=AIzaSyCsmkIe9iLWQKSsBFSPmfT53z0rE2csUgY`)
    
    req.onload = () => {      
      if (req.status === 200) {
        resolve(req.response)
      } else {        
        reject(req.status + ' ' + req.statusText)
      }
    }
    req.onerror = () => {
      reject('Erro de conexão')
    }
    req.send()
  })
}

function mkdirpSync (targetDir, {isRelativeToScript = false} = {}) {
  const sep = path.sep
  const initDir = path.isAbsolute(targetDir) ? sep : ''
  const baseDir = isRelativeToScript ? __dirname : '.'
  targetDir = targetDir.replace(/^\//, '')

  targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir)
    try {
      fs.mkdirSync(curDir)
    } catch (err) {
      if (err.code !== 'EEXIST') throw err
    }
    return curDir
  }, initDir)
}


input.addEventListener('click', (event) => {
  event.preventDefault()
  
  try{
    let folderStrutcture = document.getElementById('folderstructure__input') 
    folderStrutcture = folderStrutcture.value.replace(/^\//,'').replace(/\/$/,'')

    let spreadsheetId = spreadsheetInput.value

    let matches = /\/([\w-_]{15,})\/(.*?gid=(\d+))?/.exec(spreadsheetId)
    
    if (matches == null){
      validation.innerHTML = ('Verifique se a PLANILHA foi preenchida corretamente')
    } else {
      validation.innerHTML = ('')
    }
    
    if (matches !== null) {
      
      let counter = 0
      
      getData(matches[1])
      .then(result => {
        //console.log('result is working > > >  ' + result)
        const resultJSON = JSON.parse(result)           
        
        for(let elem of resultJSON['values']) { 
          
          let campanha = elem[0]
          let formato = elem[1]
          let veiculo = elem[2]    
          let criativo = elem[3]
          let nomenclatura = elem[4] 
          let folderBanner = path.join(srcFolder, campanha, criativo, formato)

          if (fs.existsSync(folderBanner)){         
            let folderStr = folderStrutcture.replace(/~CAMPANHA~/, campanha).replace(/~FORMATO~/, formato).replace(/~VEICULO~/, veiculo).replace(/~CRIATIVO~/, criativo)
          
            let folderBannerDest = path.join(destFolder, folderStr)  
            if (!fs.existsSync(folderBannerDest)){
              mkdirpSync(folderBannerDest)                      
            }                    
            
            let files = fs.readdirSync(folderBanner)
            files.forEach((file, index) => {
              
              let ext = path.extname(file)
              
              if(ext === '.jpg' || ext === '.jpeg' || ext === '.png'){
              
              let fromPath = path.join( folderBanner, file )
              let toPath = path.join( folderBannerDest, nomenclatura + ext)
              
              let stat = fs.statSync(fromPath)
                
              if(stat.isFile() && file !== '.DS_Store') { 
                fs.copyFileSync(fromPath,toPath)
                counter++ 
                //console.log('elem === ' + elem) 
              }                           
            }})       
          }
        }
        validation.innerHTML = `${counter} arquivos de ${resultJSON['values'].length} foram copiados.`
      })
    }}
  catch(err){
    console.log(err)
    validation.innerHTML = err.message
  } 
  if (srcFolder == null || destFolder == null ){
    validation.innerHTML = ('Verifique se todas as pastas foram selecionadas corretamente')  
  } else{
    validation.innerHTML = ('copiando arquivos') 
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

