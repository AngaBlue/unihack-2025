import type { Metadata } from 'next';

interface CreateMetadataParams {
	title?: string;
	description?: string;
}

export default function createMetadata(params?: CreateMetadataParams): Metadata {
	const title = params?.title ? `${params.title} | Growth Garden` : 'Growth Garden';
	const description = params?.description ?? 'What does growth mean to you?';

	const metadata: Metadata = {
		title,
		description,
		openGraph: {
			type: 'website',
			title,
			description: description,
			url: 'https://growthgarden.anga.dev/',
			siteName: 'Growth Garden',
			locale: 'en',
			images: 'https://growthgarden.anga.dev/cover.jpg'
		},
		appleWebApp: {
			title: 'Growth Garden'
		},
		twitter: {
			card: 'summary_large_image'
		}
	};

	return metadata;
}
