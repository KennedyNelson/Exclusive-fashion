# Exlusive-fashion

<!-- stripe listen --forward-to localhost:3000/api/webhook -->

<!-- // GOOGLE_ID: process.env.GOOGLE_ID,
// GOOGLE_SECRET: process.env.GOOGLE_SECRET,
// STRIPE_SECRET_KEY:process.env.STRIPE_SECRET_KEY,
// STRIPE_SIGNING_SECRET:process.env.STRIPE_SIGNING_SECRET,
// FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
// FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
// FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
// FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
// FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
// FIREBASE_APP_ID: process.env.FIREBASE_APP_ID, -->

## Objective

- The main objective of this application is to provide an ecommerce application where people can get their hands on exclusive fashion clothing.
- This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Description

- Using firebase for authentication, Fake Store API for product informations, stripe for payment process, firebase and firebase-admin for collecting order informations and TailwindCSS for styling.

## Project Link

#### You can reach my project here (coming soon) 👈

### Project Skeleton

```
Kenny's fashion (folder)
|----readme.md
SOLUTION
├── components
│    ├── Banner.jsx
│    ├── CheckoutProduct.jsx
│    ├── Header.jsx
│    ├── Order.jsx
│    ├── Product.jsx
│    └── ProductFeed.js
├── pages
│    ├── api
│    │    ├─── auth
│    │    │      └── [...nextauth].js
│    │    ├─── create-checkout-session.js
│    │    └─── webhook.js
│    ├── _app.js
│    ├── _document.js
│    ├── checkout.js
│    ├── index.js
│    ├── orders.js
│    └── success.js
├── public
│    ├── app_logo.png
│    ├── favicon.ico
│    ├── logo.svg
│    └── prime_banner.jpg
├── slices
│    └── cartSlice.js
├── styles
│    └── global.css
├── .gitignore
├── .env.local
├── firebase.js
├── next.config.js
├── package.json
├── postcss.config.js
├── store.js
├── stripe.exe
├── tailwind.config.js
└── yarn.lock
```

### At the end of the project, following topics are to be covered;

- HTML
- CSS
- JavaScript
- ReactJS
- NextJS
- TailwindCSS
- redux-toolkit
- firebase
- firebase-admin
- momentjs
- date-fns
- responsive-carousel
- react-currency-formatter
- heroicons
- bar-of-progress

To run this project;

- URL's
  - Specify your urls in .env.local
- Stripe Keys
  - Signup https://stripe.com/ and create new account.
  - Copy your STRIPE_PUBLIC_KEY and STRIPE_SECRET_KEY.
  - For STRIPE_SIGNING_SECRET from developers page, create webhook and copy your secret key
- Firebase Keys:
  - Go to https://console.firebase.google.com/ and create new web app.
  - From your firebaseConfig copy:
  ```js
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  ```
  - Go to `https://console.cloud.google.com/apis/credentials` page and from OAuth 2.0 Client IDs add your projects links to `Authorized JavaScript origins` and `Authorized redirect URIs`
- For Firebase admin
  - Go to your firebase/console and create new firebase database and generate your new private key, rename your file to `firebasePermissions` and move to your project file
- And finally for webhook:
  - From `https://stripe.com/docs/stripe-cli` page download Stripe CLI and move to project folder.
  - Open new terminal for webhook, run `stripe listen --forward-to localhost:3000/api/webhook` and copy your signing secret from terminal and create your `STRIPE_SIGNING_SECRET`.

After these you can run the project as usual =>

```
$ git clone https://github.com/KennedyNelson/Exclusive-fashion.git
$ cd ./Exclusive-fashion
$ npm install / yarn
$ npm run dev / yarn dev

Open http://localhost:3000 with your browser to see the result.
```
