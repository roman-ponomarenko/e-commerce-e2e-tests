import {bool, cleanEnv, num, str, url} from 'envalid';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const config = cleanEnv(process.env, {
    APP_URL: url(),
    LOGIN_PAGE_PATH: str(),
    REGISTER_PAGE_PATH: str(),
    PRODUCTS_PAGE_PATH: str(),
    CART_PAGE_PATH: str(),
    CHECKOUT_PAGE_PATH: str(),
    ACCOUNT_PAGE_PATH: str(),
    CONFIRMATION_PAGE_PATH: str(),

    APP_USERNAME: str(),
    APP_PASSWORD: str(),

    CI: bool(),

    PW_MAX_RETRIES: num({ choices: [1, 2, 3, 4] }),
    PW_WORKERS: num({ choices: [1, 2, 3, 4] }),
    PW_SLOW_MO: num({ default: 0 }),
});

export type Config = typeof config;
export default config;