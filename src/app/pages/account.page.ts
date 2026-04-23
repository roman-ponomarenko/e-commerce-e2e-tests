import {AppPage} from "@/app/abstract-classes";
import {step} from "@/utils/step-decorator";
import {expect} from "@playwright/test";
import {OrderHistoryItem} from "@/app/components/order-history-item.component";
import config from "@/config";

export class AccountPage extends AppPage {
    pagePath = config.ACCOUNT_PAGE_PATH;

    private pageRoot = this.$id('page-account');
    private accountName = this.$id('account-name');
    private accountEmail = this.$id('account-email');
    private logoutButton = this.$id('account-logout');
    private orderHistorySection = this.$id('order-history');
    private allOrderRows = this.$("[data-testid^='order-row-']");

    order(orderId: string): OrderHistoryItem {
        return new OrderHistoryItem(this.page, this.$id(`order-row-${orderId}`));
    }

    @step("Verifying 'My account' page is loaded")
    async verifyLoaded(message = 'My account page should be loaded'): Promise<void> {
        await this.waitForLoadState();
        await expect(this.pageRoot, message).toBeVisible();
        await expect(this.logoutButton).toBeVisible();
    }

    @step("Verifying profile name is '{name}'")
    async verifyProfileName(name: string, message = `Profile name should be '${name}'`): Promise<void> {
        await expect(this.accountName, message).toHaveText(name);
    }

    @step("Verifying profile email is '{email}'")
    async verifyProfileEmail(email: string, message = `Profile email should be '${email}'`): Promise<void> {
        await expect(this.accountEmail, message).toHaveText(email);
    }

    @step("Verifying order history has '{count}' order(s)")
    async verifyOrderCount(count: number, message = `Order history should have ${count} order(s)`): Promise<void> {
        await expect(this.orderHistorySection).toBeVisible();
        await expect(this.allOrderRows, message).toHaveCount(count);
    }

    @step("User clicks 'Log out' button")
    async clickLogoutButton(): Promise<void> {
        await this.logoutButton.click();
    }
}