
Feature: User Profile
  As a user
  I want to manage my profile
  So that I can personalize my experience

  Background:
    Given I am logged in
    And I am on the profile page

  Scenario: Update profile picture
    When I click the change avatar button
    And I upload a new profile picture
    Then my avatar should be updated
    And I should see a success message

  Scenario: Update profile information
    When I update my display name to "Test User"
    And I update my bio to "Test bio"
    And I save the changes
    Then my profile should be updated
    And I should see a success message

  Scenario: View watch history
    When I go to my watch history
    Then I should see my recently watched videos
    And they should be in chronological order
