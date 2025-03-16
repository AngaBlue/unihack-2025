import { Playpen_Sans } from 'next/font/google';
import './globals.css';
import createMetadata from '@/util/createMetadata';


const geistMono = Playpen_Sans({
	// variable: '--font-geist-mono',
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
			<body className={`${geistMono.className} antialiased w-screen h-screen overflow-hidden`}>
				{children}</body>
		</html>
	);
}
