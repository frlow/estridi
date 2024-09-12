import {test} from "vitest";
import {estridi} from "../src";
import * as fs from "fs";
import path from "path";

test.skip("dump figma document", async () => {
  const config = JSON.parse(fs.readFileSync("estridi.json", 'utf8'))
  const data = await estridi().loadFigmaDocument({fileId: "hERI5lpQhUIlONvwsE03d1", token: config.token})
  fs.writeFileSync(path.join("tests", "serviceCalls", "data", "figmaExamples.ts"), `export const figmaExampleTE = ${JSON.stringify(data, null, 2)}`, 'utf8')
})
