
Feature: Authentication
  As a user
  I want to be able to sign up and login
  So that I can access protected features

  Scenario: User signup
    Given I am on the auth page
    When I enter my email "test@example.com"
    And I enter my password "testpassword123"
    And I click the sign up button
    Then I should be redirected to the home page
    And I should see my profile avatar in the navbar

  Scenario: User login
    Given I am on the auth page
    When I enter my email "test@example.com"
    And I enter my password "testpassword123"
    And I click the login button
    Then I should be redirected to the home page
    And I should see my profile avatar in the navbar

  Scenario: User logout
    Given I am logged in
    When I click on my profile avatar
    And I click the logout button
    Then I should be logged out
    And I should see the login button
