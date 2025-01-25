Feature: Video Playback
  As a user
  I want to watch videos on the platform
  So that I can enjoy the content

  Scenario: User plays a video from the home page
    Given I am on the home page
    When I click on a video in the "Trending Now" section
    Then the video should start playing
    And I should see video controls

  Scenario: User adds video to their list
    Given I am logged in
    And I am on the home page
    When I hover over a video
    And I click the add to list button
    Then I should see a success message
    And the video should be in my list

  Scenario: User browses different categories
    Given I am on the home page
    When I scroll to the "Highly Rated" section
    Then I should see multiple video thumbnails
    And I should be able to navigate through them using arrow buttons