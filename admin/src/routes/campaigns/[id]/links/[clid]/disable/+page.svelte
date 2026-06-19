<script lang="ts">
    import type { PageData } from './$types';
    interface Props { data: PageData; }
    let { data }: Props = $props();
</script>

<svelte:head><title>Disable campaign link | aka</title></svelte:head>

<div class="container-sm">
    <div class="page-header">
        <h1 class="page-title">Disable campaign link</h1>
    </div>
    <div class="surface surface--content">
        <p>
            Disable slug <code>{data.campaignLink?.slug}</code>?
        </p>
        <p>
            The link will no longer resolve, and visitors will get a 404.
        </p>
    </div>
    <div class="button-group">
        <form method="post">
            <button class="button button--danger button-lg" type="submit">Disable</button>
        </form>
        <a href="/campaigns/{data.campaignLink?.campaignId}" class="button button--text button-lg">Cancel</a>
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
