import {faker} from '@faker-js/faker';

import {test} from "@/app/app.fixture";

test.describe('Authentication tests', () => {

    const passwordOptions = {length: 20, pattern: /[A-Za-z0-9]/}

    test('Register with valid data should create an account and allow login',
        {tag: '@auth'}, async ({app}) => {
            const password = faker.internet.password(passwordOptions);
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const fullName = `${firstName} ${lastName}`;
            const email = faker.internet.email();

            await app.homePage.open();
            await app.homePage.verifyLoaded();

            await app.header.clickAccountMenu();
            await app.header.clickCreateAccount();

            await app.createAccountPage.verifyLoaded();

            await app.spCookieBanner.verifyLoaded();
            await app.spCookieBanner.clickAcceptAllButton();
            await app.spCookieBanner.verifyHidden();

            await app.spTrustBadge.verifyLoaded();

            await app.createAccountPage.fillFullName(fullName);
            await app.createAccountPage.fillEmail(email);
            await app.createAccountPage.fillPassword(password);
            await app.createAccountPage.fillConfirmPassword(password);
            await app.createAccountPage.clickSubmitButton();

            await app.homePage.verifyLoaded();

            await app.toast.verifyLoaded('success');
            await app.toast.verifyMessage('Account created!');
            await app.toast.dismiss();

            await app.header.verifyAccountName(firstName);
            await app.header.clickAccountMenu();
            await app.header.clickAccountLogout();

            await app.header.verifyAccountName('Account');

            await app.header.clickAccountMenu();
            await app.header.clickSignIn();

            await app.loginPage.verifyLoaded();
            await app.loginPage.login(email, password);

            await app.homePage.verifyLoaded();

            await app.toast.verifyLoaded('success');
            await app.toast.verifyMessage('Welcome back!');
            await app.toast.dismiss();

            await app.header.verifyAccountName(firstName);
            await app.spTrustBadge.verifyLoaded();

            await app.spTrustBadge.clickTrustBadge();

            await app.spTrustBadge.verifyHidden();
            await app.spPreferenceCenter.verifyLoaded();

            await app.spPreferenceCenter.advertising.verifyLoaded();
            await app.spPreferenceCenter.advertising.verifyCheckboxChecked();

            await app.spPreferenceCenter.analytics.verifyLoaded();
            await app.spPreferenceCenter.analytics.verifyCheckboxChecked();

            await app.spPreferenceCenter.essential.verifyLoaded();
            await app.spPreferenceCenter.essential.verifyCheckboxChecked();
            await app.spPreferenceCenter.essential.verifyCheckboxDisabled();

            await app.spPreferenceCenter.clickCancelButton();

            await app.spPreferenceCenter.verifyHidden();
            await app.spTrustBadge.verifyLoaded();
        });


    test('Login should fail with incorrect password',
        {tag: '@auth'}, async ({app, config}) => {
            await app.loginPage.open();
            await app.loginPage.verifyLoaded();

            await app.loginPage.fillUsername(config.APP_USERNAME);
            await app.loginPage.fillPassword(faker.internet.password(passwordOptions));
            await app.loginPage.clickSubmitButton();

            await app.loginPage.verifyLoginErrorVisible('Invalid email or password');
        });


    test('Login should fail with unregistered email',
        {tag: '@auth'}, async ({app}) => {
            await app.loginPage.open();
            await app.loginPage.verifyLoaded();

            await app.loginPage.fillUsername(faker.internet.email());
            await app.loginPage.fillPassword(faker.internet.password(passwordOptions));
            await app.loginPage.clickSubmitButton();

            await app.loginPage.verifyLoginErrorVisible('Invalid email or password');
        });


    test('Login form should show validation errors when submitted empty',
        {tag: '@auth'}, async ({app}) => {
            await app.loginPage.open();
            await app.loginPage.verifyLoaded();

            await app.loginPage.clickSubmitButton();

            await app.loginPage.verifyLoginErrorVisible('Please correct the errors above');
        });


    test('Register should fail when passwords do not match',
        {tag: '@auth'}, async ({app}) => {

            const password = faker.internet.password({...passwordOptions, prefix: 'Aa1'});
            const differentPassword = faker.internet.password({...passwordOptions, prefix: 'Bb2'});

            await app.createAccountPage.open();
            await app.createAccountPage.verifyLoaded();

            await app.createAccountPage.fillFullName(faker.person.fullName());
            await app.createAccountPage.fillEmail(faker.internet.email());
            await app.createAccountPage.fillPassword(password);
            await app.createAccountPage.fillConfirmPassword(differentPassword);
            await app.createAccountPage.clickSubmitButton();

            await app.createAccountPage.verifyErrorVisible('Passwords do not match');
        });


    test('Register should fail with already registered email',
        {tag: '@auth'}, async ({app, config}) => {
            const password = faker.internet.password(passwordOptions);

            await app.createAccountPage.open();
            await app.createAccountPage.verifyLoaded();

            await app.createAccountPage.fillFullName(faker.person.fullName());
            await app.createAccountPage.fillEmail(config.APP_USERNAME);
            await app.createAccountPage.fillPassword(password);
            await app.createAccountPage.fillConfirmPassword(password);
            await app.createAccountPage.clickSubmitButton();

            await app.createAccountPage.verifyErrorVisible('An account with that email already exists');
        });


    test('Register form should show validation errors when submitted empty',
        {tag: '@auth'}, async ({app}) => {
            await app.createAccountPage.open();
            await app.createAccountPage.verifyLoaded();

            await app.createAccountPage.clickSubmitButton();

            await app.createAccountPage.verifyErrorVisible('Please correct the errors above');
        });


    test('"Sign in" link on register page should navigate to login',
        {tag: '@auth'}, async ({app}) => {
            await app.createAccountPage.open();
            await app.createAccountPage.verifyLoaded();

            await app.createAccountPage.clickSignInLink();

            await app.loginPage.verifyLoaded();
        });


    test('"Create account" link on login page should navigate to register',
        {tag: '@auth'}, async ({app}) => {
            await app.loginPage.open();
            await app.loginPage.verifyLoaded();

            await app.loginPage.clickCreateAccountLink();

            await app.createAccountPage.verifyLoaded();
        });

});