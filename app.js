const http = require('http')
const fs = require('fs')
const path = require('path')

const hostname = '192.168.1.111'
const port = 3333

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World\n')
})

let srcFolder = 'src'
let destFolder = path.join(__dirname, 'final')
let watchFolder = path.join(__dirname, srcFolder, 'watch')

let planilha = fs.readFileSync('planilha.tsv', 'utf-8').split('\n')
let novaPlanilha = []

let creatives = {
  // 'Nome do campo do PP': 'Nome da pasta dentro de src'
  '2_via_conta': '2ª Via de Conta',
  'Compartilhamento de internet pré pago': 'Compartilhamento de internet pré pago',
  'Consumo de saldo POS pago': 'Consulta de saldo POS pago',
  'Consumo de saldo PRE pago': 'Consulta de saldo PRE pago',
  'POS DADOS': 'Consumo-Pos dados',
  'PRE DADOS': 'Consumo-Pre dados',
  'Debito automático Pós Pago': 'Debito automático Pós Pago',
  'Extrato Detalhado Pós Pago': 'Extrato Detalhado Pós Pago',
  'Extrato Detalhado Pré Pago': 'Extrato Detalhado Pré Pago',
  'POS PAGO - conta digital': 'POS PAGO - conta digital',
  'POS PAGO - troca de plano': 'POS PAGO - troca de plano',
  'Pos pago Agendamento em loja': 'Pos pago Agendamento em loja',
  'Pos Pago Vivo Valoriza': 'Pos Pago Vivo Valoriza',
  'Recarga Pré Pago': 'Recarga Pré Pago'
}

let counter = 0

loop1: for (let row of planilha) {
  let cell = row.split('\t')
  let creative = cell[3].trim()
  let format = cell[1]
  let veiculo = cell[2] || format
  let name = cell[4].replace('\r', '')
  if (creative && format && veiculo && name && creatives[creative] && fs.existsSync(path.join(watchFolder, creatives[creative]))) {
    let formatFolder = path.join(watchFolder, creatives[creative], format)

    if (fs.existsSync(formatFolder)) {
      if (!fs.existsSync(path.join(destFolder, creatives[creative]))) fs.mkdirSync(path.join(destFolder, creatives[creative]))
      if (!fs.existsSync(path.join(destFolder, creatives[creative], veiculo))) fs.mkdirSync(path.join(destFolder, creatives[creative], veiculo))
      if (!fs.existsSync(path.join(destFolder, creatives[creative], veiculo, format))) fs.mkdirSync(path.join(destFolder, creatives[creative], veiculo, format))
      // if (!fs.existsSync(path.join(destFolder, veiculo))) fs.mkdirSync(path.join(destFolder, veiculo))

      let files = fs.readdirSync(formatFolder).filter(f => f.indexOf('.jpg') !== -1 || f.indexOf('.png') !== -1)
      for (let file of files) {
        let ext = path.extname(file)
        let index = file.split('_')[1]
        fs.copyFileSync(path.join(formatFolder, file), path.join(destFolder, creatives[creative], veiculo, format, name + (index ? '_' + index.replace(ext, '') : '') + ext))
        // fs.copyFileSync(path.join(formatFolder, file), path.join(destFolder, veiculo, name + (index ? '_' + index.replace(ext, '') : '') + ext))
      }

      cell[0] = 'Produzido'
      // continue loop1
    }
    // console.log(creative, format, ++counter)
  } else {
    console.log(creative)
  }
  row = cell.join('\t')
  novaPlanilha.push(row)
}

fs.writeFileSync('nova_planilha.tsv', novaPlanilha.join('\n'), err => {
  if (err) throw err
  console.log('Saved!')
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})