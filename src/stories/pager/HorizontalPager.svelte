<script lang="ts">
	import { onDestroy, onMount, type Snippet } from "svelte";
	import { Spring } from "svelte/motion";

	interface Props {
		page?: number;
		onselect?: (page: number) => void;

		items: Array<unknown>;
		itemSnippet: Snippet<[unknown]>;

		pageMargin?: number;
		loading?: boolean;
	}

	const { page = 0, onselect, pageMargin = 2, items, itemSnippet, loading }: Props = $props();

	function clamp(v: number, min: number, max: number): number {
		return Math.max(min, Math.min(max, v));
	}

	class Drag {
		held = $state(false);
		spring = new Spring(page, { precision: 0.001 });

		previousMovementX = $state(0);
		isFirstMovement = $state(true);

		reset() {
			this.held = false;
			this.previousMovementX = 0;
			this.isFirstMovement = true;
		}
	}

	class Pager {
		element?: HTMLDivElement;

		width = $state(0);
		height = new Spring(100);

		pages = $derived(this.element?.children.length || 0);

		recalcHeight() {
			const children = this.element!.children;

			const minHeight = children.item(~~drag.spring.current)!.clientHeight;
			const maxHeight = children.item(~~drag.spring.current + 1)?.clientHeight || minHeight;

			const lerp = drag.spring.current - ~~drag.spring.current; // 0 - min | 1 - max
			this.height.target = minHeight + (maxHeight - minHeight) * lerp;
		}
	}

	class ViewAhead {
		static AHEAD_RANGE = 1;

		private _pager: Pager;

		start = $state(0);
		end = $state(0);

		constructor(pager: Pager) {
			this._pager = pager;
		}

		private _onHide(page: HTMLElement) {
			page.hidden = true;
			page.style.position = "none";
			page.style.left = "none";
		}

		private _onShow(page: HTMLElement) {
			page.hidden = false;
			page.style.position = "absolute";
		}

		recalc(offset: number) {
			const calcStart = clamp(Math.floor(offset) - ViewAhead.AHEAD_RANGE, 0, this._pager.pages);
			const calcEnd = clamp(Math.ceil(offset) + ViewAhead.AHEAD_RANGE + 1, 0, this._pager.pages);

			const children = this._pager.element!.children;

			// блять.

			if (this.start === 0 && this.end === 0 && (calcStart !== 0 || calcEnd !== 0)) {
				this.start = calcStart;
				this.end = calcEnd;

				for (let i = 0; i < this._pager.pages; ++i) {
					if (i < this.start || i >= this.end) this._onHide(children.item(i)! as HTMLElement);
					else this._onShow(children.item(i)! as HTMLElement);
				}

				this._pager.recalcHeight();

				return;
			}

			if (this.start > calcStart)
				for (let i = calcStart; i < this.start; ++i) this._onShow(children.item(i)! as HTMLElement);
			else if (this.start < calcStart)
				for (let i = this.start; i < calcStart; ++i) this._onHide(children.item(i)! as HTMLElement);

			if (this.end > calcEnd)
				for (let i = calcEnd; i < this.end; ++i) this._onHide(children.item(i)! as HTMLElement);
			else if (this.end < calcEnd)
				for (let i = this.end; i < calcEnd; ++i) this._onShow(children.item(i)! as HTMLElement);

			this._pager.recalcHeight();

			this.start = calcStart;
			this.end = calcEnd;
		}
	}

	const pager = new Pager();
	const drag = new Drag();
	const viewAhead = new ViewAhead(pager);

	function setOffset(x: number) {
		const children = pager.element!.children;

		for (let i = viewAhead.start; i < viewAhead.end; ++i) {
			const style = (children.item(i)! as HTMLElement).style;

			style.left = `${pager.width * (i - x)}px`;
			style.opacity = (1 - Math.abs(x - i)).toString();
		}
	}

	// recalculate sizes on load
	onMount(() => {
		pager.recalcHeight();
		pager.height.set(pager.height.target, { instant: true });

		viewAhead.recalc(page ?? 0);
	});

	// update pager height by spring value
	$effect(() => {
		pager.element!.style.height = `calc(var(--spacing) * ${pageMargin * 2} + ${pager.height.current}px)`;
	});

	// recalc view ahead when drag spring changed
	$effect(() => {
		viewAhead.recalc(drag.spring.current);
		setOffset(drag.spring.current);
	});

	// observe mutations for child updates
	let mutationObserver: MutationObserver;

	onMount(() => {
		mutationObserver = new MutationObserver(() => pager.recalcHeight());
		mutationObserver.observe(pager.element!, { childList: true, subtree: true });
	});

	onDestroy(() => {
		if (mutationObserver) mutationObserver.disconnect();
	});

	// make all pages have same width
	$effect(() => {
		const width = `calc(${pager.width}px - var(--spacing) * ${pageMargin * 2})`;

		for (const child of pager.element!.children) (child as HTMLElement).style.width = width;
	});

	// update sprint value when external page change
	$effect(() => void (drag.spring.target = page));

	// post event when page selected
	$effect(() => {
		if (drag.held || drag.spring.target != ~~drag.spring.target) return;

		onselect?.call(onselect, drag.spring.target);
	});

	// handle drag start
	function onDown() {
		if (loading) return;

		drag.held = true;
	}

	// handle drag
	function onMove(event: MouseEvent) {
		if (!drag.held) return;

		drag.spring.target -= event.movementX / pager.width;
		drag.spring.target = clamp(drag.spring.target, -0.25, pager.pages - 0.75);
	}

	// handle drag end
	function onUp() {
		if (!drag.held) return;

		if (Math.abs(drag.spring.target - drag.spring.current) < 0.1)
			drag.spring.set(Math.round(drag.spring.target));
		else {
			if (drag.spring.target > drag.spring.current)
				drag.spring.target = Math.ceil(drag.spring.target);
			else drag.spring.target = Math.floor(drag.spring.target);
		}

		drag.spring.target = clamp(drag.spring.target, 0, pager.pages - 1);

		drag.reset();
	}

	let postSSR = $state(true);
	onMount(() => (postSSR = false));
</script>

<svelte:window onpointermove={onMove} onpointerup={onUp} />

<div
	class="relative w-full overflow-clip *:m-2 *:select-none [.loading]:animate-pulse"
	class:loading
	style="touch-action: pan-y pinch-zoom;"
	bind:this={pager.element}
	bind:clientWidth={pager.width}
	onpointerdown={onDown}
>
	{#each items as item, id (id)}
		<div class:hidden={postSSR && ~~drag.spring.current !== id}>{@render itemSnippet(item)}</div>
	{/each}
</div>
