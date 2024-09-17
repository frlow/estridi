#!/usr/bin/env node

import {program} from 'commander'
import {estridi} from "./index";
import fs from "fs";
import path from "path";

program
    .option('-t, --target <string>')
    .option('-r, --root-name <string>')
    .option('-i, --import-source <string>')

program.parse();
const options = program.opts()
const instance = estridi(options)
instance.writeFile = (content, fileName) => {
  const toWrite = typeof content === "string" ? content : JSON.stringify(content, null, 2)
  fs.mkdirSync(path.parse(fileName).dir, {recursive: true})
  fs.writeFileSync(fileName, toWrite, 'utf8')
}
instance.loadConfig = () => JSON.parse(fs.readFileSync("estridi.json", 'utf8'))

const run = async () => {
  await instance.generate().catch(e => {
    debugger
  })
}

run().then()
