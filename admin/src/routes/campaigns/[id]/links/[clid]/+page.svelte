<script lang="ts">
    import type { PageData } from './$types';
    import { makeDateRelativeLong } from '$lib/format.ts';
    import OcticonLocation from '$/icons/OcticonLocation.svelte';
    import OcticonClock from '$/icons/OcticonClock.svelte';
    import OcticonChevronRight from '$/icons/OcticonChevronRight.svelte';
    import OcticonChevronDown from '$/icons/OcticonChevronDown.svelte';

    interface Props { data: PageData; }
    let { data }: Props = $props();
</script>

<svelte:head>
    <title>Campaign link | aka</title>
</svelte:head>

{#if !data.campaignLink}
    <div class="container-sm">
        <div class="page-header"><h1 class="page-title">Campaign link</h1></div>
        <div class="surface surface--content">
            <p class="error">Campaign link not found</p>
            <a href="/campaigns" class="link link--info">Back to campaigns</a>
        </div>
    </div>
{:else}
    <div class="container-lg">
        <div class="page-header">
            <h1 class="page-title">
                <span class="slug">{data.campaignLink.slug}</span> analytics
            </h1>
            <span class="spacer"></span>
            {#if data.campaignLink.isActive}
                <a href="/campaigns/{data.campaignLink.campaignId}/links/{data.campaignLink.id}/disable" class="button button--danger button-lg">Disable</a>
            {:else}
                <a href="/campaigns/{data.campaignLink.campaignId}/links/{data.campaignLink.id}/enable" class="button button--secondary button-lg">Enable</a>
            {/if}
            <a href="/campaigns/{data.campaignLink.campaignId}" class="button button--secondary button-lg">
                Back to {data.campaignLink.campaignName}
            </a>
        </div>

        <div class="surface surface--content link-info">
            <div class="info-row">
                <span class="info-label">Slug</span>
                <code>{data.campaignLink.slug}</code>
            </div>
            <div class="info-row">
                <span class="info-label">Destination</span>
                <a href={data.campaignLink.destinationUrl} class="link">{data.campaignLink.destinationUrl}</a>
            </div>
            {#if data.campaignLink.linkSlug}
                <div class="info-row">
                    <span class="info-label">Vanity slug</span>
                    <span>/{data.campaignLink.linkSlug}</span>
                </div>
            {/if}
        </div>

        <div class="card" style="margin-top: calc(var(--spacing) * 6)">
            <div class="card__body card__body--content">
                {#if data.events.length === 0}
                    <p class="no-events">No visits recorded yet.</p>
                {:else}
                    {#each data.events as event (event)}
                        <details class="event">
                            <summary class="event__header">
                                <span class="event__icon event__icon--open"><OcticonChevronRight /></span>
                                <span class="event__icon event__icon--close"><OcticonChevronDown /></span>
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
        font-family: monospace;
        font-weight: 600;
    }

    .link-info {
        display: flex;
        flex-direction: column;
        gap: calc(var(--spacing) * 2);
    }

    .info-row {
        display: flex;
        flex-direction: row;
        gap: calc(var(--spacing) * 4);
        align-items: baseline;
    }

    .info-label {
        color: var(--color-text-muted);
        font-size: 0.9rem;
        min-width: 8rem;
    }

    .event {
        border-bottom: 1px solid var(--color-border);
        padding-block: calc(var(--spacing) * 1);
        padding-inline: calc(var(--spacing) * 2);

        &:last-child { border-bottom: none; }

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

        .event__icon { display: none; margin-inline-end: calc(var(--spacing) * 2); }

        .event__section {
            border-bottom: 1px solid var(--color-border);
            padding-block: calc(var(--spacing) * 1);
            padding-inline: calc(var(--spacing) * 2);

            &:last-child { border-bottom: none; }

            .event__section__header { color: var(--color-text-muted); font-size: 0.9rem; }

            &.event__section--utm {
                display: flex;
                gap: calc(var(--spacing) * 4);
                flex-wrap: wrap;

                .utm-content { overflow: hidden; }
                .utm-value { overflow: hidden; text-overflow: ellipsis; }
            }
        }
    }

    .event:not(:open) .event__icon.event__icon--open { display: block; }
    .event:open .event__icon.event__icon--close { display: block; }

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
