
Feature: Rewards System
  As a user
  I want to track my rewards
  So that I can benefit from my engagement

  Background:
    Given I am logged in
    And I am on the rewards page

  Scenario: View rewards dashboard
    Then I should see my total points
    And I should see my watch time
    And I should see available rewards

  Scenario: Earn points from watching
    When I watch a video for 10 minutes
    Then my points should increase
    And my watch time should update

  Scenario: Redeem rewards
    Given I have sufficient points
    When I select a reward to redeem
    And I confirm the redemption
    Then my points balance should decrease
    And I should receive a confirmation
