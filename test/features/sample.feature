Feature: Sample Feature 1

Background:
  Given I am a test

  @UnitTest @Secondary
  Scenario: Sample Scenario 1
    Then I am a step

  @UnitTest @Ignore
  Scenario: Sample Scenario 2
    Then I am a step

  Scenario: Sample Scenario 2
    Then I am a step
