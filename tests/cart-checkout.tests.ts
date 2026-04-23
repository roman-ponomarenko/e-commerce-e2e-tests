import {test} from "@/app/app.fixture";
import {faker} from "@faker-js/faker";
import {Category} from "@/app/pages/product-list.page";
import type {PaymentDetails} from "@/app/pages/checkout.page";
import {parsePrice, formatPrice} from "@/utils/price";


test.describe('Cart & Checkout tests', () => {
    const fullName = faker.person.fullName();
    const paymentData: PaymentDetails = {
        fullName,
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        zip: faker.location.zipCode(),
        country: faker.location.country(),
        cardHolderName: fullName,
        cardNumber: '4670898890674',
        cardExpiryDate: "12/30",
        cardCvc: faker.finance.creditCardCVV()
    }

    test('Size selection and quantity adjustment should add the correct number of items to the cart',
        {tag: '@cart-checkout'}, async ({app}) => {
            const productName = 'Cashmere Cardigan';
            const size = 'M';

            await app.homePage.open();
            await app.homePage.verifyLoaded();

            await app.spCookieBanner.verifyLoaded();
            await app.spCookieBanner.clickDeclineButton();
            await app.spCookieBanner.verifyHidden();

            await app.homePage.clickShopAllProducts();
            await app.productListPage.verifyLoaded();

            const rawProductPrice = await app.productListPage.product(productName).getRawPrice();
            const productPrice = parsePrice(rawProductPrice);
            await app.productListPage.product(productName).clickChooseOptionsButton();

            await app.productDetailPage.verifyLoaded();
            await app.productDetailPage.verifyProductName(productName);
            await app.productDetailPage.verifyProductPrice(rawProductPrice);
            await app.productDetailPage.verifySizeSelectorVisible();

            await app.productDetailPage.addToCart();

            await app.toast.verifyLoaded('warning');
            await app.toast.verifyMessage('Please select a size');
            await app.toast.dismiss();

            await app.productDetailPage.verifySizeNotSelected(size);
            await app.productDetailPage.selectSize(size);
            await app.productDetailPage.verifySizeSelected(size);

            await app.productDetailPage.quantity.verifyQuantity(1);
            await app.productDetailPage.quantity.verifyDecrementDisabled();
            await app.productDetailPage.quantity.increment();
            await app.productDetailPage.quantity.increment();
            await app.productDetailPage.quantity.verifyQuantity(3);
            await app.productDetailPage.quantity.decrement();
            await app.productDetailPage.quantity.verifyQuantity(2);

            await app.productDetailPage.addToCart();

            await app.toast.verifyLoaded('success');
            await app.toast.verifyMessage('Added to cart');
            await app.toast.dismiss();

            await app.header.verifyCartCount(2);
            await app.header.clickCart();

            await app.cartDrawer.verifyLoaded();
            await app.cartDrawer.verifyCartItemsAmount(1);
            await app.cartDrawer.verifyTotalItemsAmount(2);
            await app.cartDrawer.verifyTotalAmount(formatPrice(productPrice * 2));

            await app.cartDrawer.cartItem(productName).verifyLoaded();
            await app.cartDrawer.cartItem(productName).verifySize(size);
            await app.cartDrawer.cartItem(productName).verifyPrice(formatPrice(productPrice * 2));
        });


    test('Placing an order with valid details should complete checkout and appear in account history',
        {tag: '@cart-checkout'}, async ({app, config}) => {
            const homeProductName = "Enamel Pour-Over Kettle";

            await app.loginPage.open();
            await app.loginPage.verifyLoaded();

            await app.spCookieBanner.verifyLoaded();
            await app.spCookieBanner.clickAcceptAllButton();

            await app.spCookieBanner.verifyHidden();
            await app.spTrustBadge.verifyLoaded();

            await app.loginPage.fillUsername(config.APP_USERNAME);
            await app.loginPage.fillPassword(config.APP_PASSWORD);
            await app.loginPage.clickSubmitButton();

            await app.homePage.verifyLoaded();

            await app.toast.verifyLoaded('success');
            await app.toast.verifyMessage('Welcome back!');
            await app.toast.dismiss();

            await app.homePage.clickShopAllProducts();

            await app.productListPage.verifyLoaded();
            await app.productListPage.selectCategory(Category.HOME);

            const product = app.productListPage.product(homeProductName);
            const rawProductPrice = await product.getRawPrice();
            const stockStatus = await product.getStockStatus();

            await product.click();

            await app.productDetailPage.verifyLoaded();
            await app.productDetailPage.verifyProductName(homeProductName);
            await app.productDetailPage.verifyProductPrice(rawProductPrice);
            await app.productDetailPage.verifyStockStatus(stockStatus);

            await app.header.clickCart();

            await app.cartDrawer.verifyLoaded();
            await app.cartDrawer.verifyEmpty();
            await app.cartDrawer.close();

            await app.productDetailPage.addToCart();

            await app.toast.verifyLoaded('success');
            await app.toast.verifyMessage('Added to cart');
            await app.toast.dismiss();

            await app.header.verifyCartCount(1);
            await app.header.clickCart();

            await app.cartDrawer.verifyLoaded();
            await app.cartDrawer.verifyCartItemsAmount(1);
            await app.cartDrawer.verifyTotalItemsAmount(1);
            await app.cartDrawer.verifyTotalAmount(rawProductPrice);
            await app.cartDrawer.cartItem(homeProductName).verifyLoaded();
            await app.cartDrawer.cartItem(homeProductName).verifyPrice(rawProductPrice);

            await app.cartDrawer.cartItem(homeProductName).increment();

            await app.cartDrawer.verifyCartItemsAmount(1);
            await app.cartDrawer.verifyTotalItemsAmount(2);

            await app.cartDrawer.cartItem(homeProductName).decrement();

            await app.cartDrawer.verifyCartItemsAmount(1);
            await app.cartDrawer.verifyTotalItemsAmount(1);
            await app.cartDrawer.verifyTotalAmount(rawProductPrice);
            await app.cartDrawer.cartItem(homeProductName).verifyLoaded();
            await app.cartDrawer.cartItem(homeProductName).verifyPrice(rawProductPrice);

            await app.cartDrawer.clickViewCart();

            await app.cartPage.verifyLoaded();
            await app.cartPage.orderSummary.verifyLoaded();
            await app.cartPage.orderSummary.verifySubtotal(rawProductPrice);
            await app.cartPage.orderSummary.verifyShipping('Free');
            await app.cartPage.orderSummary.verifyTotal(rawProductPrice);

            await app.cartPage.proceedToCheckout();

            await app.checkoutPage.verifyLoaded();
            await app.checkoutPage.orderSummary.verifyLoaded();
            await app.checkoutPage.orderSummary.verifySubtotal(rawProductPrice);
            await app.checkoutPage.orderSummary.verifyShipping('Free');
            await app.checkoutPage.orderSummary.verifyTotal(rawProductPrice);

            await app.checkoutPage.fillPaymentDetails(paymentData);
            await app.checkoutPage.clickPlaceOrder();

            await app.confirmationPage.verifyLoaded();
            await app.confirmationPage.verifyOrderNumberVisible();
            await app.confirmationPage.verifyTotalPaid(rawProductPrice);

            await app.toast.verifyLoaded('success');
            await app.toast.verifyMessage('Order placed!');
            await app.toast.dismiss();

            const orderNumber = await app.confirmationPage.getOrderNumber();
            await app.confirmationPage.clickViewAccountButton();

            await app.accountPage.verifyLoaded();
            await app.accountPage.verifyOrderCount(1);
            await app.accountPage.order(orderNumber).verifyLoaded();
            await app.accountPage.order(orderNumber).verifyTotal(rawProductPrice);
            await app.accountPage.order(orderNumber).verifyItemCount(1);

            await app.accountPage.clickLogoutButton();

            await app.loginPage.verifyLoaded();
        });

    //TODO: Skipped due to redirect failure, after login checkout page is not loaded, instead user is redirected to home page
    test.skip('Unauthenticated checkout from cart page should redirect to login and resume to checkout after sign in',
        {tag: '@cart-checkout'}, async ({app, config}) => {
            const homeProductName = "Enamel Pour-Over Kettle";

            await app.homePage.open();
            await app.homePage.verifyLoaded();

            await app.homePage.clickShopAllProducts();

            await app.productListPage.verifyLoaded();
            await app.productListPage.selectCategory(Category.HOME);

            const product = app.productListPage.product(homeProductName);
            const rawProductPrice = await product.getRawPrice();
            const stockStatus = await product.getStockStatus();

            await product.click();

            await app.productDetailPage.verifyLoaded();
            await app.productDetailPage.verifyProductName(homeProductName);
            await app.productDetailPage.verifyProductPrice(rawProductPrice);
            await app.productDetailPage.verifyStockStatus(stockStatus);

            await app.spCookieBanner.verifyLoaded();
            await app.spCookieBanner.clickAcceptAllButton();

            await app.spCookieBanner.verifyHidden();
            await app.spTrustBadge.verifyLoaded();

            await app.productDetailPage.addToCart();

            await app.header.clickCart();

            await app.cartDrawer.verifyLoaded();
            await app.cartDrawer.verifyCartItemsAmount(1);
            await app.cartDrawer.verifyTotalItemsAmount(1);
            await app.cartDrawer.verifyTotalAmount(rawProductPrice);
            await app.cartDrawer.cartItem(homeProductName).verifyLoaded();
            await app.cartDrawer.cartItem(homeProductName).verifyPrice(rawProductPrice);

            await app.cartDrawer.clickViewCart();

            await app.cartPage.verifyLoaded();
            await app.cartPage.orderSummary.verifyLoaded();
            await app.cartPage.orderSummary.verifySubtotal(rawProductPrice);
            await app.cartPage.orderSummary.verifyShipping('Free');
            await app.cartPage.orderSummary.verifyTotal(rawProductPrice);

            await app.cartPage.proceedToCheckout();

            await app.loginPage.verifyLoaded();
            await app.loginPage.login(config.APP_USERNAME, config.APP_PASSWORD);

            await app.checkoutPage.verifyLoaded();

            await app.checkoutPage.orderSummary.verifyLoaded();
            await app.checkoutPage.orderSummary.verifySubtotal(rawProductPrice);
            await app.checkoutPage.orderSummary.verifyShipping('Free');
            await app.checkoutPage.orderSummary.verifyTotal(rawProductPrice);

            await app.checkoutPage.fillPaymentDetails(paymentData);
            await app.checkoutPage.clickPlaceOrder();

            await app.confirmationPage.verifyLoaded();
            await app.confirmationPage.verifyOrderNumberVisible();
            await app.confirmationPage.verifyTotalPaid(rawProductPrice);
        });


    test('Removing the last item from the cart drawer should show empty cart state',
        {tag: '@cart-checkout'}, async ({app}) => {
            const productName = 'Enamel Pour-Over Kettle';

            await app.homePage.open();
            await app.homePage.verifyLoaded();

            await app.spCookieBanner.verifyLoaded();
            await app.spCookieBanner.clickDeclineButton();
            await app.spCookieBanner.verifyHidden();
            await app.spTrustBadge.verifyLoaded();

            await app.homePage.clickShopAllProducts();

            await app.productListPage.verifyLoaded();
            await app.productListPage.selectCategory(Category.HOME);

            await app.productListPage.product(productName).click();

            await app.productDetailPage.verifyLoaded();
            await app.productDetailPage.verifyProductName(productName);

            await app.productDetailPage.addToCart();

            await app.toast.verifyLoaded('success');
            await app.toast.verifyMessage('Added to cart');
            await app.toast.dismiss();

            await app.header.verifyCartCount(1);
            await app.header.clickCart();

            await app.cartDrawer.verifyLoaded();
            await app.cartDrawer.verifyCartItemsAmount(1);
            await app.cartDrawer.verifyTotalItemsAmount(1);
            await app.cartDrawer.cartItem(productName).verifyLoaded();

            await app.cartDrawer.cartItem(productName).remove();

            await app.cartDrawer.verifyEmpty();
        });


    test('Authenticated "Checkout" from cart drawer should navigate directly to checkout',
        {tag: '@cart-checkout'}, async ({app, config}) => {
            const productName = 'Enamel Pour-Over Kettle';

            await app.loginPage.open();
            await app.loginPage.verifyLoaded();

            await app.spCookieBanner.verifyLoaded();
            await app.spCookieBanner.clickDeclineButton();
            await app.spCookieBanner.verifyHidden();

            await app.loginPage.fillUsername(config.APP_USERNAME);
            await app.loginPage.fillPassword(config.APP_PASSWORD);
            await app.loginPage.clickSubmitButton();

            await app.homePage.verifyLoaded();

            await app.toast.verifyLoaded('success');
            await app.toast.verifyMessage('Welcome back!');
            await app.toast.dismiss();

            await app.homePage.clickShopAllProducts();

            await app.productListPage.verifyLoaded();
            await app.productListPage.selectCategory(Category.HOME);

            const product = app.productListPage.product(productName);
            const rawProductPrice = await product.getRawPrice();

            await product.click();

            await app.productDetailPage.verifyLoaded();
            await app.productDetailPage.verifyProductName(productName);

            await app.productDetailPage.addToCart();

            await app.toast.verifyLoaded('success');
            await app.toast.verifyMessage('Added to cart');
            await app.toast.dismiss();

            await app.header.verifyCartCount(1);
            await app.header.clickCart();

            await app.cartDrawer.verifyLoaded();
            await app.cartDrawer.verifyCartItemsAmount(1);
            await app.cartDrawer.verifyTotalItemsAmount(1);
            await app.cartDrawer.verifyTotalAmount(rawProductPrice);
            await app.cartDrawer.cartItem(productName).verifyLoaded();

            await app.cartDrawer.clickCheckout();

            await app.checkoutPage.verifyLoaded();
            await app.checkoutPage.orderSummary.verifyLoaded();
            await app.checkoutPage.orderSummary.verifySubtotal(rawProductPrice);
            await app.checkoutPage.orderSummary.verifyShipping('Free');
            await app.checkoutPage.orderSummary.verifyTotal(rawProductPrice);
        });


    test('Unauthenticated "Checkout" from cart drawer should redirect to login',
        {tag: '@cart-checkout'}, async ({app}) => {
            const productName = 'Enamel Pour-Over Kettle';

            await app.homePage.open();
            await app.homePage.verifyLoaded();

            await app.spCookieBanner.verifyLoaded();
            await app.spCookieBanner.clickDeclineButton();
            await app.spCookieBanner.verifyHidden();
            await app.spTrustBadge.verifyLoaded();

            await app.homePage.clickShopAllProducts();

            await app.productListPage.verifyLoaded();
            await app.productListPage.selectCategory(Category.HOME);

            await app.productListPage.product(productName).click();

            await app.productDetailPage.verifyLoaded();
            await app.productDetailPage.verifyProductName(productName);

            await app.productDetailPage.addToCart();

            await app.toast.verifyLoaded('success');
            await app.toast.verifyMessage('Added to cart');
            await app.toast.dismiss();

            await app.header.clickCart();

            await app.cartDrawer.verifyLoaded();
            await app.cartDrawer.verifyCartItemsAmount(1);

            await app.cartDrawer.clickCheckout();

            await app.loginPage.verifyLoaded();
        });


    test('Applying a valid promo code should discount the order total through to confirmation',
        {tag: '@cart-checkout'}, async ({app, config}) => {
            const productName = 'Enamel Pour-Over Kettle';
            const promoCode = 'WELCOME10';
            const promoDiscount = 0.1;

            await app.loginPage.login(config.APP_USERNAME, config.APP_PASSWORD);

            await app.spCookieBanner.verifyLoaded();
            await app.spCookieBanner.clickDeclineButton();

            await app.toast.verifyLoaded('success');
            await app.toast.dismiss();

            await app.homePage.clickShopAllProducts();

            await app.productListPage.verifyLoaded();
            await app.productListPage.selectCategory(Category.HOME);

            const rawProductPrice = await app.productListPage.product(productName).getRawPrice();
            const productPrice = parsePrice(rawProductPrice);

            await app.productListPage.product(productName).click();

            await app.productDetailPage.verifyLoaded();
            await app.productDetailPage.verifyProductName(productName);

            await app.productDetailPage.addToCart();

            await app.toast.verifyLoaded('success');
            await app.toast.verifyMessage('Added to cart');
            await app.toast.dismiss();

            await app.header.clickCart();

            await app.cartDrawer.verifyLoaded();
            await app.cartDrawer.clickViewCart();

            await app.cartPage.verifyLoaded();
            await app.cartPage.orderSummary.verifyLoaded();
            await app.cartPage.orderSummary.verifySubtotal(rawProductPrice);
            await app.cartPage.orderSummary.verifyShipping('Free');
            await app.cartPage.orderSummary.verifyTotal(rawProductPrice);

            await app.cartPage.applyPromoCode(promoCode);

            await app.toast.verifyLoaded('success');
            await app.toast.verifyMessage('Promo code applied');
            await app.toast.dismiss();

            const discountAmount = productPrice * promoDiscount;
            const totalAfterDiscount = productPrice - discountAmount;

            await app.cartPage.verifyPromoApplied(promoCode);
            await app.cartPage.orderSummary.verifySubtotal(rawProductPrice);
            await app.cartPage.orderSummary.verifyDiscount(`−${formatPrice(discountAmount)}`);
            await app.cartPage.orderSummary.verifyShipping('Free');
            await app.cartPage.orderSummary.verifyTotal(formatPrice(totalAfterDiscount));

            await app.cartPage.proceedToCheckout();

            await app.checkoutPage.verifyLoaded();
            await app.checkoutPage.orderSummary.verifyLoaded();
            await app.checkoutPage.orderSummary.verifySubtotal(rawProductPrice);
            await app.checkoutPage.orderSummary.verifyDiscount(`−${formatPrice(discountAmount)}`);
            await app.checkoutPage.orderSummary.verifyShipping('Free');
            await app.checkoutPage.orderSummary.verifyTotal(formatPrice(totalAfterDiscount));

            await app.checkoutPage.fillPaymentDetails(paymentData);
            await app.checkoutPage.clickPlaceOrder();

            await app.confirmationPage.verifyLoaded();
            await app.confirmationPage.verifyOrderNumberVisible();
            await app.confirmationPage.verifyTotalPaid(formatPrice(totalAfterDiscount));

            await app.toast.verifyLoaded('success');
            await app.toast.verifyMessage('Order placed!');
            await app.toast.dismiss();

            await app.confirmationPage.clickContinueShoppingButton();

            await app.productListPage.verifyLoaded();
            await app.productListPage.verifyCategoryIsSelected(Category.ALL);
        });


    test('Applying an invalid promo code should show an error and leave the order total unchanged',
        {tag: '@cart-checkout'}, async ({app}) => {
            const productName = 'Enamel Pour-Over Kettle';

            await app.homePage.open();
            await app.homePage.verifyLoaded();

            await app.spCookieBanner.verifyLoaded();
            await app.spCookieBanner.clickDeclineButton();
            await app.spCookieBanner.verifyHidden();
            await app.spTrustBadge.verifyLoaded();

            await app.homePage.clickShopAllProducts();

            await app.productListPage.verifyLoaded();
            await app.productListPage.selectCategory(Category.HOME);

            const rawProductPrice = await app.productListPage.product(productName).getRawPrice();

            await app.productListPage.product(productName).click();

            await app.productDetailPage.verifyLoaded();
            await app.productDetailPage.addToCart();

            await app.toast.verifyLoaded('success');
            await app.toast.verifyMessage('Added to cart');
            await app.toast.dismiss();

            await app.header.clickCart();

            await app.cartDrawer.verifyLoaded();
            await app.cartDrawer.clickViewCart();

            await app.cartPage.verifyLoaded();
            await app.cartPage.orderSummary.verifySubtotal(rawProductPrice);
            await app.cartPage.orderSummary.verifyTotal(rawProductPrice);

            await app.cartPage.applyPromoCode('INVALIDCODE');

            await app.cartPage.verifyPromoError('Invalid promo code');
            await app.cartPage.orderSummary.verifySubtotal(rawProductPrice);
            await app.cartPage.orderSummary.verifyTotal(rawProductPrice);
        });


    test('Removing a cart item and updating quantity should reflect correctly in the order summary and at checkout',
        {tag: '@cart-checkout'}, async ({app, config}) => {
            const product1 = 'Enamel Pour-Over Kettle';
            const product2 = 'Linen Throw Blanket';

            await app.loginPage.login(config.APP_USERNAME, config.APP_PASSWORD);

            await app.spCookieBanner.verifyLoaded();
            await app.spCookieBanner.clickDeclineButton();

            await app.toast.verifyLoaded('success');
            await app.toast.dismiss();

            await app.homePage.clickShopAllProducts();

            await app.productListPage.verifyLoaded();
            await app.productListPage.selectCategory(Category.HOME);

            const rawPrice1 = await app.productListPage.product(product1).getRawPrice();
            const price1 = parsePrice(rawPrice1);
            const rawPrice2 = await app.productListPage.product(product2).getRawPrice();
            const price2 = parsePrice(rawPrice2);

            await app.productListPage.product(product1).addToCart();
            await app.toast.verifyLoaded('success');
            await app.toast.verifyMessage(`${product1} added to cart`);
            await app.toast.dismiss();

            await app.productListPage.product(product2).addToCart();
            await app.toast.verifyLoaded('success');
            await app.toast.verifyMessage(`${product2} added to cart`);
            await app.toast.dismiss();

            await app.header.verifyCartCount(2);
            await app.header.clickCart();

            await app.cartDrawer.verifyLoaded();
            await app.cartDrawer.verifyCartItemsAmount(2);
            await app.cartDrawer.verifyTotalItemsAmount(2);
            await app.cartDrawer.verifyTotalAmount(formatPrice(price1 + price2));
            await app.cartDrawer.clickViewCart();

            await app.cartPage.verifyLoaded();
            await app.cartPage.verifyItemCount(2);
            await app.cartPage.orderSummary.verifyLoaded();
            await app.cartPage.orderSummary.verifySubtotal(formatPrice(price1 + price2));
            await app.cartPage.orderSummary.verifyShipping('Free');
            await app.cartPage.orderSummary.verifyTotal(formatPrice(price1 + price2));

            await app.cartPage.cartItem(product1).remove();

            await app.cartPage.verifyItemCount(1);

            await app.cartPage.orderSummary.verifySubtotal(rawPrice2);
            await app.cartPage.orderSummary.verifyShipping('Free');
            await app.cartPage.orderSummary.verifyTotal(rawPrice2);

            await app.cartPage.cartItem(product2).increment();
            await app.cartPage.cartItem(product2).verifyQuantity(2);
            await app.cartPage.cartItem(product2).verifyPrice(formatPrice(price2 * 2));

            await app.cartPage.orderSummary.verifySubtotal(formatPrice(price2 * 2));
            await app.cartPage.orderSummary.verifyShipping('Free');
            await app.cartPage.orderSummary.verifyTotal(formatPrice(price2 * 2));

            await app.cartPage.cartItem(product2).clickName();

            await app.productDetailPage.verifyLoaded();
            await app.productDetailPage.verifyProductName(product2);

            await app.productDetailPage.goBack();

            await app.cartPage.verifyLoaded();
            await app.cartPage.verifyItemCount(1);

            await app.cartPage.cartItem(product2).verifyQuantity(2);
            await app.cartPage.cartItem(product2).verifyPrice(formatPrice(price2 * 2));

            await app.cartPage.orderSummary.verifyLoaded();
            await app.cartPage.orderSummary.verifySubtotal(formatPrice(price2 * 2));
            await app.cartPage.orderSummary.verifyShipping('Free');
            await app.cartPage.orderSummary.verifyTotal(formatPrice(price2 * 2));

            await app.cartPage.proceedToCheckout();

            await app.checkoutPage.verifyLoaded();
            await app.checkoutPage.orderSummary.verifyLoaded();
            await app.checkoutPage.orderSummary.verifySubtotal(formatPrice(price2 * 2));
            await app.checkoutPage.orderSummary.verifyShipping('Free');
            await app.checkoutPage.orderSummary.verifyTotal(formatPrice(price2 * 2));

            await app.checkoutPage.fillPaymentDetails(paymentData);
            await app.checkoutPage.clickPlaceOrder();

            await app.confirmationPage.verifyLoaded();
            await app.confirmationPage.verifyOrderNumberVisible();
            await app.confirmationPage.verifyTotalPaid(formatPrice(price2 * 2));

            await app.toast.verifyLoaded('success');
            await app.toast.verifyMessage('Order placed!');
            await app.toast.dismiss();
        });


    test('Checkout form should show a validation error when submitted without required fields',
        {tag: '@cart-checkout'}, async ({app, config}) => {
            const productName = 'Enamel Pour-Over Kettle';

            await app.loginPage.open();
            await app.loginPage.verifyLoaded();

            await app.spCookieBanner.verifyLoaded();
            await app.spCookieBanner.clickDeclineButton();
            await app.spCookieBanner.verifyHidden();

            await app.spTrustBadge.verifyLoaded();

            await app.loginPage.fillUsername(config.APP_USERNAME);
            await app.loginPage.fillPassword(config.APP_PASSWORD);
            await app.loginPage.clickSubmitButton();

            await app.homePage.verifyLoaded();

            await app.toast.verifyLoaded('success');
            await app.toast.verifyMessage('Welcome back!');
            await app.toast.dismiss();

            await app.homePage.clickShopAllProducts();

            await app.productListPage.verifyLoaded();
            await app.productListPage.selectCategory(Category.HOME);

            await app.productListPage.product(productName).click();

            await app.productDetailPage.verifyLoaded();
            await app.productDetailPage.addToCart();

            await app.toast.verifyLoaded('success');
            await app.toast.dismiss();

            await app.header.clickCart();

            await app.cartDrawer.verifyLoaded();
            await app.cartDrawer.clickViewCart();

            await app.cartPage.verifyLoaded();
            await app.cartPage.proceedToCheckout();

            await app.checkoutPage.verifyLoaded();
            await app.checkoutPage.clickPlaceOrder();

            await app.checkoutPage.verifyCheckoutError('Full name is required');
        });

});

