import type {Locator} from "@playwright/test";
import {type Page} from "@playwright/test";
import {step} from "@/utils/step-decorator";

export abstract class PageHolder {
    constructor(protected page: Page) {
    }

    /**
     * More concise alias for locator
     */
    $(selector: string, options: Record<string, unknown> = {}): Locator {
        return this.page.locator(selector, options)
    }

    /**
     * More concise alias for getByTestId
     */
    $id(testId: string): Locator {
        return this.page.getByTestId(testId)
    }
}

export abstract class Component extends PageHolder {
    abstract verifyLoaded(message?: string): Promise<void>;
}

export abstract class AppPage extends Component {
    /**
     * Path to the page can be relative to the baseUrl defined in playwright.config.ts.ts
     * or absolute (on your own risk)
     */
    public abstract pagePath: string;

    /**
     * Opens the page in the browser and expectLoaded should pass
     */
    @step("User opens page")
    async open(path?: string): Promise<void> {
        await this.page.goto(path ?? this.pagePath);
    }

    @step("User navigates back")
    async goBack(): Promise<void> {
        await this.page.goBack();
    }

    @step("User reloads the page")
    async reloadPage(): Promise<void> {
        await this.page.reload();
    }

    @step("User clears local storage")
    async clearLocalStorage(): Promise<void> {
        await this.page.evaluate(() => localStorage.clear());
    }

    @step("User closes the page (tab)")
    async close(): Promise<void> {
        await this.page.close();
    }

    /**
     * Wait for page load state
     */
    protected async waitForLoadState(state: 'load' | 'domcontentloaded' | 'networkidle' = 'networkidle')
        : Promise<void> {
        await this.page.waitForLoadState(state);
    }
}