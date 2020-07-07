const fs = require("fs")

const readFile = (fileName) => {
  const buf = fs.readFileSync(fileName)
  return JSON.parse(buf.toString())
}

module.exports = readFile
