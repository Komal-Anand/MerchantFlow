This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:
# MerchantFlow

### Connect intent. Drive growth.

MerchantFlow is an AI-powered commerce experience that helps shoppers discover relevant products, make confident decisions, and complete checkout in one focused flow.

## Live Demo

Visit the deployed app: **[merchant-flow-woad.vercel.app](https://merchant-flow-woad.vercel.app)**

## Highlights

- AI shopping assistant for natural-language product discovery
- Product catalog with category browsing, search, and recommendations
- Product details modal with quick-add cart actions
- Cart and checkout experience with Razorpay integration support
- Orders and order confirmation views
- Growth intelligence dashboard with KPIs, revenue charts, customer intent, and cross-sell insights
- Responsive interface for desktop and mobile screens

## Tech Stack

- [Next.js](https://nextjs.org/) 16 with the App Router
- React 19
- CSS Modules and a shared design system
- Gemini API for AI recommendations
- Razorpay API for payment order creation and verification
- Vercel for deployment

## Run Locally

Requirements: Node.js 18 or newer.

```bash
	npm install
	npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file in the project root. The AI and payment integrations are optional during development.

```env
GEMINI_API_KEY=your_gemini_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Keep `.env.local` private. It is excluded from Git by `.gitignore` and should never be committed or added to a public repository.

Without `GEMINI_API_KEY`, the assistant uses the local catalog search fallback. Without Razorpay keys, checkout remains in demo mode.

## Project Structure

```text
app/          Pages and API routes
components/   Shared UI components
context/      Cart state management
lib/          Product data and assistant logic
public/       Static assets and product images
```

## Production Build

```bash
	npm run build
	npm run start
```

## Repository

[github.com/Komal-Anand/MerchantFlow](https://github.com/Komal-Anand/MerchantFlow)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
