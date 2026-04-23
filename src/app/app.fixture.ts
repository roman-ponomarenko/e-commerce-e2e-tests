import type {
    PlaywrightTestArgs, PlaywrightTestOptions, PlaywrightWorkerArgs, PlaywrightWorkerOptions,
    TestType
} from "@playwright/test";
import {
    test as base
} from "@playwright/test";
import {App} from "@/app/index";
import type {Config} from "@/config";
import config from "@/config";


type AppFixture = {
    app: App;
    config: Config;
};

export const test: TestType<PlaywrightTestArgs & PlaywrightTestOptions & AppFixture, PlaywrightWorkerArgs & PlaywrightWorkerOptions> = base.extend<AppFixture>({
    app: async ({page}, use) => {
        const app = new App(page);
        await use(app);
    },
    config: async ({}, use) => { // eslint-disable-line no-empty-pattern
        await use(config);
    },
});
