<script lang="ts">
	import type { PageData } from './$types';
	import OcticonLink from '$/icons/OcticonLink.svelte';
	import OcticonPulse from '$/icons/OcticonPulse.svelte';
	import OcticonChevronRight from '$/icons/OcticonChevronRight.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Dashboard | aka</title>
</svelte:head>

<div class="container-md">
	<div class="page-header">
		<h1 class="page-title">Dashboard</h1>
	</div>

	<div class="dashboard">
		<div class="card">
			<div class="card__header">
				<div class="card__icon">
					<OcticonLink />
				</div>
				<div class="card__title">
					<a href="/links" class="link">
						Links
						<OcticonChevronRight />
					</a>
				</div>
			</div>
			<div class="card__body sections">
				<div class="section">
					<div class="section__title">Enabled</div>
					<div class="section__value">
						{data.enabledLinkCount}
						<span class="section__unit">
							{data.enabledLinkCount === 1 ? 'link' : 'links'}
						</span>
					</div>
				</div>
				<div class="section">
					<div class="section__title">Disabled</div>
					<div class="section__value">
						{data.disabledLinkCount}
						<span class="section__unit">
							{data.disabledLinkCount === 1 ? 'link' : 'links'}
						</span>
					</div>
				</div>
			</div>
		</div>
		<div class="card card--sections">
			<div class="card__header">
				<div class="card__icon">
					<OcticonPulse />
				</div>
				<div class="card__title">Activity</div>
			</div>
			<div class="card__body sections">
				<div class="section">
					<div class="section__title">Past 24 hours</div>
					<div class="section__value">
						{data.dayVisitorCount}
						<span class="section__unit"> visitors </span>
					</div>
				</div>
				<div class="section">
					<div class="section__title">Past 30 days</div>
					<div class="section__value">
						{data.monthVisitorCount}
						<span class="section__unit"> visitors </span>
					</div>
				</div>
				<div class="section">
					<div class="section__title">All time</div>
					<div class="section__value">
						{data.lifetimeVisitorCount}
						<span class="section__unit"> visitors </span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.dashboard {
		display: flex;
		flex-direction: row;
		gap: calc(var(--spacing) * 4);
		flex-wrap: wrap;
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

		&:last-child {
			border-right: none;
		}

		.section__title {
			color: var(--color-text-muted);
			font-size: 0.8rem;
		}

		.section__value {
			font-size: 2rem;
			font-weight: 600;
		}

		.section__unit {
			font-size: initial;
			font-weight: initial;
			color: var(--color-text-muted);
		}
	}
</style>
