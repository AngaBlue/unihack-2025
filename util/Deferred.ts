/**
 * @class Deferred
 * @description A class that extends the Promise behavior to allow for resolving and rejecting outside of the promise context.
 */
export default class Deferred<T = void> {
	promise: Promise<T>;

	/**
	 * Resolve the promise with the given value.
	 * @param value The value to resolve the promise with.
	 */
	resolve?(value?: T | PromiseLike<T> | undefined): void;

	/**
	 * Reject the promise with the given reason.
	 * @param reason The reason to reject the promise with.
	 */
	reject?(reason?: Error): void;
	constructor() {
		// Construct a new promise, and store its resolve and reject functions.
		this.promise = new Promise<T>((resolve, reject) => {
			this.reject = reject;
			this.resolve = resolve;
		});
	}
}
