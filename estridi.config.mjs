import {createEstridiConfig} from './src/config.js'
import 'dotenv/config'

export default createEstridiConfig({
  config: {
    token: process.env.ESTRIDI_TOKEN,
    fileId: "K4bRM5eOFCEYIPQMAcpdst"
  }
})
