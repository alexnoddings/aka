<script lang="ts">
    import type { PageData } from './$types';
    import OcticonPeople from '$/icons/OcticonPeople.svelte';
    import OcticonPulse from '$/icons/OcticonPulse.svelte';
    import OcticonPlus from '$/icons/OcticonPlus.svelte';
    import OcticonChevronRight from '$/icons/OcticonChevronRight.svelte';
    import OcticonCheckCircleLg from '$/icons/OcticonCheckCircleLg.svelte';
    import OcticonXCircleLg from '$/icons/OcticonXCircleLg.svelte';
    import { makeDateRelativeLong, makeDateRelativeShort } from '$lib/format.ts';

    interface Props { data: PageData; }
    let { data }: Props = $props();
</script>

<svelte:head>
    <title>{data.campaign?.name ?? 'Campaign'} | aka</title>
</svelte:head>

{#if !data.campaign}
    <div class="container-sm">
        <div class="page-header"><h1 class="page-title">Campaign</h1></div>
        <div class="surface surface--content">
            <p class="error">Campaign not found</p>
            <a href="/campaigns" class="link link--info">Back to campaigns</a>
        </div>
    </div>
{:else}
    <div class="container-lg">
        <div class="page-header">
            <h1 class="page-title">{data.campaign.name}</h1>
            <span class="spacer"></span>
            <a href="/campaigns/{data.campaign.id}/edit" class="button button--secondary button-lg">Edit</a>
            {#if data.campaign.isActive}
                <a href="/campaigns/{data.campaign.id}/disable" class="button button--danger button-lg">Disable</a>
            {:else}
                <a href="/campaigns/{data.campaign.id}/enable" class="button button--secondary button-lg">Enable</a>
            {/if}
            <a href="/campaigns" class="button button--secondary button-lg">Back</a>
        </div>

        {#if data.campaign.notes}
            <p class="notes">{data.campaign.notes}</p>
        {/if}

        <div class="stats-row">
            <div class="card">
                <div class="card__body sections">
                    <div class="section">
                        <div class="section__title">Past 24 hours</div>
                        <div class="section__value">{data.stats.dayHits}<span class="section__unit"> visits</span></div>
                    </div>
                    <div class="section">
                        <div class="section__title">Past 30 days</div>
                        <div class="section__value">{data.stats.monthHits}<span class="section__unit"> visits</span></div>
                    </div>
                    <div class="section">
                        <div class="section__title">All time</div>
                        <div class="section__value">{data.stats.totalHits}<span class="section__unit"> visits</span></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="page-header links-header">
            <h2 class="page-title page-title--sm">Campaign links</h2>
            <span class="spacer"></span>
            <a href="/campaigns/{data.campaign.id}/links/add" class="button button--primary">
                <OcticonPlus />
                Add link
            </a>
        </div>

        {#if data.campaignLinks.length === 0}
            <div class="surface surface--content">
                <p class="empty">No links yet.</p>
            </div>
        {:else}
            <div class="campaign-links">
                {#each data.campaignLinks as cl (cl.id)}
                    <div class="card">
                        <div class="card__body card__body--content cl-card__body">
                            <div class="cl-item__status">
                                {#if cl.isActive}
                                    <span class="status--active"><OcticonCheckCircleLg /></span>
                                {:else}
                                    <span class="status--inactive"><OcticonXCircleLg /></span>
                                {/if}
                            </div>
                            <div>
                                <a href="/campaigns/{data.campaign.id}/links/{cl.id}" class="link cl-item__slug">
                                    {cl.slug}
                                    <span class=cl-item__link-slug>
                                        {cl.linkSlug}
                                    </span>
                                    <OcticonChevronRight />
                                </a>
                                <a href={cl.destinationUrl} class="link cl-item__destination">
                                    {cl.destinationUrl}
                                </a>
                            </div>
                            <span class="spacer"></span>
                            {#if cl.isActive}
                                <a href="/campaigns/{data.campaign.id}/links/{cl.id}/disable" class="link link--danger cl-item__action">Disable</a>
                            {:else}
                                <a href="/campaigns/{data.campaign.id}/links/{cl.id}/enable" class="link link--danger cl-item__action">Enable</a>
                            {/if}
                        </div>
                        <div class="card__footer cl-card__footer">
                            <div class="cl-item__meta">
                                <OcticonPeople />
                                {cl.hits} {cl.hits === 1 ? 'visit' : 'visits'}
                            </div>
                            <div class="cl-item__meta">
                                <OcticonPulse />
                                Last used {makeDateRelativeLong(cl.lastUsed ?? undefined)}
                            </div>
                            <span class="spacer"></span>
                            <div class="cl-item__meta">
                                Added {makeDateRelativeShort(cl.createdAt)}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
{/if}

<style>
    .notes {
        color: var(--color-text-muted);
        margin-block-end: calc(var(--spacing) * 4);
    }

    .stats-row {
        margin-block-end: calc(var(--spacing) * 6);
    }

    .sections {
        display: flex;
        flex-direction: row;
        padding-inline: calc(var(--spacing) * 1);
        padding-block: calc(var(--spacing) * 3);
    }

    .section {
        padding-inline: calc(var(--spacing) * 4);
        padding-block: calc(var(--spacing) * 1);
        border-right: 1px solid var(--color-border);

        &:last-child { border-right: none; }

        .section__title { color: var(--color-text-muted); font-size: 0.8rem; }
        .section__value { font-size: 2rem; font-weight: 600; }
        .section__unit { font-size: initial; font-weight: initial; color: var(--color-text-muted); }
    }

    .links-header {
        margin-block-start: calc(var(--spacing) * 4);
    }

    .page-title--sm {
        font-size: 1.2rem;
    }

    .campaign-links {
        display: flex;
        flex-direction: column;
        gap: calc(var(--spacing) * 6);
    }

    .cl-card__body {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: calc(var(--spacing) * 2);
        padding-inline: calc(var(--spacing) * 4) !important;
    }

    .cl-item__status {
        margin-inline-end: calc(var(--spacing) * 2);
        .status--active { color: var(--color-success); }
        .status--inactive { color: var(--color-text-muted); }
    }

    .cl-item__slug {
        font-size: 1.2rem;
        font-weight: 500;
        font-family: monospace;
    }

    .cl-item__link-slug {
        color: var(--color-text-muted);
        &::before {
            content: '(';
        }
        &::after {
            content: ')';
        }
    }

    .cl-item__destination {
        color: var(--color-text-muted);
        font-size: 0.9rem;
    }

    .cl-item__action { margin-inline: var(--spacing); }

    .cl-card__footer {
        display: flex;
        flex-direction: row;
        padding-inline: calc(var(--spacing) * 4) !important;
        gap: calc(var(--spacing) * 6) !important;

        .cl-item__meta {
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
