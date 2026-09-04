import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Canoe Layout Planner',
  description: 'Interactive buoyancy and material-planning tools for EGGN 1910 students.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
