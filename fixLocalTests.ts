import fs from "fs";

const files = fs.readdirSync("tests").filter(file => file.includes(".data.ts") || file.includes(".test.ts"))
for (const file of files) {
  const filePath = `tests/${file}`
  fs.writeFileSync(filePath, fs.readFileSync(filePath, 'utf8').replace("'estridi'", "'../src/runner.js'"), 'utf8')
}
