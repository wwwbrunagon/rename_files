const fs = require('fs')
const {dialog} = require('electron').remote

document.getElementById('btn-createfile').addEventListener('click', () => {
  let content = 'hello, this is the content of the new file'

       fs.copyFileSync('src/re-name-me.html', 'dest/i-was-copied.html', (err) => {
          if(err) {
            console.log ('An Error ocurred' + err.message)
            return
        }
  
    })
  })
 
