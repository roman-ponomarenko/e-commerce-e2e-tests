import {AppPage} from "@/app/abstract-classes";
import {step} from "@/utils/step-decorator";
import {expect} from "@playwright/test";
import config from "@/config";

interface CreateAccountData {
    fullName: string;
    email: string;
    password: string;
}

export class CreateAccountPage extends AppPage {
    pagePath = config.REGISTER_PAGE_PATH;

    private pageRoot = this.$id('page-register');
    private fullNameInput = this.$id('register-name');
    private emailInput = this.$id('register-email');
    private passwordInput = this.$id('register-password');
    private confirmPasswordInput = this.$id('register-confirm');
    private createAccountButton = this.$id('register-submit');
    private errorMessage = this.$("[data-testid='register-confirm-error'], [data-testid='register-error']");
    private signInLink = this.$id('register-link-login');

    @step("Verifying 'Create Account' page is loaded")
    async verifyLoaded(message = 'Create Account page should be loaded'): Promise<void> {
        await this.waitForLoadState();
        await expect(this.pageRoot, message).toBeVisible();
        await expect(this.emailInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.createAccountButton).toBeVisible();
    }

    @step("Verifying registration error message is visible")
    async verifyErrorVisible(
        errorMsg: string,
        message = `${errorMsg} error message should be visible`
    ): Promise<void> {
        await expect(this.errorMessage, message).toBeVisible();
        await expect(this.errorMessage, message).toHaveText(errorMsg);
    }

    @step("User fills full name '{fullName}'")
    async fillFullName(fullName: string): Promise<void> {
        await this.fullNameInput.fill(fullName);
    }

    @step("User fills email '{email}'")
    async fillEmail(email: string): Promise<void> {
        await this.emailInput.fill(email);
    }

    @step("User fills password")
    async fillPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    @step("User fills confirm password")
    async fillConfirmPassword(password: string): Promise<void> {
        await this.confirmPasswordInput.fill(password);
    }

    @step("User clicks 'Submit' button")
    async clickSubmitButton(): Promise<void> {
        await this.createAccountButton.click();
    }

    @step("User clicks 'Sign in' link")
    async clickSignInLink(): Promise<void> {
        await this.signInLink.click();
    }

    @step("User creates account as '{data.email}'")
    async createAccount(data: CreateAccountData): Promise<void> {
        await this.open();
        await this.verifyLoaded();
        await this.fillFullName(data.fullName);
        await this.fillEmail(data.email);
        await this.fillPassword(data.password);
        await this.fillConfirmPassword(data.password);
        await this.clickSubmitButton();
    }
}