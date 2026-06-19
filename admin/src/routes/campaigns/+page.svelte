<script lang="ts">
    import type { PageData } from './$types';
    import OcticonPlus from '$/icons/OcticonPlus.svelte';
    import OcticonPeople from '$/icons/OcticonPeople.svelte';
    import OcticonCheckCircleLg from '$/icons/OcticonCheckCircleLg.svelte';
    import OcticonXCircleLg from '$/icons/OcticonXCircleLg.svelte';
    import OcticonChevronRight from '$/icons/OcticonChevronRight.svelte';
    import OcticonLink from '$/icons/OcticonLink.svelte';
    import { makeDateRelativeLong, makeDateRelativeShort } from '$lib/format.ts';

    interface Props { data: PageData; }
    let { data }: Props = $props();
</script>

<svelte:head>
    <title>Campaigns | aka</title>
</svelte:head>

<div class="container-md">
    <div class="page-header">
        <h1 class="page-title">Campaigns</h1>
        <span class="spacer"></span>
        <a href="/campaigns/add" class="button button--primary">
            <OcticonPlus />
            Add
        </a>
    </div>

    {#if data.campaigns.length === 0}
        <div class="surface surface--content">
            <p class="empty">No campaigns yet</p>
        </div>
    {:else}
        <div class="campaigns">
            {#each data.campaigns as campaign (campaign.id)}
                <div class="card">
                    <div class="card__body card__body--content campaign-card__body">
                        <div class="campaign-item__status">
                            {#if campaign.isActive}
                                <span class="status--active"><OcticonCheckCircleLg /></span>
                            {:else}
                                <span class="status--inactive"><OcticonXCircleLg /></span>
                            {/if}
                        </div>
                        <div>
                            <a href="/campaigns/{campaign.id}" class="link campaign-item__name">
                                {campaign.name}
                                <OcticonChevronRight />
                            </a>
                        </div>
                        <span class="spacer"></span>
                        <a href="/campaigns/{campaign.id}/edit" class="link link--info campaign-item__action">Edit</a>
                    </div>
                    <div class="card__footer campaign-card__footer">
                        <div class="campaign-item__meta">
                            <OcticonLink />
                            {campaign.linkCount} {campaign.linkCount === 1 ? 'link' : 'links'}
                        </div>
                        <div class="campaign-item__meta">
                            <OcticonPeople />
                            {campaign.totalHits} {campaign.totalHits === 1 ? 'visit' : 'visits'}
                        </div>
                        <span class="spacer"></span>
                        <div class="campaign-item__meta">
                            Last used {makeDateRelativeLong(campaign.lastUsed ?? undefined)}
                        </div>
                        <div class="campaign-item__meta">
                            Created {makeDateRelativeShort(campaign.createdAt)}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .campaigns {
        display: flex;
        flex-direction: column;
        gap: calc(var(--spacing) * 6);
    }

    .campaign-card__body {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: calc(var(--spacing) * 2);
        padding-inline: calc(var(--spacing) * 4) !important;
    }

    .campaign-item__status {
        margin-inline-end: calc(var(--spacing) * 2);

        .status--active { color: var(--color-success); }
        .status--inactive { color: var(--color-text-muted); }
    }

    .campaign-item__name {
        font-size: 1.2rem;
        font-weight: 500;
    }

    .campaign-item__action {
        margin-inline: var(--spacing);
    }

    .campaign-card__footer {
        display: flex;
        flex-direction: row;
        padding-inline: calc(var(--spacing) * 4) !important;
        gap: calc(var(--spacing) * 6) !important;

        .campaign-item__meta {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: calc(var(--spacing) * 2);
            color: var(--color-text-muted);
        }
    }

    .empty {
        color: var(--color-text-muted);
        text-align: center;
        padding-block: calc(var(--spacing) * 4);
    }
</style>
