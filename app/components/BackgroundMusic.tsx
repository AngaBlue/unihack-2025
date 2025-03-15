'use client';
import { useEffect, useRef } from 'react';

export default function BackgroundMusic() {
	const audioRef = useRef<HTMLAudioElement>(null);

	useEffect(() => {
		if (!audioRef.current) return;
		const playAudio = () => {
			audioRef.current?.play().catch(error => console.error('Audio play failed', error));
		};

		document.addEventListener('click', playAudio, { once: true });
		audioRef.current.play().catch(error => console.error('Audio play failed', error));
		return () => {
			document.removeEventListener('click', playAudio);
			audioRef.current?.pause();
		};
	}, [audioRef]);

	return (
		// biome-ignore lint/a11y/useMediaCaption: <explanation>
		<audio ref={audioRef} loop autoPlay>
			<source src='/sounds/happy_loop.mp3' type='audio/mp3' />
			Your browser does not support the audio element.
		</audio>
	);
}
