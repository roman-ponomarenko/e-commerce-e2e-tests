import {AppPage} from "@/app/abstract-classes";
import {step} from "@/utils/step-decorator";
import {expect} from "@playwright/test";
import config from "@/config";

export class ConfirmationPage extends AppPage {
    pagePath = config.CONFIRMATION_PAGE_PATH;

    private pageRoot = this.$id('page-confirmation');
    private thankYouHeading = this.pageRoot.locator('h1:has-text("Order placed — thank you!")');
    private orderNumber = this.$id('confirmation-order-id');
    private totalPaid = this.$id('confirmation-total');
    private continueShoppingBtn = this.$("a[href='/products'] > button.btn-primary");
    private viewAccountBtn = this.$("a[href='/account'] > button.btn-secondary");

    @step("Verifying 'Confirmation' page is loaded")
    async verifyLoaded(message = 'Order confirmation page should be loaded'): Promise<void> {
        await this.waitForLoadState();
        await expect(this.pageRoot, message).toBeVisible();
        await expect(this.thankYouHeading).toBeVisible();
    }

    @step("Verifying order number is visible")
    async verifyOrderNumberVisible(message = 'Order number should be visible'): Promise<void> {
        await expect(this.orderNumber, message).toBeVisible();
    }

    @step("Verifying total paid amount is visible")
    async verifyTotalPaid(amount: string,
                          message = 'Total paid amount should be visible'): Promise<void> {
        await expect(this.totalPaid, message).toHaveText(amount);
    }

    @step("Getting order number")
    async getOrderNumber(): Promise<string> {
        return (await this.orderNumber.textContent()) as string;
    }

    @step("User clicks 'Continue shopping' button")
    async clickContinueShoppingButton(): Promise<void> {
        await this.continueShoppingBtn.click();
    }

    @step("User clicks 'View account' button")
    async clickViewAccountButton(): Promise<void> {
        await this.viewAccountBtn.click();
    }
}