<script lang="ts">
    import type { ActionData, PageData } from './$types';

    interface Props { data: PageData; form: ActionData; }
    let { data, form = $bindable() }: Props = $props();
</script>

<svelte:head>
    <title>Add campaign link | aka</title>
</svelte:head>

<div class="container-sm">
    <div class="page-header">
        <h1 class="page-title">Add campaign link</h1>
    </div>

    {#if !data.campaign}
        <div class="surface surface--content">
            <p class="error">Campaign not found</p>
            <a href="/campaigns" class="link link--info">Back to campaigns</a>
        </div>
    {:else if data.availableLinks.length === 0}
        <div class="surface surface--content">
            <p>All active core links are already in this campaign.</p>
            <a href="/campaigns/{data.campaign.id}" class="link link--info">Back to campaign</a>
        </div>
    {:else}
        <form method="post">
            <div class="surface surface--content">
                <div class="form-group">
                    <label for="linkId">Core link</label>
                    <span class="hint">
                        An opaque random slug will be generated for this link in the campaign.
                    </span>
                    {#if form?.errors?.linkId}
                        <span class="error">{form.errors.linkId}</span>
                    {/if}
                    <select id="linkId" name="linkId" class:errored={!!form?.errors?.linkId}>
                        <option value="">- select a link -</option>
                        {#each data.availableLinks as link (link.id)}
                            <option value={link.id} selected={form?.linkId === link.id}>
                                {link.slug ? `/${link.slug}` : '(no vanity slug)'} → {link.destinationUrl}
                            </option>
                        {/each}
                    </select>
                </div>
            </div>

            <div class="button-group">
                <button class="button button--primary button-lg" type="submit">Add</button>
                <a href="/campaigns/{data.campaign.id}" class="button button--text button-lg">Cancel</a>
            </div>
        </form>
    {/if}
</div>

<style>
    .button-group {
        margin-top: calc(var(--spacing) * 4);
        padding-inline: calc(var(--spacing) * 3);
    }

    select {
        width: 100%;
    }
</style>
