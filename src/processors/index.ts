import {Estridi, EstridiConfig, LogFunc, Scraped} from "../index";
import {processFigma} from "./figma";

export const allowedRegex = /[^a-zA-Z0-9åäöÅÄÖ ]/g
export const sanitizeText = (text: string)=>text.replaceAll(allowedRegex, ' ')
    .replace(/\n/g, ' ')
    .replace(/ +/g, ' ')
    .trim()

export const process = async (config: EstridiConfig, estridi: Estridi, log: LogFunc): Promise<Scraped> => {
  // Passing estridi object to simplify mocking.
  if (config.type === "figma") {
    const figmaData = await estridi.loadFigmaDocument(config)
    if (config.logging === "verbose") log("loadedData", figmaData)
    return await processFigma(config, figmaData, log)
  }
  throw "sodihfosdf"
}
