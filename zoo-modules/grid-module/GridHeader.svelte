<svelte:options tag="zoo-grid-header"></svelte:options>
<div class="box" bind:this={gridHeaderRoot} class:sortable={sortable}>
	<slot>{columntitle}</slot>
	<svg class="arrow" sortstate={sortState} on:click="{() => handleSortClick()}" width="24" height="24" viewBox="0 0 24 24">
		<path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
	</svg>
	<svg {reorderable} on:mousedown="{toggleHostDraggable}" class="swap" viewBox="0 0 24 24" width="18" height="18">
		<path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 11l-4 4 4 4v-3h7v-2H7v-3zm14-2l-4-4v3h-7v2h7v3l4-4z"/>
	</svg>
	<svg {columntoggle} class="edit-cols" on:click="{() => handleColumnToggle()}" viewBox="0 0 24 24" width="18" height="18">
		<path d="M0 0h24v24H0V0z" fill="none"/><path d="M14 9l1 1-9 9H5v-1l9-9m4-6h-1l-2 2 4 4 2-2V6l-3-3zm-4 3L3 17v4h4l11-11-4-4z"/>
	</svg>
</div>

<style type='text/scss'>
	@import "variables";

	:host {
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	.box {
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
		padding-right: 10px;

		&:hover {
			.arrow, .swap, .edit-cols {
				opacity: 1;
			}
		}
	}

	.box.sortable .arrow, .swap[reorderable], .edit-cols[columntoggle] {
		display: flex;
	}

	.arrow, .swap, .edit-cols {
		display: none;
		min-width: 20px;
		width: 20px;
		opacity: 0;
		transition: opacity 0.1s;
		margin-left: 5px;
		border-radius: $input-border-radius;
		background: $grey-ultralight;
	}

	.edit-cols {
		cursor: pointer;
	}

	.arrow {
		cursor: pointer;
		transform: rotate(0deg);
	}

	.swap {
		cursor: grab;

		&:active {
			cursor: grabbing;
		}
	}

	.arrow[sortstate='asc'] {
		transform: rotate(180deg);
	}

	.arrow[sortstate='desc'], .arrow[sortstate='asc'] {
		opacity: 1;
		background: $grey-ultralight;
	}

	.box .arrow, .arrow[sortstate='desc'], .arrow[sortstate='asc'] {
		&:active {
			opacity: 0.5;
			transform: translateY(1px);
		}
	}
</style>

<script>
	import { onMount } from 'svelte';
	export let sortState = undefined;
	export let sortable = false;
	export let reorderable = undefined;
	export let columntitle = '';
	export let columntoggle = undefined;
	let gridHeaderRoot;
	let host;

	onMount(() => {
		host = gridHeaderRoot.getRootNode().host;
		host.addEventListener('dragend', () => host.setAttribute('draggable', false));
	});

	const handleSortClick = () => {
		if (!sortState) {
			sortState = 'desc';
		} else if (sortState == 'desc') {
			sortState = 'asc';
		} else if (sortState = 'asc') {
			sortState = undefined;
		}
		host.dispatchEvent(new CustomEvent('sortChange', {detail: {sortState: sortState, header: host}, bubbles: true}));
	}

	// todo what if user never starts drag
	const toggleHostDraggable = () => host.setAttribute('draggable', true);

	const handleColumnToggle = () => {
		host.dispatchEvent(new CustomEvent('columnToggle', {bubbles: true}));
	}

</script>