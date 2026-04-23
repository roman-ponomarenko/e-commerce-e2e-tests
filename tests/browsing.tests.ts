import {faker} from '@faker-js/faker';

import {test} from "@/app/app.fixture";
import {Category, Sorting} from "@/app/pages/product-list.page";
import type {HomeCategory} from "@/app/pages/home.page";
import {expect} from "@playwright/test";


test.describe('Browsing tests', () => {
    const allProducts = [
        'Classic White Tee', 'Selvedge Denim Jeans',
        'Classic White Tee', 'Cashmere Cardigan',
        'Heavy Canvas Tote Bag', 'Ceramic Dinner Set (4pc)',
        'Navy Oxford Shirt', 'Merino Wool Sweater',
        'Striped Breton Top', 'High-Rise Tailored Trousers',
        'Leather Card Holder', 'Wool Felt Fedora',
        'Silk Twill Scarf', 'Enamel Pour-Over Kettle',
        'Linen Throw Blanket', 'Hand-Poured Beeswax Candle'
    ];

    const featuredProducts = [
        'Classic White Tee', 'Selvedge Denim Jeans', 'Classic White Tee',
        'Cashmere Cardigan', 'Heavy Canvas Tote Bag', 'Ceramic Dinner Set (4pc)'
    ];

    const mensProducts = [
        'Classic White Tee', 'Selvedge Denim Jeans',
        'Navy Oxford Shirt', 'Merino Wool Sweater'
    ];

    const womenProducts = [
        'Classic White Tee', 'Cashmere Cardigan',
        'Striped Breton Top', 'High-Rise Tailored Trousers'
    ];

    const accessoriesProducts = [
        'Heavy Canvas Tote Bag', 'Leather Card Holder',
        'Wool Felt Fedora', 'Silk Twill Scarf'
    ];

    const homeProducts = [
        'Ceramic Dinner Set (4pc)', 'Enamel Pour-Over Kettle',
        'Linen Throw Blanket', 'Hand-Poured Beeswax Candle'
    ];


    test('Homepage navigation should load the product list and support category tile and breadcrumb navigation',
        {tag: '@browsing'}, async ({app}) => {
            const categories: HomeCategory[] = [
                Category.APPAREL_MENS, Category.APPAREL_WOMENS,
                Category.ACCESSORIES, Category.HOME
            ];

            await app.homePage.open();

            await app.spCookieBanner.verifyLoaded();
            await app.spCookieBanner.clickDeclineButton();
            await app.spCookieBanner.verifyHidden();

            await app.homePage.verifyLoaded();
            await app.homePage.verifyHeroVisible();
            await app.homePage.verifyFreeShippingBannerVisible();
            await app.homePage.verifyCategoryTilesDisplayed(categories);
            await app.homePage.verifyFeaturedProductsDisplayed(featuredProducts);

            await app.homePage.clickShopAllProducts();

            await app.productListPage.verifyLoaded();
            await app.productListPage.verifyCategoryIsSelected(Category.ALL);
            await app.productListPage.verifyResultCountText(allProducts.length);
            await app.productListPage.verifyProductsAmount(allProducts.length);
            await app.productListPage.verifyProductsDisplayed(allProducts);

            await app.header.clickHome();

            await app.homePage.verifyLoaded();
            await app.homePage.verifyHeroVisible();
            await app.homePage.verifyFreeShippingBannerVisible();
            await app.homePage.verifyCategoryTilesDisplayed(categories);
            await app.homePage.verifyFeaturedProductsDisplayed(featuredProducts);

            await app.homePage.clickCategory(Category.APPAREL_MENS);

            await app.productListPage.verifyLoaded();
            await app.productListPage.verifyCategoryIsSelected(Category.APPAREL_MENS);
            await app.productListPage.verifyResultCountText(mensProducts.length);
            await app.productListPage.verifyProductsAmount(mensProducts.length);
            await app.productListPage.verifyProductsDisplayed(mensProducts);

            await app.productListPage.goBack();

            await app.homePage.verifyLoaded();
            await app.homePage.verifyHeroVisible();
            await app.homePage.verifyFreeShippingBannerVisible();
            await app.homePage.verifyCategoryTilesDisplayed(categories);
            await app.homePage.verifyFeaturedProductsDisplayed(featuredProducts);

            await app.header.clickProducts();

            await app.productListPage.verifyLoaded();
            await app.productListPage.verifyCategoryIsSelected(Category.ALL);
            await app.productListPage.verifyResultCountText(allProducts.length);
            await app.productListPage.verifyProductsAmount(allProducts.length);
            await app.productListPage.verifyProductsDisplayed(allProducts);

            await app.productListPage.product(allProducts[0]).click();

            await app.productDetailPage.verifyLoaded();
            await app.productDetailPage.verifyProductName(allProducts[0]);
            await app.productDetailPage.clickBreadcrumbPage("Shop");

            await app.productListPage.verifyLoaded();
            await app.productListPage.verifyCategoryIsSelected(Category.ALL);
            await app.productListPage.verifyResultCountText(allProducts.length);
            await app.productListPage.verifyProductsAmount(allProducts.length);
            await app.productListPage.verifyProductsDisplayed(allProducts);

            await app.header.clickLogo();

            await app.homePage.verifyLoaded();
            await app.homePage.verifyHeroVisible();
            await app.homePage.verifyFreeShippingBannerVisible();

            await app.homePage.featuredProduct(featuredProducts[0]).click();

            await app.productDetailPage.verifyLoaded();
            await app.productDetailPage.verifyProductName(featuredProducts[0]);

            await app.header.clickLogo();

            await app.homePage.verifyLoaded();
            await app.homePage.verifyHeroVisible();
            await app.homePage.verifyFreeShippingBannerVisible();
        });


    test('Product detail page should display correct product info, related products, and breadcrumb navigation',
        {tag: '@browsing'}, async ({app}) => {
            const randomProductName = faker.helpers.arrayElement(featuredProducts);

            await app.homePage.open();
            await app.homePage.verifyLoaded();

            await app.spCookieBanner.verifyLoaded();
            await app.spCookieBanner.clickDeclineButton();
            await app.spCookieBanner.verifyHidden();

            await app.spTrustBadge.verifyLoaded();

            const randomProduct = app.homePage.featuredProduct(randomProductName);
            const productPrice = await randomProduct.getRawPrice();
            const stockStatus = await randomProduct.getStockStatus();

            await randomProduct.click();

            await app.productDetailPage.verifyLoaded();
            await app.productDetailPage.verifyProductName(randomProductName);
            await app.productDetailPage.verifyDescriptionVisible();
            await app.productDetailPage.verifyProductPrice(productPrice);
            await app.productDetailPage.verifyStockStatus(stockStatus);

            const productCategory = await app.productDetailPage.getProductCategory();
            await app.productDetailPage.clickProductCategoryInBreadcrumb();

            await app.productListPage.verifyLoaded();
            await app.productListPage.verifyCategoryIsSelected(productCategory);
            await app.productListPage.product(randomProductName).click()

            await app.productDetailPage.verifyLoaded();
            await app.productDetailPage.verifyProductName(randomProductName);
            await app.productDetailPage.verifyProductPrice(productPrice);
            await app.productDetailPage.verifyStockStatus(stockStatus);

            await app.header.clickProducts();

            await app.productListPage.verifyLoaded();
            await app.productListPage.verifyCategoryIsSelected(Category.ALL);
            await app.productListPage.verifyResultCountText(allProducts.length);
            await app.productListPage.verifyProductsAmount(allProducts.length);
            await app.productListPage.verifyProductsDisplayed(allProducts);

            await app.productListPage.product(randomProductName).click();

            await app.productDetailPage.verifyLoaded();
            await app.productDetailPage.verifyProductName(randomProductName);
            await app.productDetailPage.verifyProductPrice(productPrice);
            await app.productDetailPage.verifyStockStatus(stockStatus);

            const relatedProductNames = await app.productDetailPage.getRelatedProductNames();
            const relatedProductName = faker.helpers.arrayElement(relatedProductNames);

            const relatedProductPrice = await app.productDetailPage.relatedProduct(relatedProductName).getRawPrice();
            const relatedProductStatus = await app.productDetailPage.relatedProduct(relatedProductName).getStockStatus();

            await app.productDetailPage.relatedProduct(relatedProductName).click();

            await app.productDetailPage.verifyLoaded();
            await app.productDetailPage.verifyProductName(relatedProductName);
            await app.productDetailPage.verifyProductPrice(relatedProductPrice);
            await app.productDetailPage.verifyStockStatus(relatedProductStatus);

            await app.spTrustBadge.verifyLoaded();

            await app.spTrustBadge.clickTrustBadge();

            await app.spTrustBadge.verifyHidden();
            await app.spPreferenceCenter.verifyLoaded();

            await app.spPreferenceCenter.advertising.verifyLoaded();
            await app.spPreferenceCenter.advertising.verifyCheckboxUnchecked();

            await app.spPreferenceCenter.analytics.verifyLoaded();
            await app.spPreferenceCenter.analytics.verifyCheckboxUnchecked();

            await app.spPreferenceCenter.essential.verifyLoaded();
            await app.spPreferenceCenter.essential.verifyCheckboxChecked();
            await app.spPreferenceCenter.essential.verifyCheckboxDisabled();

            await app.spPreferenceCenter.clickCancelButton();

            await app.spPreferenceCenter.verifyHidden();
            await app.spTrustBadge.verifyLoaded();
        });


    test('Category filter should show only products matching the selected category',
        {tag: '@browsing'}, async ({app}) => {
            await app.productListPage.open();

            await app.productListPage.verifyLoaded();
            await app.productListPage.verifyCategoryIsSelected(Category.ALL);
            await app.productListPage.verifyCategoryIsNotSelected(Category.APPAREL_MENS);
            await app.productListPage.verifyCategoryIsNotSelected(Category.APPAREL_WOMENS);
            await app.productListPage.verifyCategoryIsNotSelected(Category.ACCESSORIES);
            await app.productListPage.verifyCategoryIsNotSelected(Category.HOME);
            await app.productListPage.verifyResultCountText(allProducts.length);
            await app.productListPage.verifyProductsAmount(allProducts.length);
            await app.productListPage.verifyProductsDisplayed(allProducts);

            await app.productListPage.selectCategory(Category.APPAREL_MENS);

            await app.productListPage.verifyCategoryIsNotSelected(Category.ALL);
            await app.productListPage.verifyCategoryIsSelected(Category.APPAREL_MENS);
            await app.productListPage.verifyCategoryIsNotSelected(Category.APPAREL_WOMENS);
            await app.productListPage.verifyCategoryIsNotSelected(Category.ACCESSORIES);
            await app.productListPage.verifyCategoryIsNotSelected(Category.HOME);

            await app.productListPage.verifyResultCountText(mensProducts.length);
            await app.productListPage.verifyProductsAmount(mensProducts.length);
            await app.productListPage.verifyProductsDisplayed(mensProducts);

            await app.productListPage.selectCategory(Category.APPAREL_WOMENS);

            await app.productListPage.verifyCategoryIsNotSelected(Category.ALL);
            await app.productListPage.verifyCategoryIsNotSelected(Category.APPAREL_MENS);
            await app.productListPage.verifyCategoryIsSelected(Category.APPAREL_WOMENS);
            await app.productListPage.verifyCategoryIsNotSelected(Category.ACCESSORIES);
            await app.productListPage.verifyCategoryIsNotSelected(Category.HOME);

            await app.productListPage.verifyResultCountText(womenProducts.length);
            await app.productListPage.verifyProductsAmount(womenProducts.length);
            await app.productListPage.verifyProductsDisplayed(womenProducts);

            await app.productListPage.selectCategory(Category.ACCESSORIES);

            await app.productListPage.verifyCategoryIsNotSelected(Category.ALL);
            await app.productListPage.verifyCategoryIsNotSelected(Category.APPAREL_MENS);
            await app.productListPage.verifyCategoryIsNotSelected(Category.APPAREL_WOMENS);
            await app.productListPage.verifyCategoryIsSelected(Category.ACCESSORIES);
            await app.productListPage.verifyCategoryIsNotSelected(Category.HOME);

            await app.productListPage.verifyResultCountText(accessoriesProducts.length);
            await app.productListPage.verifyProductsAmount(accessoriesProducts.length);
            await app.productListPage.verifyProductsDisplayed(accessoriesProducts);

            await app.productListPage.selectCategory(Category.HOME);

            await app.productListPage.verifyCategoryIsNotSelected(Category.ALL);
            await app.productListPage.verifyCategoryIsNotSelected(Category.APPAREL_MENS);
            await app.productListPage.verifyCategoryIsNotSelected(Category.APPAREL_WOMENS);
            await app.productListPage.verifyCategoryIsNotSelected(Category.ACCESSORIES);
            await app.productListPage.verifyCategoryIsSelected(Category.HOME);

            await app.productListPage.verifyResultCountText(homeProducts.length);
            await app.productListPage.verifyProductsAmount(homeProducts.length);
            await app.productListPage.verifyProductsDisplayed(homeProducts);

            await app.productListPage.selectCategory(Category.ALL);

            await app.productListPage.verifyCategoryIsSelected(Category.ALL);
            await app.productListPage.verifyCategoryIsNotSelected(Category.APPAREL_MENS);
            await app.productListPage.verifyCategoryIsNotSelected(Category.APPAREL_WOMENS);
            await app.productListPage.verifyCategoryIsNotSelected(Category.ACCESSORIES);
            await app.productListPage.verifyCategoryIsNotSelected(Category.HOME);
            await app.productListPage.verifyResultCountText(allProducts.length);
            await app.productListPage.verifyProductsAmount(allProducts.length);
            await app.productListPage.verifyProductsDisplayed(allProducts);
        });


    test('Product sorting should reorder the list correctly for each sort option',
        {tag: '@browsing'}, async ({app}) => {
            await app.homePage.open();
            await app.homePage.verifyLoaded();

            await app.homePage.clickShopAllProducts();

            await app.productListPage.verifyLoaded();
            await app.productListPage.verifySortOptionsAvailable([
                Sorting.FEATURED, Sorting.PRICE_ASC, Sorting.PRICE_DESC, Sorting.NAME_ASC
            ]);

            await app.productListPage.selectSort(Sorting.PRICE_ASC);
            await app.productListPage.verifySortOrder(Sorting.PRICE_ASC);

            await app.productListPage.selectSort(Sorting.PRICE_DESC);
            await app.productListPage.verifySortOrder(Sorting.PRICE_DESC);

            await app.productListPage.selectSort(Sorting.NAME_ASC);
            await app.productListPage.verifySortOrder(Sorting.NAME_ASC);

            await app.productListPage.selectCategory(Category.APPAREL_MENS);

            await app.productListPage.selectSort(Sorting.PRICE_ASC);

            await app.productListPage.verifySortOrder(Sorting.PRICE_ASC);
            await app.productListPage.verifyProductsAmount(mensProducts.length);
        });


    test('Product search should filter results by name and restore all products on clear',
        {tag: '@browsing'}, async ({app}) => {
            await app.homePage.open();
            await app.homePage.verifyLoaded();

            await app.homePage.clickShopAllProducts();

            await app.productListPage.verifyLoaded();

            await app.productListPage.search('classic');

            await app.productListPage.verifyResultCountChangedText(allProducts.length);

            let productNames = await app.productListPage.getProductNames();

            await app.productListPage.verifyResultCountText(productNames.length);
            expect(productNames).toStrictEqual(['Classic White Tee', 'Classic White Tee']);

            await app.productListPage.clearSearch();
            await app.productListPage.verifyResultCountText(allProducts.length);

            await app.productListPage.selectCategory(Category.APPAREL_MENS);

            await app.productListPage.verifyCategoryIsSelected(Category.APPAREL_MENS);
            await app.productListPage.verifyResultCountText(mensProducts.length);

            await app.productListPage.search('wool');

            await app.productListPage.verifyResultCountChangedText(mensProducts.length);

            productNames = await app.productListPage.getProductNames();
            expect(productNames).toStrictEqual(['Merino Wool Sweater']);

            await app.productListPage.clearSearch();

            await app.productListPage.verifyCategoryIsSelected(Category.APPAREL_MENS);
            await app.productListPage.verifyResultCountText(mensProducts.length);
        });

});
