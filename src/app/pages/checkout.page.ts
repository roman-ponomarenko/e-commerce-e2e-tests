import {AppPage} from "@/app/abstract-classes";
import {step} from "@/utils/step-decorator";
import {expect} from "@playwright/test";
import {OrderSummary} from "@/app/components/order-summary.component";
import config from "@/config";

export interface PaymentDetails {
    fullName: string;
    address: string;
    city: string;
    zip: string;
    country: string;
    cardHolderName: string;
    cardNumber: string;
    cardExpiryDate: string;
    cardCvc: string;
}

export class CheckoutPage extends AppPage {
    pagePath = config.CHECKOUT_PAGE_PATH;

    private pageRoot = this.$id('page-checkout');
    private fullNameInput = this.$id('ship-name');
    private addressInput = this.$id('ship-address1');
    private cityInput = this.$id('ship-city');
    private zipInput = this.$id('ship-zip');
    private countryInput = this.$id('ship-country');
    private cardHolderName = this.$id('pay-name');
    private cardNumber = this.$id('pay-number');
    private cardExpiryDate = this.$id('pay-expiry');
    private cardCvc = this.$id('pay-cvc');
    private placeOrderBtn = this.$id('place-order');
    private checkoutError = this.$id('checkout-error');

    orderSummary = new OrderSummary(this.page);

    @step("Verifying 'Checkout' page is loaded")
    async verifyLoaded(message = 'Checkout page should be loaded'): Promise<void> {
        await this.waitForLoadState();
        await expect(this.pageRoot, message).toBeVisible();
        await expect(this.fullNameInput).toBeVisible();
        await expect(this.placeOrderBtn).toBeVisible();
    }

    @step("User fills full name '{fullName}'")
    async fillFullName(fullName: string): Promise<void> {
        await this.fullNameInput.fill(fullName);
    }

    @step("User fills address '{address}'")
    async fillAddress(address: string): Promise<void> {
        await this.addressInput.fill(address);
    }

    @step("User fills city '{city}'")
    async fillCity(city: string): Promise<void> {
        await this.cityInput.fill(city);
    }

    @step("User fills ZIP code '{zip}'")
    async fillZip(zip: string): Promise<void> {
        await this.zipInput.fill(zip);
    }

    @step("User fills country '{country}'")
    async fillCountry(country: string): Promise<void> {
        await this.countryInput.fill(country);
    }

    @step("User fills card holder name '{cardHolderName}'")
    async fillCardHolderName(cardHolderName: string): Promise<void> {
        await this.cardHolderName.fill(cardHolderName);
    }

    @step("User fills card number '{number}'")
    async fillCardNumber(number: string): Promise<void> {
        await this.cardNumber.fill(number);
    }

    @step("User fills card expiry date '{date}'")
    async fillCardExpiryDate(date: string): Promise<void> {
        await this.cardExpiryDate.fill(date);
    }

    @step("User fills card CVC '{cvc}'")
    async fillCardCvc(cvc: string): Promise<void> {
        await this.cardCvc.fill(cvc);
    }

    @step("User clicks 'Place order'")
    async clickPlaceOrder(): Promise<void> {
        await this.placeOrderBtn.click();
    }

    @step("Verifying checkout error '{expected}' is visible")
    async verifyCheckoutError(expected: string, message = `Checkout error should say '${expected}'`): Promise<void> {
        await expect(this.checkoutError, message).toBeVisible();
        await expect(this.checkoutError, message).toHaveText(expected);
    }

    @step("User fills payment details for '{data.fullName}'")
    async fillPaymentDetails(data: PaymentDetails): Promise<void> {
        await this.fillFullName(data.fullName);
        await this.fillAddress(data.address);
        await this.fillCity(data.city);
        await this.fillZip(data.zip);
        await this.fillCountry(data.country);
        await this.fillCardHolderName(data.cardHolderName);
        await this.fillCardNumber(data.cardNumber);
        await this.fillCardExpiryDate(data.cardExpiryDate);
        await this.fillCardCvc(data.cardCvc);
    }
}