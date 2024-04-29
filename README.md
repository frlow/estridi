# estridi

Generate tests from your system design!

## getting started

Installation:

```
npm install estridi
```

### create an access token:

Follow the
instruction [here](https://www.figma.com/developers/api#:~:text=Head%20to%20Settings%20from%20the,and%20scopes%20for%20the%20token.)
to create an access token.

### file id

The file id can be found by right clicking on the current tab in figma and selecting copy link

```
https://www.figma.com/file/Izz9320atTsGRKo1AjiuxZ/S3D---Register-Foreign-Payment-Draft?type=whiteboard&node-id=0-1&t=kSN8UTu38sCP8L0s-0
                          /This is the fileId   /
```

### create a config file:

```json5
// estridi.json
{
  "token": "<personal_access_token>",
  "fileId": "<file id>",
  "mode": "<mode>"
  // playwright or vitest
}

```

### Generate files

```
npx estridi
```
