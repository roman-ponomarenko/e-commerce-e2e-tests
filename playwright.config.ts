import {defineConfig, devices} from '@playwright/test';
import config from "@/config";

export default defineConfig({
    timeout: 90 * 1000,  // Global timeout for each test
    retries: config.PW_MAX_RETRIES,
    workers: config.PW_WORKERS,
    testDir: './tests',
    testMatch: /.*\.tests\.ts/,
    expect: {
        timeout: 10 * 1000,
    },

    reporter: [['html', {open: 'never'}], ['list', {printSteps: true}]],

    use: {
        baseURL: config.APP_URL,
        headless: config.CI,
        launchOptions: {
            slowMo: config.PW_SLOW_MO,
        },
        screenshot: {
            fullPage: true,
            mode: 'on',
        },
        testIdAttribute: 'data-testid',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
        permissions: ["clipboard-read"],
    },
    projects: [
        {
            name: 'chrome',
            use: {...devices['Desktop Chrome'], viewport: { width: 1366, height: 768 }},
        },
    ],
});
