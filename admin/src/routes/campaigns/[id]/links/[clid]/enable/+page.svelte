<script lang="ts">
    import type { PageData } from './$types';
    interface Props { data: PageData; }
    let { data }: Props = $props();
</script>

<svelte:head><title>Enable campaign link | aka</title></svelte:head>

<div class="container-sm">
    <div class="page-header">
        <h1 class="page-title">Enable campaign link</h1>
    </div>
    <div class="surface surface--content">
        <p>Re-enable slug <code>{data.campaignLink?.slug}</code>?</p>
    </div>
    <div class="button-group">
        <form method="post">
            <button class="button button--primary button-lg" type="submit">Enable</button>
        </form>
        <a href="/campaigns/{data.campaignLink?.campaignId}/links/{data.campaignLink?.id}" class="button button--text button-lg">Cancel</a>
    </div>
</div>

<style>
    .button-group {
        margin-top: calc(var(--spacing) * 4);
        padding-inline: calc(var(--spacing) * 3);
        display: flex;
        gap: calc(var(--spacing) * 2);
    }
</style>
