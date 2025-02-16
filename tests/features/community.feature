
Feature: Community
  As a user
  I want to interact with other users
  So that I can engage with the community

  Background:
    Given I am logged in
    And I am on the community page

  Scenario: Create post with text
    When I enter "Test post content" in the post input
    And I click the post button
    Then I should see my post in the feed
    And it should show my username

  Scenario: Create post with image
    When I enter "Post with image" in the post input
    And I upload an image
    And I click the post button
    Then I should see my post with the image in the feed

  Scenario: Pin and unpin post
    Given I have created a post
    When I pin the post
    Then it should appear at the top of the feed
    When I unpin the post
    Then it should move to its chronological position

  Scenario: Like and unlike post
    Given there is a post in the feed
    When I click the like button
    Then the like count should increase
    When I click the like button again
    Then the like count should decrease

  Scenario: Delete post
    Given I have created a post
    When I click the delete button
    And I confirm deletion
    Then the post should be removed from the feed
