'use client';
import { useEffect } from 'react';
import useSound from 'use-sound';

const db = (x: number) => 10 ** (x / 10)

const BASE_VOLUME = 0.3;
const OWL_VOLUME = BASE_VOLUME * db(-5);
const MUSIC_VOLUME = BASE_VOLUME * db(1);
const BIRDS_VOLUME = BASE_VOLUME * db(-13);
const BUBBLES_VOLUME = BASE_VOLUME * db(-13);

export default function BackgroundMusic() {
	const [playMusic, { stop: stopMusic }] = useSound('/sounds/music.mp3', { loop: true, volume: MUSIC_VOLUME });
	const [playOwl1] = useSound('/sounds/owl-1.mp3', { volume: OWL_VOLUME });
	const [playOwl2] = useSound('/sounds/owl-2.mp3', { volume: OWL_VOLUME });
	const [playBird1] = useSound('/sounds/bird_rain_1.mp3', { volume: BIRDS_VOLUME });
	const [playBird2] = useSound('/sounds/bird_rain_2.mp3', { volume: BIRDS_VOLUME });
	const [playBird3] = useSound('/sounds/bird_rain_3.mp3', { volume: BIRDS_VOLUME });
	const [playBird4] = useSound('/sounds/bird_rain_4.mp3', { volume: BIRDS_VOLUME });
	const [playBird5] = useSound('/sounds/bird_rain_5.mp3', { volume: BIRDS_VOLUME });
	const [playBubbles] = useSound('/sounds/bubbles.mp3', { volume: BUBBLES_VOLUME });

	// Background Music
	useEffect(() => {
		const play = () => playMusic();
		document.addEventListener('click', () => play, { once: true });
		play();
		return () => {
			stopMusic();
			document.removeEventListener('click', play);
		};
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

	// Bird Rain
	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout> | null = null;
		const birdSounds = [playBird1, playBird2, playBird3, playBird4, playBird5];
		const playRandomEffect = () => {
			const MIN = 8_000;
			const MAX = 18_000;
			const randomTime = Math.random() * (MAX - MIN) + MIN;
			timeout = setTimeout(() => {
				const randomBird = birdSounds[Math.floor(Math.random() * birdSounds.length)];
				randomBird();
				playRandomEffect();
			}, randomTime);
		};

		playRandomEffect();
		return () => {
			if (timeout) clearTimeout(timeout);
		};
	}, [playBird1, playBird2, playBird3, playBird4, playBird5]);

	// Bubbles
	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout> | null = null;
		const playRandomEffect = () => {
			const MIN = 20_000;
			const MAX = 30_000;
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
	});

	return null;
}
