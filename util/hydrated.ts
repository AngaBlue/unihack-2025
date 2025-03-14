import Deferred from './Deferred';

export let hydrated = false;
export const hydration = new Deferred<void>();

/**
 * Returns true if the page has been hydrated and false if not.
 */
export function hydrate() {
	if (!hydrated) {
		hydrated = true;
		hydration.resolve?.();
	}
}
