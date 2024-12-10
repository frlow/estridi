### Vi har kommit fram till följande:

- Det är möjligt att genera front-end direkt från S3D men 
med dålig och inkonsekvent kvalitet. (ej rekommenderat)
- Vi har gjort försök att generara både tester och applikation 
helt automatiskt från S3D med *viss* framgång. 
Problemet är här att det finns myket underförstådd information i flödesschemat. 
- En bättre lösning är att utvecklaren imlementerar testern som generas från estridi
och därefter används GPT för att generera/uppdatera applikationen.

Slutsatsen just nu är att vi behöver färdigställa testvektyget estridi samt skriva dokumentation och skapa exempel.
