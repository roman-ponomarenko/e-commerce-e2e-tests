import {AppPage} from "@/app/abstract-classes";
import {step} from "@/utils/step-decorator";
import type { Locator} from "@playwright/test";
import {expect} from "@playwright/test";
import {CartItem} from "@/app/components/cart-item.component";
import {OrderSummary} from "@/app/components/order-summary.component";
import config from "@/config";

export class CartPage extends AppPage {
    pagePath = config.CART_PAGE_PATH;

    private heading = this.page.getByRole('heading', {name: 'Your cart', level: 1});
    private cartList = this.page.getByRole('main').getByRole('list').first();
    private allCartItems = this.cartList.getByRole('listitem');
    private promoInput = this.page.getByRole('textbox', {name: 'Promo code'});
    private promoApplyBtn = this.page.getByRole('button', {name: 'Apply'});
    private promoAppliedBadge = this.page.getByTestId('promo-applied');
    private checkoutBtn = this.page.getByRole('button', {name: 'Proceed to checkout'});

    orderSummary = new OrderSummary(this.page);


    cardItem(productName: string): CartItem {
        const root: Locator = this.allCartItems.filter({
            has: this.page.getByRole('link', {name: productName})
        }).first();
        return new CartItem(this.page, root);
    }

    @step("Getting cart items count")
    async getItemsCount(): Promise<number> {
        return this.allCartItems.count();
    }

    // Verification methods
    @step("Verifying 'Cart' page is loaded")
    async verifyLoaded(message = 'Cart page should be loaded'): Promise<void> {
        await this.waitForLoadState();
        await expect(this.heading, message).toBeVisible();
        await expect(this.checkoutBtn).toBeVisible();
    }

    @step("Verifying cart has '{expected}' item(s)")
    async verifyItemCount(
        expected: number,
        message = `Cart should have ${expected} item(s)`
    ): Promise<void> {
        await expect(this.allCartItems, message).toHaveCount(expected);
    }

    @step("Verifying promo code '{code}' is applied")
    async verifyPromoApplied(
        code: string,
        message = `Promo code '${code}' should be applied`
    ): Promise<void> {
        await expect(this.promoAppliedBadge, message).toContainText(`${code} applied`);
    }

    @step("Verifying promo error '{expected}' is visible")
    async verifyPromoError(
        expected: string,
        message = `Promo error should say '${expected}'`
    ): Promise<void> {
        await expect(this.page.getByText(expected), message).toBeVisible();
    }

    // Action methods
    @step("User applies promo code '{code}'")
    async applyPromoCode(code: string): Promise<void> {
        await this.promoInput.fill(code);
        await this.promoApplyBtn.click();
    }

    @step("User clicks 'Proceed to checkout'")
    async proceedToCheckout(): Promise<void> {
        await this.checkoutBtn.click();
    }
}