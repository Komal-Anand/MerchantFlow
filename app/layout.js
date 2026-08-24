import './globals.css';
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'MerchantFlow — Connect Intent. Drive Growth.',
  description:
    'MerchantFlow is an AI-powered agentic commerce platform that connects customer intent to Razorpay checkout through intelligent product discovery and recommendations.',
  keywords: ['AI commerce', 'agentic commerce', 'Razorpay', 'product discovery', 'merchant growth'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main id="main-content">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
