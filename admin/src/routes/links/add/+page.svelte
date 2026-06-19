<script lang="ts">
	import type { ActionData } from './$types';
	import { linkConstraints } from '$/routes/links/linkConstraints.ts';

	interface Props {
		form: ActionData;
	}

	let { form = $bindable() }: Props = $props();

	let publicSlug = $state(form?.publicSlug ?? true);
</script>

<svelte:head>
	<title>Add link | aka</title>
</svelte:head>

<div class="container-sm">
	<div class="page-header">
		<h1 class="page-title">Add link</h1>
	</div>

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
					value={form?.slug ?? ''}
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
					value={form?.destination ?? ''}
					maxlength={linkConstraints.destination.maxLength}
				/>
			</div>
			<div class="form-group">
				<label for="notes">Notes</label>
				<span class="hint">
					Optional notes about this link. These are only used in the admin dashboard, and are never
					shared with users.
				</span>
				{#if !!form?.errors?.notes}
					<span class="error">{form?.errors?.notes}</span>
				{/if}
				<textarea id="notes" name="notes" maxlength={linkConstraints.notes.maxLength}
					>{form?.notes ?? ''}</textarea
				>
			</div>
		</div>

		<div class="button-group">
			<button class="button button--primary button-lg" type="submit"> Add </button>
			<a href="/links" class="button button--text button-lg"> Cancel </a>
		</div>
	</form>
</div>

<style>
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
