```mermaid
flowchart LR
    start(("root:main"))
    loadData[["Get data from backend"]]
    anyErrors{"Any errors from backend?"}
    showErrors["Show server error"]
    justInfo["Dotted line Not Used"]
    showData["Show Data"]
    actionButtons{{"Data Buttons"}}
    cancel((("Cancel Clicked")))
    clearPage["Clear page"]
    next((("Next Clicked")))
    stop(("end"))
    nextPage("Next Page")
    start --> loadData --> anyErrors -- no --> showData --> actionButtons --> stop
    anyErrors -- yes --> showErrors
    anyErrors -.-> justInfo
    actionButtons ==> cancel --> clearPage
    actionButtons ==> next --> nextPage
    startNextPage(("Next Page"))
    showDone["Show Done"]
    startNextPage --> showDone
```

### Table example
| .My Table |  Value  |
|:----------|:-------:|
| DemoA     |  True   |
| DemoB     |  False  |
