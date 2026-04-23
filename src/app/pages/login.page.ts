import {AppPage} from "@/app/abstract-classes";
import {step} from "@/utils/step-decorator";
import {expect} from "@playwright/test";
import config from "@/config";

export class LoginPage extends AppPage {
    pagePath = config.LOGIN_PAGE_PATH;

    private usernameInput = this.$id('login-email');
    private passwordInput = this.$id('login-password');
    private submitButton = this.$id('login-submit');
    private errorMessage = this.$id('login-error');
    private createAccountLink = this.$id('login-link-register');

    @step("Verifying 'Login' page is loaded")
    async verifyLoaded(message = 'Login page should be loaded'): Promise<void> {
        await this.waitForLoadState();
        await expect(this.usernameInput, message).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.submitButton).toBeVisible();
    }

    @step("Verifying login error message is visible")
    async verifyLoginErrorVisible(
        errorMsg = "Invalid email or password",
        message = `${errorMsg} error message should be visible`
    ): Promise<void> {
        await expect(this.errorMessage, message).toBeVisible();
        await expect(this.errorMessage, message).toHaveText(errorMsg);
    }

    @step("User fills username '{username}'")
    async fillUsername(username: string): Promise<void> {
        await this.usernameInput.fill(username);
    }

    @step("User fills password")
    async fillPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    @step("User clicks 'Submit' button")
    async clickSubmitButton(): Promise<void> {
        await this.submitButton.click();
    }

    @step("User clicks 'Create an account' link")
    async clickCreateAccountLink(): Promise<void> {
        await this.createAccountLink.click();
    }

    @step("User logs in as '{username}'")
    async login(username: string, password: string): Promise<void> {
        await this.open();
        await this.verifyLoaded();
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickSubmitButton();
    }
}