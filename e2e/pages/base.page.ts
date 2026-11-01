import { type Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}
  abstract readonly path: string;

  async setupStorage(data?: { city?: string; cart?: any[]; user?: any }): Promise<void> {
    const city = data?.city || 'ghaziabad';
    const cartJson = JSON.stringify(data?.cart || []);
    const userJson = data?.user ? JSON.stringify(data.user) : null;

    await this.page.addInitScript(
      ({ city, cartJson, userJson }) => {
        try {
          localStorage.setItem('dirtfree_city', city);
          localStorage.setItem('dirtfree_cart', cartJson);
          if (userJson) {
            localStorage.setItem('dirtfree_current_user', userJson);
          } else {
            localStorage.removeItem('dirtfree_current_user');
          }
        } catch (e) {
          console.error('Init script storage error:', e);
        }
      },
      { city, cartJson, userJson }
    );
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
    await this.page.locator('main').waitFor({ state: 'visible', timeout: 30_000 });
  }
}
