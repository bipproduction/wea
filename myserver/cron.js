const fs = require('fs')
require('colors')
const moment = require("moment")
let dataLog = fs.readFileSync('./log.log').toString().split("\n")

const date = moment().format("YYYY-MM-DD hh:mm:ss")
dataLog.push(`${date} : Data Log Cron`)

fs.writeFileSync('log.log', dataLog.join("\n"))
console.log("success".green)