'use client';
import { useEffect } from 'react';
import useSound from 'use-sound';

export default function BackgroundMusic() {
	const [playMusic] = useSound('/sounds/music.mp3', { loop: true });
	const [playOwl1] = useSound('/sounds/owl-1.mp3');
	const [playOwl2] = useSound('/sounds/owl-2.mp3');

	useEffect(() => {
		const playAudio = () => playMusic();
		document.addEventListener('click', playAudio, { once: true });
		return () => document.removeEventListener('click', playAudio);
	}, [playMusic]);

	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout> | null = null;
		const playRandomEffect = () => {
			const MIN = 5_000
			const MAX = 15_000
			const randomTime = Math.random() * (MAX - MIN) + MIN;
			timeout = setTimeout(() => {
				Math.random() > 0.5 ? playOwl1() : playOwl2();
				playRandomEffect();
			}, randomTime);
		};

		playRandomEffect();
		return () => {
			if (timeout) clearTimeout(timeout);
		}
	}, [playOwl1, playOwl2]);

	return null;
}
