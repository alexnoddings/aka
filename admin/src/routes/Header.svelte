<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
</script>

<header>
	<a class="brand" href={resolve('/')}>
		<svg width="42" height="42" viewBox="0 0 1 1" aria-hidden="true">
			<foreignObject x="0" y="0" width="1" height="1">
				<img alt=" " aria-hidden="true" src="/favicon.svg" />
			</foreignObject>
		</svg>
		<span class="brand__name">aka</span>
	</a>
	<nav>
		<a href="/links" class="nav-link" class:nav-link--active={$page.url.pathname.startsWith('/links')}>Links</a>
		<a href="/campaigns" class="nav-link" class:nav-link--active={$page.url.pathname.startsWith('/campaigns')}>Campaigns</a>
		<a href="/activity" class="nav-link" class:nav-link--active={$page.url.pathname.startsWith('/activity')}>Activity</a>
	</nav>
</header>

<style>
	header {
		display: flex;
		flex-direction: column;
		justify-content: center;
		border-bottom: 1px solid var(--color-border);
	}

	.brand {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-inline: auto;
		padding-inline: 12px;

		font-weight: 200;
		font-size: 2.5rem;
		text-decoration: none;
		color: var(--color-text-highlight);

		.brand__name {
			margin-inline-start: 8px;
		}

		&:hover {
			background: var(--color-surface-hover);
		}
	}

	nav {
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: calc(var(--spacing) * 2);
		padding-block: calc(var(--spacing) * 1);
		border-top: 1px solid var(--color-border);
	}

	.nav-link {
		padding-inline: calc(var(--spacing) * 3);
		padding-block: calc(var(--spacing) * 1);
		border-radius: 4px;
		text-decoration: none;
		color: var(--color-text-muted);
		font-size: 0.95rem;

		&:hover {
			background: var(--color-surface-hover);
			color: var(--color-text);
		}

		&.nav-link--active {
			color: var(--color-text);
			font-weight: 500;
		}
	}
</style>
