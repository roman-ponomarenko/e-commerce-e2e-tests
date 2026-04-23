import {Component} from "@/app/abstract-classes";
import {step} from "@/utils/step-decorator";
import {expect} from "@playwright/test";
import {CartItem} from "@/app/components/cart-item.component";

export class CartDrawer extends Component {
    private root = this.page.getByRole('complementary', {name: 'Shopping cart'});
    private totalCartItems = this.root.locator("h2");
    private cartItems = this.root.locator("div[class^='_body_'] > div[data-product-id]");
    private closeBtn = this.root.getByRole('button', {name: 'Close cart'});
    private emptyMsg = this.root.getByText('Your cart is empty.');
    private viewCartBtn = this.root.getByRole('link', {name: 'View cart'});
    private checkoutBtn = this.root.getByRole('link', {name: 'Go to checkout'});
    private totalValue = this.root.getByTestId("cart-drawer-total");

    cartItem(productName: string): CartItem {
        const itemRoot = this.cartItems.filter({
            has: this.page.locator(`a[data-testid]:has-text('${productName}')`)
        }).first();
        return new CartItem(this.page, itemRoot);
    }

    // Verification methods
    @step("Verifying cart drawer is visible")
    async verifyLoaded(message = 'Cart drawer should be visible'): Promise<void> {
        await expect(this.root, message).toBeVisible();
        await expect(this.closeBtn).toBeVisible();
    }

    @step("Verifying cart drawer is hidden")
    async verifyHidden(message = 'Cart drawer should not be visible'): Promise<void> {
        await expect(this.closeBtn, message).toBeHidden();
    }

    @step("Verifying cart drawer shows empty state")
    async verifyEmpty(message = `'Your cart is empty.' message should be visible`): Promise<void> {
        await expect(this.emptyMsg, message).toBeVisible();
        await expect(this.viewCartBtn).toBeHidden();
    }

    @step("Verifying cart drawer has '{expectedAmount}' cart item(s)")
    async verifyCartItemsAmount(
        expectedAmount: number,
        message = `Cart drawer should have '${expectedAmount} cart item(s)'`
    ): Promise<void> {
        await expect(this.cartItems, message).toHaveCount(expectedAmount);
    }

    @step("Verifying cart drawer has '{expected}' items in total")
    async verifyTotalItemsAmount(
        expected: number,
        message = `Cart drawer should have '${expected}' items in total`
    ): Promise<void> {
        await expect(this.totalCartItems, message).toHaveText(`Your cart (${expected})`);
    }

    @step("Verifying cart total amount is '{expected}'")
    async verifyTotalAmount(
        expected: string,
        message = `Cart total amount should be '${expected}'`
    ): Promise<void> {
        await expect(this.totalValue, message).toHaveText(expected);
    }

    // Action methods
    @step("User closes cart drawer")
    async close(): Promise<void> {
        await this.closeBtn.click();
    }

    @step("User clicks 'View cart'")
    async clickViewCart(): Promise<void> {
        await this.viewCartBtn.click();
    }

    @step("User clicks 'Go to checkout'")
    async clickCheckout(): Promise<void> {
        await this.checkoutBtn.click();
    }
}