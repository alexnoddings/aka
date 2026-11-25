<script lang="ts">
	import OcticonCopy from '$/icons/OcticonCopy.svelte';
	import OcticonCheck from '$/icons/OcticonCheck.svelte';

	interface Props {
		title: string;
		json: string;
	}
	let { title, json }: Props = $props();

	let dialog: HTMLDialogElement | undefined = $state();
	let status = $state<'idle' | 'copied' | 'failed'>('idle');
	let resetTimer: ReturnType<typeof setTimeout> | undefined;

	export function open() {
		status = 'idle';
		dialog?.showModal();
	}

	function close() {
		dialog?.close();
	}

	async function copy() {
		clearTimeout(resetTimer);
		try {
			await navigator.clipboard.writeText(json);
			status = 'copied';
		} catch {
			status = 'failed';
		}
		resetTimer = setTimeout(() => (status = 'idle'), 1500);
	}

	// Close when clicking the backdrop (the dialog element itself, outside its content)
	function onDialogClick(event: MouseEvent) {
		if (event.target === dialog) close();
	}
</script>

<dialog bind:this={dialog} class="export-dialog" aria-labelledby="export-dialog-title" onclick={onDialogClick}>
	<div class="export-dialog__content">
		<div class="export-dialog__header">
			<h2 id="export-dialog-title" class="export-dialog__title">{title}</h2>
		</div>
		<pre class="export-dialog__code"><code>{json}</code></pre>
		<div class="export-dialog__actions">
			<span class="export-dialog__status" aria-live="polite">
				{#if status === 'copied'}
					Copied to clipboard
				{:else if status === 'failed'}
					Could not copy
				{/if}
			</span>
			<span class="spacer"></span>
			<button type="button" class="button button--text button-lg" onclick={close}>Close</button>
			<button type="button" class="button button--primary button-lg" onclick={copy}>
				{#if status === 'copied'}
					<OcticonCheck />
				{:else}
					<OcticonCopy />
				{/if}
				Copy to clipboard
			</button>
		</div>
	</div>
</dialog>

<style>
	.export-dialog {
		width: min(36rem, calc(100vw - calc(var(--spacing) * 8)));
		max-height: calc(100vh - calc(var(--spacing) * 16));
		margin: auto;
		padding: 0;

		color: var(--color-text);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: calc(var(--border-radius) * 2);

		&::backdrop {
			background: rgb(0 0 0 / 0.4);
		}
	}

	.export-dialog__content {
		display: flex;
		flex-direction: column;
		gap: calc(var(--spacing) * 3);
		padding: calc(var(--spacing) * 4);
		max-height: inherit;
	}

	.export-dialog__title {
		font-size: 1.2rem;
	}

	.export-dialog__code {
		margin: 0;
		padding: calc(var(--spacing) * 3);
		overflow: auto;
		min-height: 0;

		font-family: var(--font-mono);
		font-size: 0.9rem;
		background: var(--color-surface-alt);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
	}

	.export-dialog__actions {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: calc(var(--spacing) * 2);
	}

	.export-dialog__status {
		font-size: 0.9rem;
		color: var(--color-text-muted);
	}
</style>
