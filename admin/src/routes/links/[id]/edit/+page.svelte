<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { linkConstraints } from '$/routes/links/linkConstraints.ts';
	import { untrack } from 'svelte';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form = $bindable() }: Props = $props();

	let publicSlug = $state(untrack(() => form?.publicSlug ?? data.link?.slug !== null));
</script>

<svelte:head>
	<title>Edit link | aka</title>
</svelte:head>

<div class="container-sm">
	<div class="page-header">
		<div>
			<h1 class="page-title">Edit link</h1>
			{#if !!data.link}
				<p class="old-slug-hint">
					Editing {data.link.slug === null ? 'campaign-only link' : data.link.slug === '' ? 'root redirect' : data.link.slug}
				</p>
			{/if}
		</div>
	</div>

	{#if !data.link}
		<div class="surface surface--content">
			<p class="error">Link not found</p>
			<a href="/links" class="link link--info">Back to links</a>
		</div>
	{:else}
		<form method="post">
			<div class="surface surface--content">
				<div class="form-group">
					<label class="checkbox-label">
						<input type="checkbox" name="publicSlug" bind:checked={publicSlug} />
						Public link
					</label>
					<span class="hint">
						Public links have slugs. Campaign links are only accessible via campaigns.
					</span>
				</div>
				<div class="form-group" class:form-group--disabled={!publicSlug}>
					<label for="slug">Slug</label>
					<span class="hint">
						The link's shortcode path. Leave empty for the root redirect (/).
					</span>
					{#if !!form?.errors?.slug}
						<span class="error">{form?.errors?.slug}</span>
					{/if}
					<input
						id="slug"
						name="slug"
						type="text"
						value={form?.slug ?? data.link.slug ?? ''}
						disabled={!publicSlug}
						class:errored={!!form?.errors?.slug}
						maxlength={linkConstraints.slug.maxLength}
					/>
				</div>
				<div class="form-group">
					<label for="destination">Destination</label>
					<span class="hint"> Where to send visitors. Can contain UTM parameters. </span>
					{#if !!form?.errors?.destination}
						<span class="error">{form?.errors?.destination}</span>
					{/if}
					<input
						id="destination"
						name="destination"
						type="text"
						value={form?.destination ?? data.link.destinationUrl}
						maxlength={linkConstraints.destination.maxLength}
					/>
				</div>
				<div class="form-group">
					<label for="notes">Notes</label>
					<span class="hint">
						Optional notes about this link. These are only used in the admin dashboard, and are
						never shared with users.
					</span>
					{#if !!form?.errors?.notes}
						<span class="error">{form?.errors?.notes}</span>
					{/if}
					<textarea id="notes" name="notes" maxlength={linkConstraints.notes.maxLength}
						>{form?.notes ?? data.link.notes}</textarea
					>
				</div>
			</div>

			{#if !!form?.errors.id}
				<div>
					{form?.errors.id}
				</div>
			{/if}

			<div class="button-group">
				<button class="button button--primary button-lg" type="submit">Save</button>
				<a href="/links/{data.link.id}" class="button button--text button-lg">Cancel</a>
			</div>
		</form>
	{/if}
</div>

<style>
	.page-title {
		line-height: 1.2;
	}
	.old-slug-hint {
		color: var(--color-text-muted);
		margin-block-end: calc(var(--spacing) * 2);
	}

	.button-group {
		margin-top: calc(var(--spacing) * 4);
		padding-inline: calc(var(--spacing) * 3);
	}

	.form-group--disabled {
		opacity: 0.5;
		pointer-events: none;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: calc(var(--spacing) * 2);
		cursor: pointer;
	}
</style>
