---
title: Getting Started
---

Start by installing estridi
```bash
npm i --save-dev estridi
```

Estridi requires a configuration file, name it estridi.json
```json
{
  "token": "<my figma user token>",
  "fileId": "<file id of the FigJam board>"
}
```
Learn how to create figma token [here](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens)

##### Important! 
Make sure to include estridi.json in your .gitignore file. The user token should not be checked in!  

The fileId can be found by right-clicking the tab of the FigJam board and selecting "Copy Link"
https://www.figma.com/board/MyFileIdGoesHere/My-Board?...

The fileId is this part: "MyFileIdGoesHere"

## Generate your tests
Generate your first tests using the following command
```bash
estridi # base case

estridi -r my-root # specify root node
estridi -r + # generate for all root nodes
estridi -t playwright # specify target (default: playwright)
estridi -d tests # specify directory to write tests do (default: ./tests)
estridi -u # generate optional utils file
```
