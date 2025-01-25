import { Before, After } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';

let browser: any;
let page: any;

Before(async function () {
  browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  page = await context.newPage();
  this.page = page;
});

After(async function () {
  await browser?.close();
});