import {Component} from "@/app/abstract-classes";
import {step} from "@/utils/step-decorator";
import type {Page, Locator} from "@playwright/test";
import {expect} from "@playwright/test";

export type StockStatus = 'In stock' | 'Out of stock';

export class ProductCard extends Component {

    constructor(page: Page, private readonly root: Locator) {
        super(page);
    }

    private get image() {
        return this.root.locator("[class^='_imageWrap_'] > img");
    }

    private get name() {
        return this.root.locator("div[class^='_name_'] > a");
    }

    private get stockBadge() {
        return this.root.getByTestId("stock-badge");
    }

    private get priceText() {
        return this.root.locator("[class^='_price_']");
    }

    private get chooseOptionsButton() {
        return this.root.locator("a[class^='_addBtn_']");
    }

    private get addToCartButton() {
        return this.root.locator("button[class^='_addBtn_']");
    }

    @step("Getting product card name")
    async getProductName(): Promise<string> {
        return await this.name.textContent() ?? '';
    }

    @step("Getting product card stock status")
    async getStockStatus(): Promise<StockStatus> {
        return await this.stockBadge.textContent() as StockStatus;
    }

    @step("Getting product card raw price")
    async getRawPrice(): Promise<string> {
        return await this.priceText.textContent() as string;
    }

    // Verification methods
    @step("Verifying product card is loaded")
    async verifyLoaded(message = 'Product card should be visible'): Promise<void> {
        await expect(this.root, message).toBeVisible();
    }

    @step("Verifying product card is visible")
    async verifyVisible(message = 'Product card should be visible'): Promise<void> {
        await expect(this.root, message).toBeVisible();
        await expect(this.image).toBeVisible();
        const isLoaded = await this.image.evaluate((node: HTMLImageElement) => {
            return node.complete && node.naturalWidth > 0;
        });
        expect(isLoaded).toBeTruthy();
    }

    @step("Verifying product card is hidden")
    async verifyHidden(message = 'Product card should be hidden'): Promise<void> {
        await expect(this.root, message).toBeHidden();
    }

    @step("Verifying product stock status is '{expected}'")
    async verifyStockStatus(
        expected: StockStatus,
        message = `Stock status should be '${expected}'`
    ): Promise<void> {
        await expect(this.stockBadge, message).toHaveText(expected);
    }

    // Action methods
    @step("User clicks product card")
    async click(): Promise<void> {
        await this.name.click();
    }

    @step("User clicks 'Add to cart' on product card")
    async addToCart(): Promise<void> {
        await this.addToCartButton.click();
    }

    @step("User clicks 'Choose options' on product card")
    async clickChooseOptionsButton(): Promise<void> {
        await this.chooseOptionsButton.click();
    }
}
