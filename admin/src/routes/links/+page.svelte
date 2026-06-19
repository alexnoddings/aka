<script lang="ts">
	import type { PageData } from './$types';
	import OcticonPeople from '$/icons/OcticonPeople.svelte';
	import OcticonPulse from '$/icons/OcticonPulse.svelte';
	import OcticonPlus from '$/icons/OcticonPlus.svelte';
	import OcticonCheckCircleLg from '$/icons/OcticonCheckCircleLg.svelte';
	import OcticonXCircleLg from '$/icons/OcticonXCircleLg.svelte';
	import OcticonChevronRight from '$/icons/OcticonChevronRight.svelte';
	import { makeDateRelativeLong, makeDateRelativeShort } from '$/lib/format.ts';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Links | aka</title>
</svelte:head>

<div class="container-md">
	<div class="page-header">
		<h1 class="page-title">Links</h1>
		<span class="spacer"></span>
		<a href="/links/add" class="button button--primary">
			<OcticonPlus />
			Add
		</a>
	</div>

	<div class="links">
		{#each data.links as link (link)}
			<div class="card">
				<div class="card__body card__body--content link-card__body">
					<div class="link-item__status">
						{#if link.active}
							<span class="link-item__status--active">
								<OcticonCheckCircleLg />
							</span>
						{:else}
							<span class="link-item__status--inactive">
								<OcticonXCircleLg />
							</span>
						{/if}
					</div>
					<div>
						<a href="/links/{link.id}" class="link">
							{#if link.slug === null}
								<div class="link-item__slug link-item__slug--default">no vanity link</div>
							{:else if link.slug.length === 0}
								<div class="link-item__slug link-item__slug--default">default</div>
							{:else}
								<div class="link-item__slug">{link.slug}</div>
							{/if}
							<OcticonChevronRight />
						</a>
						<a href={link.destinationUrl} class="link link-item__destination">
							{link.destinationUrl}
						</a>
					</div>
					<span class="spacer"></span>
					<a href="/links/{link.id}/edit" class="link link--info link-item__action"> Edit </a>
					{#if link.active}
						<a href="/links/{link.id}/disable" class="link link--danger link-item__action">
							Disable
						</a>
					{:else}
						<a href="/links/{link.id}/enable" class="link link--danger link-item__action">
							Enable
						</a>
					{/if}
				</div>
				<div class="card__footer link-card__footer">
					<div class="link-item__meta">
						<OcticonPeople />
						{link.visitors}
						visits
					</div>
					<div class="link-item__meta">
						<OcticonPulse />
						Last used
						{makeDateRelativeLong(link.lastUsed ?? undefined)}
					</div>
					<span class="spacer"></span>
					<div class="link-item__meta">
						Updated {makeDateRelativeShort(link.updatedAt)}
					</div>
					<div class="link-item__meta">
						Created {makeDateRelativeShort(link.createdAt)}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.links {
		display: flex;
		flex-direction: column;
		gap: calc(var(--spacing) * 6);
	}

	.link-card__body {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: calc(var(--spacing) * 2);
		padding-inline: calc(var(--spacing) * 4) !important;
	}

	.link-item__status {
		margin-inline-end: calc(var(--spacing) * 2);

		.link-item__status--active {
			color: var(--color-success);
		}

		.link-item__status--inactive {
			color: var(--color-text-muted);
		}
	}

	.link-item__slug {
		font-size: 1.2rem;
		font-weight: 500;
		line-height: 1.1rem;

		&.link-item__slug--default {
			font-style: italic;
		}
	}

	.link-item__action {
		margin-inline: var(--spacing);
	}

	.link-item__destination {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: calc(var(--spacing) * 1);
		color: var(--color-text-muted);
		font-size: 0.9rem;
	}

	.link-card__footer {
		display: flex;
		flex-direction: row;
		padding-inline: calc(var(--spacing) * 4) !important;
		gap: calc(var(--spacing) * 6) !important;

		.link-item__meta {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: calc(var(--spacing) * 2);
			color: var(--color-text-muted);
		}
	}
</style>
