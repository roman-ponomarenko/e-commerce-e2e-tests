
import {expect} from "@playwright/test";
import {SpCookieKeyPoint} from "@/app/components/sp/sp-cookie-key-point.component";
import {Component} from "@/app/abstract-classes";
import {step} from "@/utils/step-decorator";

export class SpPreferenceCenter extends Component {
    private frameLocator = "#sp-preference-center iframe[id='ifrmPrivacyBanner']";
    private frameElement = this.page.frameLocator(this.frameLocator);

    private settingsTab = this.frameElement.getByRole('tab', {name: 'Settings'});
    private dataRequestTab = this.frameElement.getByRole('tab', {name: 'Data request'});

    private cancelButton = this.frameElement.getByRole('button', {name: 'Cancel'});
    private saveButton = this.frameElement.getByRole('button', {name: 'Save'});

    advertising = new SpCookieKeyPoint(this.page, this.frameLocator, 'Advertising');
    analytics = new SpCookieKeyPoint(this.page, this.frameLocator, 'Analytics');
    essential = new SpCookieKeyPoint(this.page, this.frameLocator, 'Essential');

    // Verifications methods
    @step("Verifying Secure Privacy preference center is loaded")
    async verifyLoaded(message = 'Secure Privacy preference center should be visible'): Promise<void> {
        await expect(this.$(this.frameLocator), message).toBeVisible();
        await expect(this.saveButton).toBeVisible();
    }

    @step("Verifying Secure Privacy preference center is hidden")
    async verifyHidden(message = 'Secure Privacy preference center should be hidden'): Promise<void> {
        await expect(this.$(this.frameLocator), message).toBeHidden();
    }

    // Actions methods
    @step("User clicks 'Settings' tab")
    async clickSettingsTab(): Promise<void> {
        await this.settingsTab.click();
    }

    @step("User clicks 'Data request' tab")
    async clickDataRequestTab(): Promise<void> {
        await this.dataRequestTab.click();
    }

    @step("User clicks 'Cancel' button")
    async clickCancelButton(): Promise<void> {
        await this.cancelButton.click();
    }

    @step("User clicks 'Save' button")
    async clickSaveButton(): Promise<void> {
        await this.saveButton.click();
    }
}
