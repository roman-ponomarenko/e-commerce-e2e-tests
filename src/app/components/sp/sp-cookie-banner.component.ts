import {expect} from "@playwright/test";
import {Component} from "@/app/abstract-classes";
import {step} from "@/utils/step-decorator";

export class SpCookieBanner extends Component {
    private frameLocator = "#main-cookie-banner iframe[id='ifrmCookieBanner']";
    private frameElement = this.page.frameLocator(this.frameLocator);
    private acceptAllButton = this.frameElement.getByRole('button', {name: 'Accept all'});
    private declineButton = this.frameElement.getByRole('button', {name: 'Decline'});
    private saveButton = this.frameElement.getByRole('button', {name: 'Save'});
    private customizeButton = this.frameElement.getByRole('button', {name: 'Customize'});
    private personalSettingsLink = this.frameElement.getByRole('link', {name: 'personal settings'});
    private privacyPolicyLink = this.frameElement.getByRole('link', {name: 'Privacy Policy'});

    // Verifications methods
    @step("Verifying Secure Privacy cookie banner is loaded")
    async verifyLoaded(message = 'Secure Privacy cookie banner should be visible'): Promise<void> {
        await expect(this.$(this.frameLocator), message).toBeVisible();
        await expect(this.acceptAllButton).toBeVisible();
    }

    @step("Verifying Secure Privacy cookie banner is hidden")
    async verifyHidden(message = 'Secure Privacy cookie banner should be hidden'): Promise<void> {
        await expect(this.$(this.frameLocator), message).toBeHidden();
    }

    @step("Verifying 'Accept all' button is visible")
    async verifyAcceptAllButtonVisible(message = "'Accept all' button should be visible"): Promise<void> {
        await expect(this.acceptAllButton, message).toBeVisible();
    }

    @step("Verifying 'Save' button is visible")
    async verifySaveButtonVisible(message = "'Save' button should be visible"): Promise<void> {
        await expect(this.saveButton, message).toBeVisible();
    }

    @step("Verifying 'Save' button is not visible")
    async verifySaveButtonIsNotVisible(message = "'Save' button should not be visible"): Promise<void> {
        await expect(this.saveButton, message).toBeHidden();
    }

    @step("Verifying 'Decline' button is visible")
    async verifyDeclineButtonVisible(message = "'Decline' button should be visible"): Promise<void> {
        await expect(this.declineButton, message).toBeVisible();
    }

    @step("Verifying 'Customize' button is visible")
    async verifyCustomizeButtonVisible(message = "'Customize' button should be visible"): Promise<void> {
        await expect(this.customizeButton, message).toBeVisible();
    }

    @step("Verifying 'personal settings' link is visible")
    async verifyPersonalSettingsLinkVisible(message = "'personal settings' link should be visible"): Promise<void> {
        await expect(this.personalSettingsLink, message).toBeVisible();
    }

    @step("Verifying 'Privacy Policy' link is visible")
    async verifyPrivacyPolicyLinkVisible(message = "'Privacy Policy' link should be visible"): Promise<void> {
        await expect(this.privacyPolicyLink, message).toBeVisible();
    }

    // Actions methods
    @step("User clicks 'Accepts all' button")
    async clickAcceptAllButton(): Promise<void> {
        await this.acceptAllButton.click();
    }

    @step("User clicks 'Decline' button")
    async clickDeclineButton(): Promise<void> {
        await this.declineButton.click();
    }

    @step("User clicks 'Customize' button")
    async clickCustomizeButton(): Promise<void> {
        await this.customizeButton.click();
    }

    @step("User clicks 'personal settings' link")
    async clickPersonalSettingsLink(): Promise<void> {
        await this.personalSettingsLink.click();
    }

    @step("User clicks 'Privacy Policy' link")
    async clickPrivacyPolicyLink(): Promise<void> {
        await this.privacyPolicyLink.click();
    }
}
