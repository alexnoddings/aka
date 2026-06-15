<script lang="ts">
	import type { PageData } from './$types';
	import { makeDateRelativeLong } from '$lib/format.ts';
	import OcticonClock from '$/icons/OcticonClock.svelte';
	import OcticonLocation from '$/icons/OcticonLocation.svelte';
	import OcticonLink from '$/icons/OcticonLink.svelte';
	import OcticonChevronRight from '$/icons/OcticonChevronRight.svelte';
	import OcticonChevronDown from '$/icons/OcticonChevronDown.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const hasActiveFilters = $derived(
		!!(
			data.filters.linkId ||
			data.filters.source ||
			data.filters.medium ||
			data.filters.campaign ||
			data.filters.term ||
			data.filters.content
		)
	);

	function buildPageHref(targetPage: number): string {
		const params = new URLSearchParams();
		if (data.filters.linkId) params.set('linkId', data.filters.linkId);
		if (data.filters.source) params.set('utmSource', data.filters.source);
		if (data.filters.medium) params.set('utmMedium', data.filters.medium);
		if (data.filters.campaign) params.set('utmCampaign', data.filters.campaign);
		if (data.filters.term) params.set('utmTerm', data.filters.term);
		if (data.filters.content) params.set('utmContent', data.filters.content);
		params.set('page', String(targetPage));
		return `?${params.toString()}`;
	}
</script>

<svelte:head>
	<title>Activity | aka</title>
</svelte:head>

<div class="container-lg">
	<div class="page-header">
		<h1 class="page-title">Activity</h1>
	</div>

	<form method="get" class="filter-panel surface surface--content">
		<div class="filter-grid">
			<div class="form-group">
				<label for="linkId">Link</label>
				<select id="linkId" name="linkId">
					<option value="">All links</option>
					{#each data.links as link}
						<option value={link.id} selected={data.filters.linkId === link.id}>
							{link.slug.length === 0 ? '(default)' : link.slug}
						</option>
					{/each}
				</select>
			</div>
			<div class="form-group">
				<label for="utmSource">UTM Source</label>
				<input id="utmSource" name="utmSource" type="text" value={data.filters.source ?? ''} />
			</div>
			<div class="form-group">
				<label for="utmMedium">UTM Medium</label>
				<input id="utmMedium" name="utmMedium" type="text" value={data.filters.medium ?? ''} />
			</div>
			<div class="form-group">
				<label for="utmCampaign">UTM Campaign</label>
				<input id="utmCampaign" name="utmCampaign" type="text" value={data.filters.campaign ?? ''} />
			</div>
			<div class="form-group">
				<label for="utmTerm">UTM Term</label>
				<input id="utmTerm" name="utmTerm" type="text" value={data.filters.term ?? ''} />
			</div>
			<div class="form-group">
				<label for="utmContent">UTM Content</label>
				<input id="utmContent" name="utmContent" type="text" value={data.filters.content ?? ''} />
			</div>
		</div>
		<div class="button-group">
			<button type="submit" class="button button--primary">Apply filters</button>
			{#if hasActiveFilters}
				<a href="/activity" class="button button--text">Clear filters</a>
			{/if}
		</div>
	</form>

	<p class="results-summary">
		{data.totalEvents}
		{data.totalEvents === 1 ? 'visit' : 'visits'}
	</p>

	<div class="card">
		<div class="card__body">
			{#if data.events.length === 0}
				<p class="no-events">
					{#if hasActiveFilters}
						No visits match the current filters.
					{:else}
						No visits recorded yet.
					{/if}
				</p>
			{:else}
				{#each data.events as event (event.id)}
					<details class="event">
						<summary class="event__header">
							<span class="event__icon event__icon--open">
								<OcticonChevronRight />
							</span>
							<span class="event__icon event__icon--close">
								<OcticonChevronDown />
							</span>
							<span class="event__header-text">
								<OcticonLink />
								<span class="event-slug">{event.linkSlug.length === 0 ? '(default)' : event.linkSlug}</span>
							</span>
							<span class="event__header-text">
								<OcticonClock />
								{makeDateRelativeLong(event.requestedAt, true)}
							</span>
							<span class="spacer"></span>
							<span class="event__header-text">
								<OcticonLocation />
								{[event.city, event.region, event.country].filter(Boolean).join(', ') || '—'}
							</span>
						</summary>
						<div class="event__section event__section--utm">
							<div class="utm-content">
								<div class="event__section__header">UTM Source</div>
								<div class="utm-value">{event.utmSource ?? '-'}</div>
							</div>
							<div class="utm-content">
								<div class="event__section__header">UTM Medium</div>
								<div class="utm-value">{event.utmMedium ?? '-'}</div>
							</div>
							<div class="utm-content">
								<div class="event__section__header">UTM Content</div>
								<div class="utm-value">{event.utmContent ?? '-'}</div>
							</div>
							<div class="utm-content">
								<div class="event__section__header">UTM Campaign</div>
								<div class="utm-value">{event.utmCampaign ?? '-'}</div>
							</div>
							<div class="utm-content">
								<div class="event__section__header">UTM Term</div>
								<div class="utm-value">{event.utmTerm ?? '-'}</div>
							</div>
						</div>
						<div class="event__section">
							<div class="event__section__header">Referred by</div>
							{event.referrer ?? '-'}
						</div>
						<div class="event__section">
							<div class="event__section__header">User agent</div>
							<code>{event.userAgent ?? '-'}</code>
						</div>
					</details>
				{/each}
			{/if}
		</div>
		{#if data.totalPages > 1}
			<div class="card__footer pagination">
				{#if data.currentPage > 1}
					<a href={buildPageHref(data.currentPage - 1)} class="button button--secondary">Previous</a>
				{:else}
					<span class="button button--secondary button--disabled" aria-disabled="true">Previous</span>
				{/if}
				<span class="pagination__info">Page {data.currentPage} of {data.totalPages}</span>
				{#if data.currentPage < data.totalPages}
					<a href={buildPageHref(data.currentPage + 1)} class="button button--secondary">Next</a>
				{:else}
					<span class="button button--secondary button--disabled" aria-disabled="true">Next</span>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.filter-panel {
		margin-block-end: calc(var(--spacing) * 4);
	}

	.filter-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
		gap: calc(var(--spacing) * 4);
		margin-block-end: calc(var(--spacing) * 3);
	}

	select {
		display: block;
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		padding-inline: calc(var(--spacing) * 2);
		padding-block: calc(var(--spacing) * 1);
		background: var(--color-surface);
		color: var(--color-text);
		width: 100%;

		&:focus {
			outline: 4px solid var(--color-primary);
		}
	}

	.results-summary {
		color: var(--color-text-muted);
		font-size: 0.9rem;
		margin-block-end: calc(var(--spacing) * 2);
	}

	.event-slug {
		font-weight: 600;
		margin-inline-end: calc(var(--spacing) * 2);
	}

	.event {
		border-bottom: 1px solid var(--color-border);
		padding-block: calc(var(--spacing) * 1);
		padding-inline: calc(var(--spacing) * 2);

		&:last-child {
			border-bottom: none;
		}

		.event__header {
			display: flex;
			flex-direction: row;
			align-items: center;
		}

		.event__header-text {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: calc(var(--spacing) * 1);
			margin-inline-end: calc(var(--spacing) * 3);
		}

		.event__icon {
			display: none;
			margin-inline-end: calc(var(--spacing) * 2);
		}

		.event__section {
			border-bottom: 1px solid var(--color-border);
			padding-block: calc(var(--spacing) * 1);
			padding-inline: calc(var(--spacing) * 2);

			&:last-child {
				border-bottom: none;
			}

			.event__section__header {
				color: var(--color-text-muted);
				font-size: 0.9rem;
			}

			&.event__section--utm {
				display: flex;
				gap: calc(var(--spacing) * 4);
				flex-wrap: wrap;

				.utm-content {
					overflow: hidden;
				}

				.utm-value {
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
	}

	.event:not(:open) {
		.event__icon.event__icon--open {
			display: block;
		}
	}

	.event:open {
		.event__icon.event__icon--close {
			display: block;
		}
	}

	.no-events {
		color: var(--color-text-muted);
		text-align: center;
		padding: calc(var(--spacing) * 4);
	}

	.pagination {
		justify-content: center;
		gap: calc(var(--spacing) * 4);
	}

	.pagination__info {
		color: var(--color-text-muted);
		align-self: center;
	}

	.button--disabled {
		opacity: 0.4;
		cursor: not-allowed;
		pointer-events: none;
	}
</style>
