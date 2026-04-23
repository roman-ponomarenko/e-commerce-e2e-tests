import {expect} from "@playwright/test";
import type {Page} from "@playwright/test";
import {Component} from "@/app/abstract-classes";
import {step} from "@/utils/step-decorator";

export class SpCookieKeyPoint extends Component {

    constructor(page: Page,
                private readonly frameLocator: string,
                private readonly categoryName: string) {
        super(page);
    }

    private get frameElement() {
        return this.page.frameLocator(this.frameLocator);
    }

    private get rootElement() {
        return this.frameElement.locator(
            `#pc-categories-list .list-item:has-text('${this.categoryName}')`
        )
    }

    private get expandButton() {
        return this.rootElement.locator(".list-item-heading__button");
    }

    private get checkboxToggler() {
        return this.rootElement.locator(".list-item-heading label.input-switch");
    }

    private get checkbox() {
        return this.rootElement.getByRole('checkbox', {name: this.categoryName});
    }

    // Verifications methods
    @step("Verifying section is visible")
    async verifyLoaded(message = `'${this.categoryName}' key point should be visible`): Promise<void> {
        await expect(this.expandButton, message).toBeVisible();
    }

    @step("Verifying checkbox is checked")
    async verifyCheckboxChecked(message = `'${this.categoryName}' checkbox should be checked`): Promise<void> {
        await expect(this.checkbox, message).toBeChecked();
    }

    @step("Verifying checkbox is unchecked")
    async verifyCheckboxUnchecked(message = `'${this.categoryName}' checkbox should be unchecked`): Promise<void> {
        await expect(this.checkbox, message).not.toBeChecked();
    }

    @step("Verifying checkbox is disabled")
    async verifyCheckboxDisabled(message = `'${this.categoryName}' checkbox should be disabled`): Promise<void> {
        await expect(this.checkbox, message).toBeDisabled();
    }

    // Actions methods
    @step("User clicks expand section")
    async expandSection(): Promise<void> {
        await this.expandButton.click();
    }

    @step("User clicks checkbox")
    async clickCheckbox(): Promise<void> {
        await this.checkboxToggler.click();
    }
}
