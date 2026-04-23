import {test} from "@/app/app.fixture";

test.describe('Cookie Consent tests', () => {

    test('Accepting all cookies should hide the banner and show the trust badge',
        {tag: '@cookie'}, async ({app}) => {
            await app.homePage.open();
            await app.homePage.verifyLoaded();

            await app.spCookieBanner.verifyLoaded();
            await app.spCookieBanner.verifyAcceptAllButtonVisible();
            await app.spCookieBanner.verifySaveButtonIsNotVisible();
            await app.spCookieBanner.verifyDeclineButtonVisible();
            await app.spCookieBanner.verifyCustomizeButtonVisible();
            await app.spCookieBanner.verifyPrivacyPolicyLinkVisible();
            await app.spCookieBanner.verifyPersonalSettingsLinkVisible();

            await app.spCookieBanner.clickAcceptAllButton();
            await app.spCookieBanner.verifyHidden();

            await app.spTrustBadge.verifyLoaded();
            await app.spTrustBadge.clickTrustBadge();
            await app.spTrustBadge.verifyHidden();

            await app.spPreferenceCenter.verifyLoaded();

            await app.spPreferenceCenter.advertising.verifyLoaded();
            await app.spPreferenceCenter.advertising.verifyCheckboxChecked();
            await app.spPreferenceCenter.advertising.clickCheckbox();
            await app.spPreferenceCenter.advertising.verifyCheckboxUnchecked();

            await app.spPreferenceCenter.analytics.verifyLoaded();
            await app.spPreferenceCenter.analytics.verifyCheckboxChecked();
            await app.spPreferenceCenter.analytics.clickCheckbox();
            await app.spPreferenceCenter.analytics.verifyCheckboxUnchecked();

            await app.spPreferenceCenter.essential.verifyLoaded();
            await app.spPreferenceCenter.essential.verifyCheckboxChecked();
            await app.spPreferenceCenter.essential.verifyCheckboxDisabled();

            await app.spPreferenceCenter.clickSaveButton();
            await app.spPreferenceCenter.verifyHidden();

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
        });


    test('Declining cookies should hide the banner and show the trust badge',
        {tag: '@cookie'}, async ({app}) => {
            await app.homePage.open();
            await app.homePage.verifyLoaded();

            await app.spCookieBanner.verifyLoaded();
            await app.spCookieBanner.clickDeclineButton();
            await app.spCookieBanner.verifyHidden();

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
        });


    test('Customising and saving preferences should hide the banner and show the trust badge',
        {tag: '@cookie'}, async ({app}) => {
            await app.homePage.open();
            await app.homePage.verifyLoaded();

            await app.spCookieBanner.verifyLoaded();
            await app.spCookieBanner.clickCustomizeButton();
            await app.spCookieBanner.verifyHidden();

            await app.spPreferenceCenter.verifyLoaded();

            await app.spPreferenceCenter.advertising.verifyLoaded();
            await app.spPreferenceCenter.advertising.verifyCheckboxChecked();

            await app.spPreferenceCenter.analytics.verifyLoaded();
            await app.spPreferenceCenter.analytics.verifyCheckboxChecked();
            await app.spPreferenceCenter.analytics.clickCheckbox();
            await app.spPreferenceCenter.analytics.verifyCheckboxUnchecked();

            await app.spPreferenceCenter.essential.verifyLoaded();
            await app.spPreferenceCenter.essential.verifyCheckboxChecked();
            await app.spPreferenceCenter.essential.verifyCheckboxDisabled();

            await app.spPreferenceCenter.clickSaveButton();
            await app.spPreferenceCenter.verifyHidden();

            await app.homePage.verifyLoaded();
            await app.spTrustBadge.verifyLoaded();

            await app.spTrustBadge.clickTrustBadge();

            await app.spPreferenceCenter.advertising.verifyLoaded();
            await app.spPreferenceCenter.advertising.verifyCheckboxChecked();

            await app.spPreferenceCenter.analytics.verifyLoaded();
            await app.spPreferenceCenter.analytics.verifyCheckboxUnchecked();

            await app.spPreferenceCenter.essential.verifyLoaded();
            await app.spPreferenceCenter.essential.verifyCheckboxChecked();
            await app.spPreferenceCenter.essential.verifyCheckboxDisabled();
        });


    test('Cookie consent preferences should persist after page reload',
        {tag: '@cookie'}, async ({app}) => {
            await app.homePage.open();
            await app.homePage.verifyLoaded();

            await app.spCookieBanner.verifyLoaded();
            await app.spCookieBanner.clickAcceptAllButton();
            await app.spCookieBanner.verifyHidden();

            await app.homePage.reloadPage();
            await app.homePage.verifyLoaded();

            await app.spCookieBanner.verifyHidden();
            await app.spTrustBadge.verifyLoaded();

            await app.spTrustBadge.clickTrustBadge();

            await app.spPreferenceCenter.verifyLoaded();

            await app.spPreferenceCenter.advertising.verifyLoaded();
            await app.spPreferenceCenter.advertising.verifyCheckboxChecked();
            await app.spPreferenceCenter.advertising.clickCheckbox();
            await app.spPreferenceCenter.advertising.verifyCheckboxUnchecked();

            await app.spPreferenceCenter.analytics.verifyLoaded();
            await app.spPreferenceCenter.analytics.verifyCheckboxChecked();

            await app.spPreferenceCenter.essential.verifyLoaded();
            await app.spPreferenceCenter.essential.verifyCheckboxChecked();
            await app.spPreferenceCenter.essential.verifyCheckboxDisabled();

            await app.spPreferenceCenter.clickSaveButton();
            await app.spPreferenceCenter.verifyHidden();

            await app.homePage.reloadPage();

            await app.spTrustBadge.verifyLoaded();

            await app.spTrustBadge.clickTrustBadge();

            await app.spPreferenceCenter.verifyLoaded();

            await app.spPreferenceCenter.advertising.verifyLoaded();
            await app.spPreferenceCenter.advertising.verifyCheckboxUnchecked();

            await app.spPreferenceCenter.analytics.verifyLoaded();
            await app.spPreferenceCenter.analytics.verifyCheckboxChecked();

            await app.spPreferenceCenter.essential.verifyLoaded();
            await app.spPreferenceCenter.essential.verifyCheckboxChecked();
            await app.spPreferenceCenter.essential.verifyCheckboxDisabled();
        });


    test('Cookie banner should reappear after consent storage is cleared',
        {tag: '@cookie'}, async ({app}) => {
            await app.homePage.open();
            await app.homePage.verifyLoaded();

            await app.spCookieBanner.verifyLoaded();
            await app.spCookieBanner.clickAcceptAllButton();
            await app.spCookieBanner.verifyHidden();

            await app.spTrustBadge.verifyLoaded();

            await app.homePage.clearLocalStorage();
            await app.homePage.reloadPage();

            await app.homePage.verifyLoaded();
            await app.spCookieBanner.verifyLoaded();
            await app.spTrustBadge.verifyHidden();
        });

});