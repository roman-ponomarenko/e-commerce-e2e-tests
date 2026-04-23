import {Component} from "@/app/abstract-classes";
import {step} from "@/utils/step-decorator";
import {expect} from "@playwright/test";

export class QuantityStepper extends Component {
    private decrementBtn = this.$id('qty-decrement');
    private incrementBtn = this.$id('qty-increment');
    private valueDisplay = this.$id('qty-value');

    @step("Verifying qty stepper is visible")
    async verifyLoaded(message = 'Qty stepper should be visible'): Promise<void> {
        await expect(this.decrementBtn, message).toBeVisible();
        await expect(this.valueDisplay).toBeVisible();
        await expect(this.incrementBtn).toBeVisible();
    }

    @step("Verifying decrement button is disabled")
    async verifyDecrementDisabled(message = 'Decrement button should be disabled at minimum quantity'): Promise<void> {
        await expect(this.decrementBtn, message).toBeDisabled();
    }

    @step("Verifying quantity is '{expected}'")
    async verifyQuantity(
        expected: number,
        message = `Quantity should be ${expected}`
    ): Promise<void> {
        await expect(this.valueDisplay, message).toHaveValue(String(expected));
    }

    @step("Getting quantity stepper value")
    async getValue(): Promise<number> {
        return parseInt((await this.valueDisplay.textContent()) ?? '0', 10);
    }

    // Action methods
    @step("User increments quantity")
    async increment(): Promise<void> {
        await this.incrementBtn.click();
    }

    @step("User decrements quantity")
    async decrement(): Promise<void> {
        await this.decrementBtn.click();
    }
}