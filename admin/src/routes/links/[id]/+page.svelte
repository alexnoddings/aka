<script lang="ts">
	import type { PageData } from './$types';
	import { makeDateRelativeLong } from '$lib/format.ts';
	import OcticonLocation from '$/icons/OcticonLocation.svelte';
	import OcticonClock from '$/icons/OcticonClock.svelte';
	import OcticonChevronRight from '$/icons/OcticonChevronRight.svelte';
	import OcticonChevronDown from '$/icons/OcticonChevronDown.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Link analytics | aka</title>
</svelte:head>

{#if !data.link}
	<div class="container-sm">
		<div class="page-header">
			<div>
				<h1 class="page-title">Analytics</h1>
			</div>
		</div>
		<div class="surface surface--content">
			<p class="error">Link not found</p>
			<a href="/links" class="link link--info">Back to links</a>
		</div>
	</div>
{:else}
	<div class="container-lg">
		<div class="page-header">
			<h1 class="page-title">
				{#if data.link.slug === null}
					<span class="slug slug--default">No vanity link</span>
				{:else if data.link.slug.length === 0}
					<span class="slug slug--default">Default</span>
				{:else}
					<span class="slug">{data.link.slug}</span>
				{/if}
				analytics
			</h1>
			<span class="spacer"></span>
			<a href="/links" class="button button-lg button--secondary">Back to links</a>
		</div>

		<div class="card">
			<div class="card__body card__body--content">
				{#if data.events.length === 0}
					<p class="no-events">No visits recorded yet.</p>
				{:else}
					{#each data.events as event (event)}
						<details class="event">
							<summary class="event__header">
								<span class="event__icon event__icon--open">
									<OcticonChevronRight />
								</span>
								<span class="event__icon event__icon--close">
									<OcticonChevronDown />
								</span>
								<span class="event__header-text">
									<OcticonClock />
									{makeDateRelativeLong(event.requestedAt, true)}
								</span>
								<span class="spacer"></span>
								<span class="event__header-text">
									<OcticonLocation />
									{event.city}, {event.region}, {event.country}
								</span>
							</summary>
							<div class="event__section event__section--utm">
								<div class="utm-content">
									<div class="event__section__header">UTM Source</div>
									<div class="utm-value">
										{event.utmSource ?? '-'}
									</div>
								</div>
								<div class="utm-content">
									<div class="event__section__header">UTM Medium</div>
									<div class="utm-value">
										{event.utmMedium ?? '-'}
									</div>
								</div>
								<div class="utm-content">
									<div class="event__section__header">UTM Content</div>
									<div class="utm-value">
										{event.utmContent ?? '-'}
									</div>
								</div>
								<div class="utm-content">
									<div class="event__section__header">UTM Campaign</div>
									<div class="utm-value">
										{event.utmCampaign ?? '-'}
									</div>
								</div>
								<div class="utm-content">
									<div class="event__section__header">UTM Term</div>
									<div class="utm-value">
										{event.utmTerm ?? '-'}
									</div>
								</div>
							</div>
							<div class="event__section">
								<div class="event__section__header">Referred by</div>
								{event.referrer ?? '-'}
							</div>
							<div class="event__section">
								<div class="event__section__header">User agent</div>
								<code>
									{event.userAgent ?? '-'}
								</code>
							</div>
						</details>
					{/each}
				{/if}
			</div>
			{#if data.totalPages > 1}
				<div class="card__footer pagination">
					{#if data.currentPage > 1}
						<a href="?page={data.currentPage - 1}" class="button button--secondary">Previous</a>
					{:else}
						<span class="button button--secondary button--disabled" aria-disabled="true">Previous</span>
					{/if}
					<span class="pagination__info">Page {data.currentPage} of {data.totalPages}</span>
					{#if data.currentPage < data.totalPages}
						<a href="?page={data.currentPage + 1}" class="button button--secondary">Next</a>
					{:else}
						<span class="button button--secondary button--disabled" aria-disabled="true">Next</span>
					{/if}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.slug {
		font-weight: 600;

		&.slug--default {
			font-style: italic;
		}
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
		padding-block: calc(var(--spacing) * 4);
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
