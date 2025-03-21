import {loadFigmaDocument} from "core";

export const loadFromFigma = async (args: {
  token: string
  fileId: string
}): Promise<any> => loadFigmaDocument(args)
