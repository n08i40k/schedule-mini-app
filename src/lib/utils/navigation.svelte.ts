import { afterNavigate, beforeNavigate } from "$app/navigation";

export class NavigationObserver {
	private _isNavigating: boolean = $state(false);

	get isNavigating(): boolean {
		 return this._isNavigating;
	}

	constructor() {
		beforeNavigate(() => this._isNavigating = true);
		afterNavigate(() => this._isNavigating = false);
	}
}