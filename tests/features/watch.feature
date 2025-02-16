
Feature: Video Watching
  As a user
  I want to watch videos and earn rewards
  So that I can enjoy content while being rewarded

  Background:
    Given I am logged in
    And I am watching a video

  Scenario: Earn points while watching
    When I watch the video for 5 minutes
    Then I should earn watch points
    And I should see my updated points in the rewards section

  Scenario: Video player controls
    When I click the fullscreen button
    Then the video should be in fullscreen mode
    When I click escape
    Then the video should exit fullscreen mode

  Scenario: Video recommendations
    When I finish watching a video
    Then I should see recommended videos
    And the recommendations should be related to what I watched
