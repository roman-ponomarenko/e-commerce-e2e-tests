import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default tseslint.config(
    {
        linterOptions: {
            reportUnusedDisableDirectives: 'error',
        },
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/no-misused-promises': 'error',
            '@typescript-eslint/array-type': ['error', {default: 'array'}],
            '@typescript-eslint/consistent-type-imports': ['error', {prefer: 'type-imports'}],
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
    {
        files: ['tests/**/*.ts'],
        ...playwright.configs['flat/recommended'],
        rules: {
            ...playwright.configs['flat/recommended'].rules,
            'playwright/expect-expect': 'off',
            'playwright/no-skipped-test': 'off',
        },
    },
    {
        files: ['src/utils/step-decorator.ts'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
        },
    },
    {
        ignores: ['dist/', 'node_modules/', 'test-results/', 'playwright-report/'],
    },
);
