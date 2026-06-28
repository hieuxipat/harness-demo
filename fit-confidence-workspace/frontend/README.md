# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Configuration

Create a `.env` file

- Rename the [.env.sample](.env.sample) file to `.env` to fix it.

## Installation

```sh
# 1. download all libraries
yarn
# 2. Run project in localhost
yarn dev
```

## Features

We create this boilerplate using TypeScript + Vite default boilerplate with the following add-on features:

- **_Redux toolkit - React-persist_** :State management
- **_Shopify/Polaris - Shopify/Polaris-Icon_** :UI library
- **_@shopify/polaris-viz_** :Chart
- **_@shopify/react-form_** :Validate form
- **_Axios_** :Call API
- **_dotenv_** :Read data from file .env
- **_react-error-boundary_** :Catch error from project
- **_react-router-dom_** :Routes
- **_styled-components_** :Css
- **_prettier_** :Format code
- **_eslint_** :Clean code
  ...

Please check the `package.json` for more details.

```js
src/ // the source code of the application
│  ├─ apis/
│  ├─ assets/
│  ├─ components/
│  ├─ constants/
│  ├─ helpers/
│  ├─ hooks/
│  ├─ icons/
│  ├─ interfaces/
│  ├─ layout/
│  │  ├─ Sidebar/
│  │  │  ├─ index.tsx/
│  │  │  ├─ styled.ts/
│  │  ├─ Navbar/
│  │  │  ├─ index.tsx/
│  │  │  ├─ styled.ts/
│  │  ├─ Footer/
│  │  │  ├─ index.tsx/
│  │  │  ├─ styled.ts/
│  │  ├─ index.tsx/
│  │  ├─ styled.ts/
│  ├─ pages/
│  │  ├─ Example/
│  │  │  ├─ components/
│  │  │  │  ├─ components/
│  │  │  │  │  ├─ ChildExample/
│  │  │  │  │  │  ├─ index.tsx/
│  │  │  │  │  │  ├─ styled.ts/
│  │  │  │  │  │  ├─ config.ts/
│  │  │  ├─ index.tsx/
│  │  │  ├─ styled.ts/
│  │  │  ├─ config.ts/
│  ├─ redux/
│  │  ├─ api/
│  │  │  ├─ fetchBase.ts/
│  │  │  ├─ auth.caller.ts/
│  │  │  ├─ example.caller.ts/
│  │  ├─ feature/
│  │  │  ├─ auth.slice.ts/
│  │  │  ├─ example.slice.ts/
│  │  ├─ persist.config.ts/
│  │  ├─ store/
│  ├─ routes/
```
