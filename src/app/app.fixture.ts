import { test as base } from "@playwright/test";
import {App} from "@/app/index";
import type {Config} from "@/config";
import config from "@/config";


type AppFixture = {
    app: App;
    config: Config;
};

export const test = base.extend<AppFixture>({
    app: async ({page}, use) => {
        const app = new App(page);
        await use(app);
    },
    // eslint-disable-next-line no-empty-pattern
    config: async ({}, use) => {
        await use(config);
    },
});
