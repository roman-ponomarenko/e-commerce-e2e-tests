import {Component} from "@/app/abstract-classes";
import {step} from "@/utils/step-decorator";
import {expect} from "@playwright/test";
import type {Page, Locator} from "@playwright/test";

export class OrderHistoryItem extends Component {

    constructor(page: Page, private readonly root: Locator) {
        super(page);
    }

    private get orderId() {
        return this.root.locator('div').first().locator('div').first();
    }

    private get dateMeta() {
        return this.root.locator('div').first().locator('div').last();
    }

    private get total() {
        return this.root.locator('div').last();
    }

    @step("Verifying order history item is loaded")
    async verifyLoaded(message = 'Order history item should be visible'): Promise<void> {
        await expect(this.root, message).toBeVisible();
        await expect(this.orderId).toBeVisible();
        await expect(this.total).toBeVisible();
    }

    @step("Verifying order ID is '{expected}'")
    async verifyOrderId(
        expected: string,
        message = `Order ID should be '${expected}'`
    ): Promise<void> {
        await expect(this.orderId, message).toHaveText(expected);
    }

    @step("Verifying order item count is '{expected}'")
    async verifyItemCount(
        expected: number,
        message = `Order should have ${expected} item(s)`
    ): Promise<void> {
        await expect(this.dateMeta, message).toContainText(
            expected === 1 ? '1 item' : `${expected} items`
        );
    }

    @step("Verifying order total is '{expected}'")
    async verifyTotal(
        expected: string,
        message = `Order total should be '${expected}'`
    ): Promise<void> {
        await expect(this.total, message).toHaveText(expected);
    }
}