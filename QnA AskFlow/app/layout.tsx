import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'AskFlow',
  description: 'Two-sided Q&A platform for a classroom setting.',
  openGraph: {
    title: 'AskFlow',
    description: 'Two-sided Q&A platform for a classroom setting.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AskFlow',
    description: 'Two-sided Q&A platform for a classroom setting.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
