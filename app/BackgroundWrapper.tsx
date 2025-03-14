import type { ReactNode } from 'react';

interface BackgroundWrapperProps {
	children: ReactNode;
}

export default function BackgroundWrapper({ children }: BackgroundWrapperProps) {
	return <div>{children}</div>;
}
