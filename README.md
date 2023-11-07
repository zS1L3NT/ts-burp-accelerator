# Burp Accelerator

![License](https://img.shields.io/github/license/zS1L3NT/ts-burp-accelerator?style=for-the-badge) ![Languages](https://img.shields.io/github/languages/count/zS1L3NT/ts-burp-accelerator?style=for-the-badge) ![Top Language](https://img.shields.io/github/languages/top/zS1L3NT/ts-burp-accelerator?style=for-the-badge) ![Commit Activity](https://img.shields.io/github/commit-activity/y/zS1L3NT/ts-burp-accelerator?style=for-the-badge) ![Last commit](https://img.shields.io/github/last-commit/zS1L3NT/ts-burp-accelerator?style=for-the-badge)

This is a repository of my solutions to specific PortSwigger Labs which benefit from faster brute-forcing, as well as some reusable utilities to build new solutions. `src/base.ts` contains some reusable base utilities to write solutions, which I plan to modify and enhance as needed. `src/solutions/` contains my solutions to the PortSwigger Labs which require brute-forcing that cannot be done on the community tier alone. 

## Motivation

The Burp Suite Intruder is powerful but the community tier is heavily throttled, making some labs impossible to complete with just the free tier. As a software developer, I also feel very restricted by macros using pre-built functions because it takes away the flexibility of customizing each attack iteration.

## Usage

```
$ bun src/solutions/<solution>.ts
```

## Built with

-	BunJS
	-	TypeScript
        -   [![@typescript-eslint/eslint-plugin](https://img.shields.io/badge/%40typescript--eslint%2Feslint--plugin-latest-red?style=flat-square)](https://npmjs.com/package/@typescript-eslint/eslint-plugin/v/latest)
        -   [![@typescript-eslint/parser](https://img.shields.io/badge/%40typescript--eslint%2Fparser-latest-red?style=flat-square)](https://npmjs.com/package/@typescript-eslint/parser/v/latest)
        -   [![bun-types](https://img.shields.io/badge/bun--types-%5E1.0.7-red?style=flat-square)](https://npmjs.com/package/bun-types/v/1.0.7)
        -   [![typescript](https://img.shields.io/badge/typescript-latest-red?style=flat-square)](https://npmjs.com/package/typescript/v/latest)
	-	ESLint
        -   [![eslint](https://img.shields.io/badge/eslint-latest-red?style=flat-square)](https://npmjs.com/package/eslint/v/latest)
        -   [![eslint-config-prettier](https://img.shields.io/badge/eslint--config--prettier-latest-red?style=flat-square)](https://npmjs.com/package/eslint-config-prettier/v/latest)
        -   [![eslint-plugin-simple-import-sort](https://img.shields.io/badge/eslint--plugin--simple--import--sort-latest-red?style=flat-square)](https://npmjs.com/package/eslint-plugin-simple-import-sort/v/latest)
        -   [![prettier](https://img.shields.io/badge/prettier-latest-red?style=flat-square)](https://npmjs.com/package/prettier/v/latest)