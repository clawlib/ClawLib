import { z } from 'zod';
import { createTool } from '../tools';
import { chromium } from 'playwright';

export const webAutomation = createTool({
    id: 'web_automation',
    description: 'Automate a web browser to interact with sites (Social Media, etc.)',
    parameters: z.object({
        url: z.string().url(),
        action: z.enum(['scrape', 'screenshot', 'click', 'type']),
        selector: z.string().optional(),
        textToType: z.string().optional()
    }),
    execute: async ({ url, action, selector, textToType }) => {
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url);

        let result: any = { success: true };

        try {
            if (action === 'scrape') {
                result.content = await page.content();
            } else if (action === 'screenshot') {
                const buffer = await page.screenshot();
                result.screenshotBase64 = buffer.toString('base64');
            } else if (action === 'click' && selector) {
                await page.click(selector);
            } else if (action === 'type' && selector && textToType) {
                await page.fill(selector, textToType);
            }
        } catch (e: any) {
            result = { success: false, error: e.message };
        } finally {
            await browser.close();
        }

        return result;
    }
});
