<script lang="ts">
	import type { PageData } from './$types';
	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();
</script>

<svelte:head><title>Clear recent activity | aka</title></svelte:head>

<div class="container-sm">
	<div class="page-header">
		<h1 class="page-title">Clear recent activity</h1>
	</div>
	{#if !data.campaign}
		<div class="surface surface--content">
			<p class="error">Campaign not found</p>
			<a href="/campaigns" class="link link--info">Back to campaigns</a>
		</div>
	{:else}
		<div class="surface surface--content">
			<p>
				Delete all visits to <strong>{data.campaign.name}</strong>'s campaign links from the past
				{data.windowMinutes} minutes? This can't be undone.
			</p>
			<p class="count">
				{data.eventCount}
				{data.eventCount === 1 ? 'visit' : 'visits'} will be deleted.
			</p>
		</div>
		<div class="button-group">
			<form method="post">
				<button class="button button--danger button-lg" type="submit">Clear activity</button>
			</form>
			<a href="/campaigns/{data.campaign.id}" class="button button--text button-lg">Cancel</a>
		</div>
	{/if}
</div>

<style>
	.count {
		margin-block-start: calc(var(--spacing) * 2);
		color: var(--color-text-muted);
	}

	.button-group {
		margin-top: calc(var(--spacing) * 4);
		padding-inline: calc(var(--spacing) * 3);
		display: flex;
		gap: calc(var(--spacing) * 2);
	}
</style>
