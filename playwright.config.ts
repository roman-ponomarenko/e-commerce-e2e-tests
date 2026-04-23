import {devices, PlaywrightTestConfig} from '@playwright/test';
import config from "@/config";

import * as os from "node:os";

const pwConfig: PlaywrightTestConfig = {
    timeout: 90 * 1000,  // Global timeout for each test
    retries: config.PW_MAX_RETRIES,
    workers: config.PW_WORKERS,
    testDir: './tests',
    testMatch: /.*\.tests\.ts/,
    expect: {
        timeout: 10 * 1000,
    },

    outputDir: './.out/playwright-test-results',

    reporter: [
        ["line"],
        ['html', {open: 'never', outputFolder: './.out/playwright-report'}],
        [
            "allure-playwright",
            {
                output: "./.out/allure-report",
                resultsDir: "./.out/allure-results",
                detail: true,
                suiteTitle: true,
                environmentInfo: {
                    os_platform: os.platform(),
                    os_release: os.release(),
                    os_version: os.version(),
                    node_version: process.version,
                },
            },
        ],
    ],

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
            use: {...devices['Desktop Chrome'], viewport: {width: 1366, height: 768}},
        },
    ],
};

export default pwConfig;
