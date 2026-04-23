import {Component} from "@/app/abstract-classes";
import {step} from "@/utils/step-decorator";
import {expect} from "@playwright/test";

export class OrderSummary extends Component {
    private root = this.page.getByTestId('order-summary');
    private subtotal = this.root.locator("[data-testid='summary-subtotal'] span").last();
    private discount = this.root.locator("[data-testid='summary-discount'] span").last();
    private shipping = this.root.locator("[data-testid='summary-shipping'] span").last();
    private total = this.root.getByTestId("cart-total");

    @step("Verifying order summary is visible")
    async verifyLoaded(message = 'Order summary should be visible'): Promise<void> {
        await expect(this.root, message).toBeVisible();
    }

    @step("Verifying order subtotal is '{expected}'")
    async verifySubtotal(
        expected: string,
        message = `Order total should be '${expected}'`
    ): Promise<void> {
        await expect(this.subtotal, message).toHaveText(expected);
    }

    @step("Verifying order discount is '{expected}'")
    async verifyDiscount(
        expected: string,
        message = `Discount should be '${expected}'`
    ): Promise<void> {
        await expect(this.discount, message).toHaveText(expected);
    }

    @step("Verifying order shipping cost is '{expected}'")
    async verifyShipping(
        expected: string,
        message = `Shipping should be '${expected}'`
    ): Promise<void> {
        await expect(this.shipping, message).toHaveText(expected);
    }

    @step("Verifying order total is '{expected}'")
    async verifyTotal(
        expected: string,
        message = `Order total should be '${expected}'`
    ): Promise<void> {
        await expect(this.total, message).toHaveText(expected);
    }
}