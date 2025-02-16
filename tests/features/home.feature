
Feature: Home Page
  As a user
  I want to browse and watch videos
  So that I can enjoy African content

  Background:
    Given I am on the home page

  Scenario: Browse video categories
    Then I should see the following categories:
      | Trending Now   |
      | Highly Rated   |
      | Yoruba Movies  |
      | Skits          |
      | New Release    |

  Scenario: Play video from carousel
    When I hover over a video thumbnail
    And I click the play button
    Then the video player should open
    And the video should start playing

  Scenario: Add video to my list
    Given I am logged in
    When I hover over a video thumbnail
    And I click the add to list button
    Then I should see a success notification
    And the video should be added to my list

  Scenario: Search functionality
    When I click the search button
    And I enter "nollywood" in the search input
    Then I should see search results
    And each result should have a thumbnail and title
