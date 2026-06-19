<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import OcticonComment from '$/icons/OcticonComment.svelte';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form = $bindable() }: Props = $props();
</script>

<svelte:head>
	<title>Enable link | aka</title>
</svelte:head>

<div class="container-sm">
	<div class="page-header">
		<div>
			<h1 class="page-title">Enable link</h1>
		</div>
	</div>

	{#if !data.link}
		<div class="surface surface--content">
			<p class="error">Link not found</p>
			<a href="/links" class="link link--info">Back to links</a>
		</div>
	{:else}
		<form method="post">
			<div class="card">
				<div class="card__header">
					{#if data.link.slug === null}
						<div class="card__header__title slug slug-null">
							&lt;none&gt;
						</div>
					{:else if data.link.slug.length === 0}
						<div class="card__header__title slug slug-default">
							default
						</div>
					{:else}
						<div class="card__header__title slug">
							{data.link.slug}
						</div>
					{/if}
				</div>
				<div class="card__body card__body--content">
					<p>Enabled links will redirect users.</p>
				</div>
				{#if !!data.link.notes && data.link.notes.length > 0}
					<div class="card__footer">
						<OcticonComment />
						{data.link.notes}
					</div>
				{/if}
			</div>

			{#if !!form?.errors.id}
				<div>
					{form?.errors.id}
				</div>
			{/if}

			<div class="button-group">
				<button class="button button--primary button-lg" type="submit"> Enable </button>
				<a href="/links/{data.link.id}" class="button button--text button-lg"> Cancel </a>
			</div>
		</form>
	{/if}
</div>

<style>
	.slug {
		font-size: 1.5rem;
		line-height: 1.2;
		padding-inline: var(--spacing);

		&.slug-null {
			font-style: italic;
			color: var(--color-text-muted);
		}
		&.slug-default {
			font-style: italic;
			color: var(--color-text-muted);
		}
	}

	.button-group {
		margin-top: calc(var(--spacing) * 4);
		padding-inline: calc(var(--spacing) * 3);
	}
</style>
