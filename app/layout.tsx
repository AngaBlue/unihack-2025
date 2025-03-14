import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import createMetadata from '@/util/createMetadata';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
});

export const metadata = createMetadata();

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased w-screen h-screen overflow-hidden`}>{children}</body>
		</html>
	);
}
