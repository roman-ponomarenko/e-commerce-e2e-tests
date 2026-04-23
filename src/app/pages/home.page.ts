import {AppPage} from "@/app/abstract-classes";
import {step} from "@/utils/step-decorator";
import type { Locator } from "@playwright/test";
import {expect} from "@playwright/test";
import type {CategoryValue} from "@/app/pages/product-list.page";
import {ProductCard} from "@/app/components/product-card.component";
import config from "@/config";

export type HomeCategory = Exclude<CategoryValue, { slug: 'all' }>;

export class HomePage extends AppPage {
    pagePath = config.APP_URL;

    private pageRoot = this.$id('page-home');
    private shopAllProductsButton = this.$id("hero-shop-cta");
    private freeShippingBanner = this.$id('free-shipping-banner');
    private homeCategories = this.$("[data-testid^='category-tile-']");
    private featuredGrid = this.$id('product-grid');
    private featuredProducts = this.featuredGrid.locator("[data-testid^='product-card-']");

    private category({slug, name}: HomeCategory) {
        return this.$(`[data-testid^="category-tile-${slug}"]:has-text("${name}")`)
    }

    featuredProduct(productName: string): ProductCard {
        const card: Locator = this.featuredProducts.filter({
            has: this.page.locator(`div[class^="_name_"] > a:has-text('${productName}')`)
        }).first();
        return new ProductCard(this.page, card);
    }

    @step("Verifying 'Home' page is loaded")
    async verifyLoaded(message = 'Northwind Goods homepage should be loaded'): Promise<void> {
        await this.waitForLoadState();
        await expect(this.pageRoot, message).toBeVisible();
        await expect(this.shopAllProductsButton).toBeVisible();
    }

    @step("Verifying hero section is visible")
    async verifyHeroVisible(message = 'Hero section should be visible'): Promise<void> {
        await expect(this.shopAllProductsButton, message).toBeVisible();
    }

    @step("Verifying free shipping banner is visible")
    async verifyFreeShippingBannerVisible(message = 'Free shipping banner should be visible'): Promise<void> {
        await expect(this.freeShippingBanner, message).toBeVisible();
    }

    @step("Verifying category tiles are visible")
    async verifyCategoryTilesDisplayed(categories: HomeCategory[]): Promise<void> {
        const tiles = await this.homeCategories.all();
        expect(tiles.length,
            'Number of category tiles should match expected categories'
        ).toBe(categories.length);

        for (let i = 0; i < tiles.length; i++) {
            await expect(tiles[i], `Category tile '${categories[i].name}' should be visible`).toBeVisible();
            await expect(tiles[i]).toHaveText(categories[i].name);
        }
    }

    @step("Verifying featured products grid has at least one product")
    async verifyFeaturedProductsVisible(message = 'Featured products grid should have at least one product'): Promise<void> {
        await expect(this.featuredGrid).toBeVisible();
        await expect(this.featuredProducts.first(), message).toBeVisible();
    }

    @step("Verifying featured products are displayed")
    async verifyFeaturedProductsDisplayed(products: string[]): Promise<void> {
        await expect(this.featuredProducts,
            `There should be ${products.length} featured products`
        ).toHaveCount(products.length);

        for (const product of products) {
            await this.featuredProduct(product).verifyVisible();
        }
    }

    @step("User clicks the 'Shop all products' CTA")
    async clickShopAllProducts(): Promise<void> {
        await this.shopAllProductsButton.click();
    }

    @step("User clicks category tile '{name}'")
    async clickCategory(category: HomeCategory): Promise<void> {
        await this.category(category).click();
    }
}
