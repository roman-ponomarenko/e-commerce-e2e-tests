import {AppPage} from "@/app/abstract-classes";
import {step} from "@/utils/step-decorator";
import type { Locator } from "@playwright/test";
import {expect} from "@playwright/test";
import {ProductCard} from "@/app/components/product-card.component";
import {parsePrice} from "@/utils/price";
import config from "@/config";

export const Sorting = {
    FEATURED: {slug: 'featured', name: 'Featured'},
    PRICE_ASC: {slug: 'price-asc', name: 'Price: Low to High'},
    PRICE_DESC: {slug: 'price-desc', name: 'Price: High to Low'},
    NAME_ASC: {slug: 'name-asc', name: 'Name: A to Z'},
} as const;

export const Category = {
    ALL: {slug: 'all', name: 'All'},
    APPAREL_MENS: {slug: "apparel-mens", name: "Men's Apparel"},
    APPAREL_WOMENS: {slug: "apparel-womens", name: "Women's Apparel"},
    ACCESSORIES: {slug: "accessories", name: "Accessories"},
    HOME: {slug: "home", name: "Home & Living"},
} as const;

export type SortOption = typeof Sorting[keyof typeof Sorting];
export type CategoryValue = typeof Category[keyof typeof Category];

export class ProductListPage extends AppPage {
    pagePath = config.PRODUCTS_PAGE_PATH;

    private pageRoot = this.$id('page-product-list');
    private searchInput = this.$id('search-input');
    private sortSelect = this.$id('sort-select');
    private resultCount = this.$id('result-count');
    private productGrid = this.$id('product-grid');
    private allProducts = this.$('article[data-product-id]');

    private category(slug: string) {
        return this.$id(`category-chip-${slug}`);
    }

    product(productName: string): ProductCard {
        const card = this.allProducts.filter({
            has: this.page.locator(`div[class^="_name_"] > a:has-text('${productName}')`)
        }).first();
        return new ProductCard(this.page, card);
    }

    @step("Getting all product prices")
    async getProductPrices(): Promise<number[]> {
        const cards = await this.allProducts.all();
        const rawPrices = await Promise.all(
            cards.map((card) => new ProductCard(this.page, card).getRawPrice())
        );
        return rawPrices.map(parsePrice);
    }

    @step("Getting all product names")
    async getProductNames(): Promise<string[]> {
        const cards = await this.allProducts.all();
        return await Promise.all(
            cards.map((card) => new ProductCard(this.page, card).getProductName())
        );
    }

    // Verification methods
    @step("Verifying 'Product list' page is loaded")
    async verifyLoaded(message = "Product list page should be loaded"): Promise<void> {
        await this.waitForLoadState();
        await expect(this.pageRoot, message).toBeVisible();
        await expect(this.searchInput).toBeVisible();
        await expect(this.productGrid).toBeVisible();
    }

    @step("Verifying sort options are available")
    async verifySortOptionsAvailable(options: SortOption[]): Promise<void> {
        await expect(
            this.sortSelect.locator('option'),
            `Sort select should have exactly ${options.length} option${options.length === 1 ? '' : 's'}`
        ).toHaveCount(options.length);

        for (const {slug, name} of options) {
            await expect(
                this.sortSelect.locator(`option[value='${slug}']`),
                `Sort option '${name}' should be available`
            ).toBeAttached();
        }
    }

    @step("Verifying result count text shows '{expected}' products")
    async verifyResultCountText(
        expected: number,
        message = `Result count should show ${expected} product${expected === 1 ? '' : 's'}`
    ): Promise<void> {
        const noun = expected === 1 ? 'product' : 'products';
        await expect(this.resultCount, message).toHaveText(`${expected} ${noun}`);
    }

    @step("Verifying result count text has been changed")
    async verifyResultCountChangedText(
        oldCount: number,
    ): Promise<void> {
        const noun = oldCount === 1 ? 'product' : 'products';
        await expect(this.resultCount).not.toHaveText(`${oldCount} ${noun}`);
    }

    @step("Verifying products amount is '{expected}'")
    async verifyProductsAmount(
        expected: number,
        message = `There should be ${expected} product card${expected === 1 ? '' : 's'}`
    ): Promise<void> {
        await expect(this.allProducts, message).toHaveCount(expected);
    }

    @step("Verifying category '{name}' is selected")
    async verifyCategoryIsSelected({slug, name}: CategoryValue): Promise<void> {
        const category: Locator = this.$(`[data-testid^="category-chip-${slug}"]:has-text("${name}")`)

        await expect(category).toHaveAttribute('data-active', 'true');
        await expect(category).toHaveCSS('background-color', 'rgb(30, 41, 59)');
    }

    @step("Verifying category '{name}' is not selected")
    async verifyCategoryIsNotSelected({slug, name}: CategoryValue): Promise<void> {
        const category: Locator = this.$(`[data-testid^="category-chip-${slug}"]:has-text("${name}")`)

        await expect(category).toHaveAttribute('data-active', 'false');
        await expect(category).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    }

    @step("Verifying products are displayed")
    async verifyProductsDisplayed(products: string[]): Promise<void> {
        await expect(this.allProducts).toHaveCount(products.length);

        for (const product of products) {
            await this.product(product).verifyVisible();
        }
    }

    @step("Verifying products are sorted by '{name}'")
    async verifySortOrder({slug}: SortOption): Promise<void> {
        const prices = await this.getProductPrices();
        expect(prices.length, 'There should be at least one product to verify sort').toBeGreaterThan(0);

        switch (slug) {
            case 'price-asc': {
                const sorted = [...prices].sort((a, b) => a - b);
                expect(prices, 'Prices should be in ascending order').toEqual(sorted);
                break;
            }
            case 'price-desc': {
                const sorted = [...prices].sort((a, b) => b - a);
                expect(prices, 'Prices should be in descending order').toEqual(sorted);
                break;
            }
            case 'name-asc': {
                const names = await this.getProductNames();
                const sorted = [...names].sort((a, b) => a.localeCompare(b));
                expect(names, 'Names should be in ascending alphabetical order').toEqual(sorted);
                break;
            }
            case 'featured':
                break;
        }
    }

    // Action methods
    @step("User selects category '{slug}'")
    async selectCategory({slug}: CategoryValue): Promise<void> {
        await this.category(slug).click();
    }

    @step("User selects sort '{slug}'")
    async selectSort({slug}: SortOption): Promise<void> {
        await this.sortSelect.selectOption(slug);
    }

    @step("User searches for '{query}'")
    async search(query: string): Promise<void> {
        await this.searchInput.pressSequentially(query, {delay: 500});
    }

    @step("User clears the search field")
    async clearSearch(): Promise<void> {
        await this.searchInput.fill('');
    }
}
