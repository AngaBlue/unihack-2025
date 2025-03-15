'use client';
import { useEffect } from 'react';
import useSound from 'use-sound';

const BASE_VOLUME = 0.5;
const MUSIC_VOLUME = 1.5 * BASE_VOLUME;
const BUBBLES_VOLUME = 0.5 * BASE_VOLUME;

export default function BackgroundMusic() {
	const [playMusic, { stop: stopMusic }] = useSound('/sounds/music.mp3', { loop: true, volume: MUSIC_VOLUME });
	const [playOwl1] = useSound('/sounds/owl-1.mp3', { volume: BASE_VOLUME });
	const [playOwl2] = useSound('/sounds/owl-2.mp3', { volume: BASE_VOLUME });
	const [playBubbles] = useSound('/sounds/bubbles.mp3', { volume: BUBBLES_VOLUME });

	// Background Music
	useEffect(() => {
		const play = () => playMusic();
		document.addEventListener('click', () => play, { once: true });
		play();
		return () => {
			stopMusic();
			document.removeEventListener('click', play);
		}
	}, [playMusic, stopMusic]);

	// Owls
	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout> | null = null;
		const playRandomEffect = () => {
			const MIN = 5_000;
			const MAX = 15_000;
			const randomTime = Math.random() * (MAX - MIN) + MIN;
			timeout = setTimeout(() => {
				Math.random() > 0.5 ? playOwl1() : playOwl2();
				playRandomEffect();
			}, randomTime);
		};

		playRandomEffect();
		return () => {
			if (timeout) clearTimeout(timeout);
		};
	}, [playOwl1, playOwl2]);

	// Bubbles
	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout> | null = null;
		const playRandomEffect = () => {
			const MIN = 10_000;
			const MAX = 20_000;
			const randomTime = Math.random() * (MAX - MIN) + MIN;
			timeout = setTimeout(() => {
				playBubbles();
				playRandomEffect();
			}, randomTime);
		};

		playRandomEffect();
		return () => {
			if (timeout) clearTimeout(timeout);
		};
	})

	return null;
}
