import {PageHolder} from "@/app/abstract-classes";
import {HomePage} from "@/app/pages/home.page";
import {ProductListPage} from "@/app/pages/product-list.page";
import {ProductDetailPage} from "@/app/pages/product-detail.page";
import {CartPage} from "@/app/pages/cart.page";
import {LoginPage} from "@/app/pages/login.page";
import {CreateAccountPage} from "@/app/pages/create-account.page";
import {CheckoutPage} from "@/app/pages/checkout.page";
import {ConfirmationPage} from "@/app/pages/confirmation.page";
import {AccountPage} from "@/app/pages/account.page";
import {CartDrawer} from "@/app/components/cart-drawer.component";
import {Header} from "@/app/components/header.component";
import {Toast} from "@/app/components/toast.component";
import {SpCookieBanner} from "@/app/components/sp/sp-cookie-banner.component";
import {SpTrustBadge} from "@/app/components/sp/sp-trust-badge.component";
import {SpPreferenceCenter} from "@/app/components/sp/sp-preference-center.component";


export class App extends PageHolder {
    header = new Header(this.page);
    homePage = new HomePage(this.page);
    productListPage = new ProductListPage(this.page);
    productDetailPage = new ProductDetailPage(this.page);
    cartPage = new CartPage(this.page);
    cartDrawer = new CartDrawer(this.page);
    loginPage = new LoginPage(this.page);
    createAccountPage = new CreateAccountPage(this.page);
    checkoutPage = new CheckoutPage(this.page);
    confirmationPage = new ConfirmationPage(this.page);
    accountPage = new AccountPage(this.page);
    toast = new Toast(this.page);
    spCookieBanner = new SpCookieBanner(this.page);
    spTrustBadge = new SpTrustBadge(this.page);
    spPreferenceCenter = new SpPreferenceCenter(this.page);
}