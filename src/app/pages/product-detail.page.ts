import {AppPage} from "@/app/abstract-classes";
import {step} from "@/utils/step-decorator";
import type { Locator } from "@playwright/test";
import {expect} from "@playwright/test";
import {ProductCard} from "@/app/components/product-card.component";
import type {StockStatus} from "@/app/components/product-card.component";
import {QuantityStepper} from "@/app/components/qty-stepper.component";
import type { CategoryValue} from "@/app/pages/product-list.page";
import {Category} from "@/app/pages/product-list.page";

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL';

export class ProductDetailPage extends AppPage {
    pagePath = '/products';

    private pageRoot = this.$id('page-product-detail');
    private breadcrumb = this.page.getByRole('navigation', {name: 'Breadcrumb'});
    private breadcrumbLinks = this.breadcrumb.locator('a');
    private productName = this.$id('product-name');
    private productPrice = this.$id('product-price');
    private stockBadge = this.$("//nav[@aria-label='Breadcrumb']/following-sibling::div//*[@data-testid='stock-badge']");
    private description = this.$id('product-description');
    private sizeSelector = this.$id('size-selector');
    private addToCartBtn = this.$id('add-to-cart');
    private relatedProducts = this.$("[data-testid='product-grid'] article[data-product-id]");

    quantity = new QuantityStepper(this.page);

    private sizeOption(size: Size): Locator {
        return this.$id(`size-option-${size}`);
    }

    relatedProduct(productName: string): ProductCard {
        const card = this.relatedProducts.filter({hasText: productName}).first();
        return new ProductCard(this.page, card);
    }

    @step("Getting product name")
    async getProductName(): Promise<string> {
        return (await this.productName.textContent()) ?? '';
    }

    @step("Getting product price")
    async getProductPrice(): Promise<string> {
        return (await this.productPrice.textContent()) ?? '';
    }

    @step("Getting product category from breadcrumb")
    async getProductCategory(): Promise<CategoryValue> {
        const items = await this.breadcrumbLinks.all();
        const element = items.at(-1);

        if (!element) throw new Error('No breadcrumb link found');

        const categoryName = await element.textContent() as string;
        const categories = Object.values(Category) as CategoryValue[];
        return categories.find(category => category.name === categoryName) as CategoryValue;
    }

    @step("Getting related product names")
    async getRelatedProductNames(): Promise<string[]> {
        const cards = await this.relatedProducts.all();
        return await Promise.all(
            cards.map((card) => new ProductCard(this.page, card).getProductName())
        );
    }

    // Verification methods
    @step("Verifying 'Product Detail' page is loaded")
    async verifyLoaded(message = 'Product detail page should be loaded'): Promise<void> {
        await this.waitForLoadState();
        await expect(this.pageRoot, message).toBeVisible();
        await expect(this.productName).toBeVisible();
        await expect(this.productPrice).toBeVisible();
        await expect(this.addToCartBtn).toBeVisible();
    }

    @step("Verifying product name is '{expected}'")
    async verifyProductName(
        expected: string,
        message = `Product name should be '${expected}'`
    ): Promise<void> {
        await expect(this.productName, message).toHaveText(expected);
    }

    @step("Verifying product price is '{expected}'")
    async verifyProductPrice(
        expected: string,
        message = `Product price should be '${expected}'`
    ): Promise<void> {
        await expect(this.productPrice, message).toHaveText(expected);
    }

    @step("Verifying stock status is '{expected}'")
    async verifyStockStatus(
        expected: StockStatus,
        message = `Stock status should be '${expected}'`
    ): Promise<void> {
        await expect(this.stockBadge, message).toHaveText(expected);
    }

    @step("Verifying description is visible")
    async verifyDescriptionVisible(message = 'Product description should be visible'): Promise<void> {
        await expect(this.description, message).toBeVisible();
    }

    @step("Verifying size selector is visible")
    async verifySizeSelectorVisible(message = 'Size selector should be visible'): Promise<void> {
        await expect(this.sizeSelector, message).toBeVisible();
    }

    @step("Verifying size '{size}' is selected")
    async verifySizeSelected(
        size: Size,
        message = `Size '${size}' should be selected`
    ): Promise<void> {
        await expect(this.sizeOption(size), message).toHaveAttribute('data-selected', 'true');
    }

    @step("Verifying size '{size}' is not selected")
    async verifySizeNotSelected(
        size: Size,
        message = `Size '${size}' should not be selected`
    ): Promise<void> {
        await expect(this.sizeOption(size), message).toHaveAttribute('data-selected', 'false');
    }

    // Action methods
    @step("User selects size '{size}'")
    async selectSize(size: Size): Promise<void> {
        await this.sizeOption(size).click();
    }

    @step("User clicks 'Add to cart'")
    async addToCart(): Promise<void> {
        await this.addToCartBtn.click();
    }

    @step("User clicks product category breadcrumb link")
    async clickProductCategoryInBreadcrumb(): Promise<void> {
        const items = await this.breadcrumbLinks.all();
        const element = items.at(-1);
        if (!element) throw new Error('No breadcrumb link found');
        await element.click();
    }

    @step("User clicks {page} breadcrumb link")
    async clickBreadcrumbPage(page: "Home" | "Shop"): Promise<void> {
        await this.breadcrumbLinks.filter({hasText: page}).click();
    }
}