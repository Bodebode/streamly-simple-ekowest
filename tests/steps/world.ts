
import { setWorldConstructor, World } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from 'playwright';

export class CustomWorld extends World {
  private browser: Browser | undefined;
  private context: BrowserContext | undefined;
  page: Page | undefined;

  async init() {
    this.browser = await chromium.launch({
      headless: !process.env.DEBUG,
    });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

setWorldConstructor(CustomWorld);
