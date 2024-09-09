import {test} from "vitest";
import {estridi} from "../src";
import * as fs from "fs";

test.skip("dump figma document", async () => {
  const config = JSON.parse(fs.readFileSync("estridi.json", 'utf8'))
  const data = await estridi().loadFigmaDocument({fileId: config.fileId, token: config.token})
  debugger
})
