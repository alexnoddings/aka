<script lang="ts">
	import type { ActionData, PageData } from './$types';

	interface Props {
		data: PageData;
		form: ActionData;
	}
	let { data, form = $bindable() }: Props = $props();

	let selectedIds = $state<string[]>(form?.linkIds ?? []);

	let allSelected = $derived(
		data.availableLinks.length > 0 && selectedIds.length === data.availableLinks.length
	);

	function toggleAll() {
		selectedIds = allSelected ? [] : data.availableLinks.map((link) => link.id);
	}

	function addLabel(count: number) {
		if (count === 0) return 'Add links';
		return count === 1 ? 'Add 1 link' : `Add ${count} links`;
	}
</script>

<svelte:head>
	<title>Add campaign links | aka</title>
</svelte:head>

<div class="container-md">
	<div class="page-header">
		<h1 class="page-title">Add campaign links</h1>
	</div>

	{#if !data.campaign}
		<div class="surface surface--content">
			<p class="error">Campaign not found</p>
			<a href="/campaigns" class="link link--info">Back to campaigns</a>
		</div>
	{:else if data.availableLinks.length === 0}
		<div class="surface surface--content">
			<p>All active core links are already in this campaign.</p>
			<a href="/campaigns/{data.campaign.id}" class="link link--info">Back to campaign</a>
		</div>
	{:else}
		<form method="post">
			<div class="surface surface--content">
				<fieldset class="link-picker">
					<legend>Core links</legend>
					<span class="hint">
						An opaque random slug will be generated for each link in the campaign.
					</span>
					{#if form?.errors?.linkIds}
						<span class="error">{form.errors.linkIds}</span>
					{/if}

					<ul class="link-list" class:errored={!!form?.errors?.linkIds}>
						{#each data.availableLinks as link (link.id)}
							<li>
								<label class="link-option">
									<input type="checkbox" name="linkIds" value={link.id} bind:group={selectedIds} />
									<span class="link-option__text">
										<span class="link-option__slug">
											{link.slug ? `/${link.slug}` : '(no vanity slug)'}
										</span>
										<span class="link-option__destination">{link.destinationUrl}</span>
									</span>
								</label>
							</li>
						{/each}
					</ul>

					<div class="link-picker__toolbar">
						<button type="button" class="button button--secondary" onclick={toggleAll}>
							{allSelected ? 'Select none' : 'Select all'}
						</button>
						<span class="spacer"></span>
						<span class="link-picker__count" aria-live="polite">
							{selectedIds.length} of {data.availableLinks.length} selected
						</span>
					</div>
				</fieldset>
			</div>

			<div class="button-group">
				<button
					class="button button--primary button-lg"
					type="submit"
					disabled={selectedIds.length === 0}
				>
					{addLabel(selectedIds.length)}
				</button>
				<a href="/campaigns/{data.campaign.id}" class="button button--text button-lg">Cancel</a>
			</div>
		</form>
	{/if}
</div>

<style>
	.button-group {
		margin-top: calc(var(--spacing) * 4);
		padding-inline: calc(var(--spacing) * 3);
	}

	.button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.link-picker {
		border: none;
		margin: 0;
		padding: 0;

		display: flex;
		flex-direction: column;

		legend {
			padding: 0;
			margin-block-end: calc(var(--spacing) * 1.5);
		}

		.hint {
			line-height: 1;
			font-size: 0.9rem;
			color: var(--color-text-muted);
			margin-block-end: calc(var(--spacing) * 1.5);
		}

		.error {
			line-height: 1;
			font-size: 0.9rem;
			margin-block-end: calc(var(--spacing) * 1.5);
		}
	}

	.link-picker__toolbar {
		display: flex;
		flex-direction: row;
		align-items: center;

		margin-block-start: var(--spacing);
	}

	.link-picker__count {
		color: var(--color-text-muted);
		font-size: 0.9rem;
	}

	.link-list {
		list-style: none;
		margin: 0;
		padding: 0;
		max-height: 24rem;

		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);

		overflow-y: auto;

		&.errored {
			border-color: var(--color-error);
		}

		li {
			border-bottom: 1px solid var(--color-border);

			&:last-child {
				border-bottom: none;
			}
		}
	}

	.link-option {
		display: flex;
		flex-direction: row;
		align-items: center;

		gap: calc(var(--spacing) * 2);
		padding-inline: calc(var(--spacing) * 3);
		padding-block: calc(var(--spacing) * 2);

		cursor: pointer;

		&:hover {
			background: var(--color-surface-hover);
		}

		&:focus-within {
			outline: 2px solid var(--color-primary);
			outline-offset: -2px;
		}
	}

	.link-option__text {
		display: flex;
		flex-direction: column;

		overflow: hidden;
	}

	.link-option__slug {
		font-family: var(--font-mono);
	}

	.link-option__destination {
		color: var(--color-text-muted);
		font-size: 0.9rem;

		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
