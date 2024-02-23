Feature: payment summary
  Scenario:
    Then Message: Show payment details

  Scenario:
    Given new payee "yes"
    Then Script: Set button to "Lägg till"

  Scenario:
    Given new payee "no"
    Then Script: Set button to "Signera mottagare och lägg tilll betalning"

  Scenario:
    When Lägg till/signera mottagare och lägg till betalning
    Then Subflow: Add to basket

  Scenario:
    When Avbryt
    Then Jump: Go back to registration page
