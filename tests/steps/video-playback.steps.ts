import { test, expect } from '@playwright/test';
import { Given, When, Then } from '@cucumber/cucumber';

let page: any;

Given('I am on the home page', async function () {
  page = await test.page();
  await page.goto('/');
});

Given('I am logged in', async function () {
  // Implement login logic using Supabase auth
  // This is a placeholder - actual implementation would depend on your auth flow
  await page.evaluate(() => {
    // You might want to set up auth tokens or session data here
    localStorage.setItem('supabase.auth.token', 'test-token');
  });
});

When('I click on a video in the {string} section', async function (section: string) {
  await page.locator(`[aria-label="${section} movie category"] .movie-card`).first().click();
});

When('I hover over a video', async function () {
  await page.locator('.movie-card').first().hover();
});

When('I click the add to list button', async function () {
  await page.locator('button[aria-label*="Add to My List"]').click();
});

When('I scroll to the {string} section', async function (section: string) {
  await page.locator(`[aria-label="${section} movie category"]`).scrollIntoViewIfNeeded();
});

Then('the video should start playing', async function () {
  await expect(page.locator('iframe[src*="youtube.com"]')).toBeVisible();
});

Then('I should see video controls', async function () {
  await expect(page.locator('.video-controls')).toBeVisible();
});

Then('I should see a success message', async function () {
  await expect(page.locator('[role="status"]')).toContainText('Added to My List');
});

Then('the video should be in my list', async function () {
  // This would need to verify the video is actually in the user's list
  // You might want to check the Supabase database or UI indication
  await expect(page.locator('button[aria-label*="Remove from My List"]')).toBeVisible();
});

Then('I should see multiple video thumbnails', async function () {
  await expect(page.locator('.movie-card')).toHaveCount({ min: 4 });
});

Then('I should be able to navigate through them using arrow buttons', async function () {
  await expect(page.locator('button[aria-label="Next"]')).toBeVisible();
  await expect(page.locator('button[aria-label="Previous"]')).toBeVisible();
});