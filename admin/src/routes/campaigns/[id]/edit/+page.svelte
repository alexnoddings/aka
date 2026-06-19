<script lang="ts">
    import type { ActionData, PageData } from './$types';
    import { campaignConstraints } from '$/routes/campaigns/campaignConstraints.ts';

    interface Props { data: PageData; form: ActionData; }
    let { data, form = $bindable() }: Props = $props();
</script>

<svelte:head>
    <title>Edit campaign | aka</title>
</svelte:head>

<div class="container-sm">
    <div class="page-header">
        <h1 class="page-title">Edit campaign</h1>
    </div>

    <form method="post">
        <div class="surface surface--content">
            <div class="form-group">
                <label for="name">Name</label>
                {#if form?.errors?.name}
                    <span class="error">{form.errors.name}</span>
                {/if}
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={form?.name ?? data.campaign?.name ?? ''}
                    class:errored={!!form?.errors?.name}
                    maxlength={campaignConstraints.name.maxLength}
                />
            </div>
            <div class="form-group">
                <label for="notes">Notes</label>
                {#if form?.errors?.notes}
                    <span class="error">{form.errors.notes}</span>
                {/if}
                <textarea id="notes" name="notes" maxlength={campaignConstraints.notes.maxLength}>
                    {form?.notes ?? data.campaign?.notes ?? ''}
                </textarea>
            </div>
        </div>

        <div class="button-group">
            <button class="button button--primary button-lg" type="submit">Save</button>
            <a href="/campaigns/{data.campaign?.id}" class="button button--text button-lg">Cancel</a>
        </div>
    </form>
</div>

<style>
    .button-group {
        margin-top: calc(var(--spacing) * 4);
        padding-inline: calc(var(--spacing) * 3);
    }
</style>
