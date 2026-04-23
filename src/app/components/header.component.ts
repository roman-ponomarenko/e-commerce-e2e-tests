import {Component} from "@/app/abstract-classes";
import {step} from "@/utils/step-decorator";
import {expect} from "@playwright/test";

export class Header extends Component {
    private root = this.page.locator('header');
    private logo = this.root.getByTestId('logo');
    private navHome = this.root.getByTestId('nav-home');
    private navProducts = this.root.getByTestId('nav-products');
    private accountMenuButton = this.root.getByTestId('account-menu');
    private accountMenuLogin = this.root.getByTestId('account-menu-login');
    private accountMenuRegister = this.root.getByTestId('account-menu-register');
    private accountLogout = this.root.getByTestId('account-menu-logout');
    private accountName = this.root.locator("[data-testid='account-menu'] span").last();
    private cartButton = this.root.getByTestId('cart-button');

    @step("Verifying header is loaded")
    async verifyLoaded(message = 'Header should be visible'): Promise<void> {
        await expect(this.root, message).toBeVisible();
        await expect(this.logo).toBeVisible();
        await expect(this.logo).toHaveText('Northwind Goods');
        await expect(this.navHome).toBeVisible();
        await expect(this.navProducts).toBeVisible();
        await expect(this.cartButton).toBeVisible();
    }

    @step("Verifying cart count is '{expected}'")
    async verifyCartCount(
        expected: number,
        message = `Cart should show ${expected} item${expected === 1 ? '' : 's'}`
    ): Promise<void> {
        await expect(this.cartButton, message).toHaveAccessibleName(`Cart with ${expected} items`);
    }

    @step("Verifying account name is '{expected}'")
    async verifyAccountName(expected: string,
                            message = `Account name should be '${expected}'`): Promise<void> {
        await expect(this.accountName, message).toHaveText(expected);
    }

    // Action methods
    @step("User clicks the logo")
    async clickLogo(): Promise<void> {
        await this.logo.click();
    }

    @step("User clicks account logout in header menu")
    async clickAccountLogout(): Promise<void> {
        await this.accountLogout.click();
    }

    @step("User clicks 'Home' link")
    async clickHome(): Promise<void> {
        await this.navHome.click();
    }

    @step("User clicks 'Shop' link")
    async clickProducts(): Promise<void> {
        await this.navProducts.click();
    }

    @step("User opens account menu")
    async clickAccountMenu(): Promise<void> {
        await this.accountMenuButton.click();
    }

    @step("User clicks 'Sign in' link")
    async clickSignIn(): Promise<void> {
        await this.accountMenuLogin.click();
    }

    @step("User clicks 'Create account' link")
    async clickCreateAccount(): Promise<void> {
        await this.accountMenuRegister.click();
    }

    @step("User clicks cart button")
    async clickCart(): Promise<void> {
        await this.cartButton.click();
    }
}