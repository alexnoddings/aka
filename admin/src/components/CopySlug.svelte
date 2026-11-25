<script lang="ts">
	import OcticonCopy from '$/icons/OcticonCopy.svelte';
	import OcticonCheck from '$/icons/OcticonCheck.svelte';

	interface Props {
		slug: string;
	}
	let { slug }: Props = $props();

	let status = $state<'idle' | 'copied' | 'failed'>('idle');
	let resetTimer: ReturnType<typeof setTimeout> | undefined;

	async function copy() {
		clearTimeout(resetTimer);
		try {
			await navigator.clipboard.writeText(slug);
			status = 'copied';
		} catch {
			status = 'failed';
		}
		resetTimer = setTimeout(() => (status = 'idle'), 1500);
	}
</script>

<button
	type="button"
	class="copy-slug"
	class:copy-slug--copied={status === 'copied'}
	class:copy-slug--failed={status === 'failed'}
	onclick={copy}
	aria-label="Copy slug {slug}"
	title={status === 'failed' ? 'Could not copy' : 'Copy slug'}
>
	{#if status === 'copied'}
		<OcticonCheck />
	{:else}
		<OcticonCopy />
	{/if}
</button>
<span class="copy-slug__status" aria-live="polite">
	{#if status === 'copied'}
		Copied {slug}
	{:else if status === 'failed'}
		Could not copy slug
	{/if}
</span>

<style>
	.copy-slug {
		display: inline-flex;
		align-items: center;
		justify-content: center;

		color: var(--color-text-muted);
		cursor: pointer;

		background: transparent;
		border: 1px solid transparent;
		border-radius: var(--border-radius);
		padding: calc(var(--spacing) / 2);

		&:hover {
			color: var(--color-text);
			background: var(--color-surface-hover);
			border-color: var(--color-border);
		}

		&:focus-visible {
			outline: 2px solid var(--color-primary);
		}
	}

	.copy-slug--copied {
		color: var(--color-success);

		&:hover {
			color: var(--color-success);
		}
	}

	.copy-slug--failed {
		color: var(--color-error);

		&:hover {
			color: var(--color-error);
		}
	}

	.copy-slug__status {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;

		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
</style>
