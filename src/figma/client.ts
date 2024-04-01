import * as Figma from 'figma-api'

export const loadDocumentFromFigma = async ({ token, fileId }: { fileId: string, token: string }) => {
  const api = new Figma.Api({
    personalAccessToken: token
  })

  const file = await api.getFile(fileId)
  return file.document
}
