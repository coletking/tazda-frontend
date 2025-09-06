import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Auth App - Secure Authentication',
  description: 'A secure authentication system built with Next.js and AWS Lambda',
  keywords: 'authentication, login, register, security, nextjs, aws',
  authors: [{ name: 'Julius Kingsley' }],
  creator: 'Julius Kingsley',
  publisher: 'Your Company',
  robots: 'index, follow',
};

// ✅ Move viewport here instead of inside metadata
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
