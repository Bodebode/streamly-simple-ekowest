
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { Page } from 'playwright';

Given('I am on the auth page', async function(this: { page: Page }) {
  await this.page.goto('http://localhost:8080/auth');
});

When('I enter my email {string}', async function(this: { page: Page }, email: string) {
  await this.page.fill('[data-testid="email-input"]', email);
});

When('I enter my password {string}', async function(this: { page: Page }, password: string) {
  await this.page.fill('[data-testid="password-input"]', password);
});

When('I click the {string} button', async function(this: { page: Page }, buttonType: string) {
  await this.page.click(`[data-testid="${buttonType}-button"]`);
});

Then('I should be redirected to the home page', async function(this: { page: Page }) {
  await this.page.waitForURL('http://localhost:8080/');
});

Then('I should see my profile avatar in the navbar', async function(this: { page: Page }) {
  const avatar = await this.page.waitForSelector('[data-testid="user-avatar"]');
  expect(avatar).toBeTruthy();
});
