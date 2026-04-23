import {expect} from "@playwright/test";
import {Component} from "@/app/abstract-classes";
import {step} from "@/utils/step-decorator";

export class SpTrustBadge extends Component {
    private frameLocator = "iframe[id='ifrmTrustBadge']";
    private frameElement = this.page.frameLocator(this.frameLocator);
    private trustBadgeLink = this.frameElement.locator('#sp-trust-badge');

    // Verifications methods
    @step("Verifying Secure Privacy trust badge is visible")
    async verifyLoaded(message = 'Secure Privacy trust badge should be visible'): Promise<void> {
        await expect(this.$(this.frameLocator), message).toBeVisible();
        await expect(this.trustBadgeLink).toBeVisible();
    }

    @step("Verifying Secure Privacy trust badge is hidden")
    async verifyHidden(message = 'Secure Privacy trust badge should be hidden'): Promise<void> {
        await expect(this.trustBadgeLink, message).toBeHidden();
    }

    // Actions methods
    @step("User clicks Secure Privacy trust badge")
    async clickTrustBadge(): Promise<void> {
        await this.trustBadgeLink.click();
    }
}
