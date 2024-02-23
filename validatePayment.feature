Feature: Validate payment
  Scenario:
    Then Subflow: Validate fields: Payment Data

  Scenario:
    Then Subflow: Validate fields: Recipient Data

  Scenario:
    Given Validation errors? no
    Then Call: /crossborder-payments using UnvalidatedPayment and returning ValidatedPayment

  Scenario:
    Given Validation errors? yes
    Then Message: Display correct errors for incorrect fields

  Scenario:
    Given Errors from /crossborder-payments? no
    Then Subflow: payment summary

  Scenario:
    Given Errors from /crossborder-payments? yes
    Then Message: text



