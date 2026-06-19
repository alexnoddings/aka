<script lang="ts">
    import type { ActionData } from './$types';
    import { campaignConstraints } from '$/routes/campaigns/campaignConstraints.ts';

    interface Props { form: ActionData; }
    let { form = $bindable() }: Props = $props();
</script>

<svelte:head>
    <title>Add campaign | aka</title>
</svelte:head>

<div class="container-sm">
    <div class="page-header">
        <h1 class="page-title">Add campaign</h1>
    </div>

    <form method="post">
        <div class="surface surface--content">
            <div class="form-group">
                <label for="name">Name</label>
                <span class="hint">A descriptive name</span>
                {#if form?.errors?.name}
                    <span class="error">{form.errors.name}</span>
                {/if}
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={form?.name ?? ''}
                    class:errored={!!form?.errors?.name}
                    maxlength={campaignConstraints.name.maxLength}
                />
            </div>
            <div class="form-group">
                <label for="notes">Notes</label>
                <span class="hint">Optional internal notes. Not visible to visitors.</span>
                {#if form?.errors?.notes}
                    <span class="error">{form.errors.notes}</span>
                {/if}
                <textarea id="notes" name="notes" maxlength={campaignConstraints.notes.maxLength}>
                    {form?.notes ?? ''}
                </textarea>
            </div>
        </div>

        <div class="button-group">
            <button class="button button--primary button-lg" type="submit">Add</button>
            <a href="/campaigns" class="button button--text button-lg">Cancel</a>
        </div>
    </form>
</div>

<style>
    .button-group {
        margin-top: calc(var(--spacing) * 4);
        padding-inline: calc(var(--spacing) * 3);
    }
</style>
