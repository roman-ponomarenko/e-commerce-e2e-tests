import {Component} from "@/app/abstract-classes";
import {step} from "@/utils/step-decorator";
import {expect} from "@playwright/test";

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export class Toast extends Component {
    private toastElement = this.$id('toast');
    private toastMessage = this.toastElement.locator('span');
    private dismissButton = this.toastElement.getByRole('button', {name: 'Dismiss'});

    @step("Verifying toast is visible")
    async verifyLoaded(variant: ToastVariant = 'success',
        message = `Toast (${variant}) notification should be visible`): Promise<void> {
        await expect(this.toastElement, message).toBeVisible();
        await expect(this.toastElement, message).toHaveAttribute('data-variant', variant);
    }

    @step("Verifying toast is hidden")
    async verifyHidden(message = 'Toast notification should not be visible'): Promise<void> {
        await expect(this.toastElement, message).toBeHidden();
    }

    @step("Verifying toast message is '{expected}'")
    async verifyMessage(
        expected: string,
        message = `Toast message should be '${expected}'`
    ): Promise<void> {
        await expect(this.toastMessage, message).toHaveText(expected);
    }

    @step("User dismisses the toast")
    async dismiss(): Promise<void> {
        await this.dismissButton.click();
    }
}