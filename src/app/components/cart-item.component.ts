import {Component} from "@/app/abstract-classes";
import {step} from "@/utils/step-decorator";
import {expect} from "@playwright/test";
import type {Page, Locator} from "@playwright/test";

export class CartItem extends Component {

    constructor(page: Page, private readonly root: Locator) {
        super(page);
    }

    private get nameLink() {
        return this.root.getByRole('link').last();
    }

    private get sizeText() {
        return this.root.getByText(/^Size:/);
    }

    private get decrementBtn() {
        return this.root.getByRole('button', {name: 'Decrease quantity'});
    }

    private get incrementBtn() {
        return this.root.getByRole('button', {name: 'Increase quantity'});
    }

    private get quantityInput() {
        return this.root.getByRole('textbox', {name: 'Quantity'});
    }

    private get removeBtn() {
        return this.root.getByRole('button', {name: 'Remove'});
    }

    private get linePrice() {
        return this.root.locator("span[data-testid^='cart-line-total']");
    }

    @step("Getting cart item name")
    async getName(): Promise<string> {
        return (await this.nameLink.textContent()) ?? '';
    }

    @step("Getting cart item quantity")
    async getQuantity(): Promise<number> {
        return parseInt(await this.quantityInput.inputValue(), 10);
    }

    @step("Getting cart item line price")
    async getLinePrice(): Promise<string> {
        return (await this.linePrice.textContent()) ?? '';
    }

    // Verification methods
    @step("Verifying cart item is loaded")
    async verifyLoaded(message = 'Cart item should be visible'): Promise<void> {
        await expect(this.root, message).toBeVisible();
        await expect(this.nameLink).toBeVisible();
        await expect(this.removeBtn).toBeVisible();
    }

    @step("Verifying item name is '{expected}'")
    async verifyName(
        expected: string,
        message = `Item name should be '${expected}'`
    ): Promise<void> {
        await expect(this.nameLink, message).toHaveText(expected);
    }

    @step("Verifying item size is '{expected}'")
    async verifySize(
        expected: string,
        message = `Item size should be 'Size: ${expected}'`
    ): Promise<void> {
        await expect(this.sizeText, message).toHaveText(`Size: ${expected}`);
    }

    @step("Verifying item quantity is '{expected}'")
    async verifyQuantity(
        expected: number,
        message = `Quantity should be ${expected}`
    ): Promise<void> {
        await expect(this.quantityInput, message).toHaveValue(String(expected));
    }

    @step("Verifying item price is '{expected}'")
    async verifyPrice(
        expected: string,
        message = `Price should be '${expected}'`
    ): Promise<void> {
        await expect(this.linePrice, message).toHaveText(expected);
    }

    // Action methods
    @step("User increments item quantity")
    async increment(): Promise<void> {
        await this.incrementBtn.click();
    }

    @step("User decrements item quantity")
    async decrement(): Promise<void> {
        await this.decrementBtn.click();
    }

    @step("User removes item from cart")
    async remove(): Promise<void> {
        await this.removeBtn.click();
    }

    @step("User clicks item name link")
    async clickName(): Promise<void> {
        await this.nameLink.click();
    }
}