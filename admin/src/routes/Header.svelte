<script lang="ts">
	import { resolve } from '$app/paths';
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
</header>

<style>
	header {
		display: flex;
		flex-direction: column;
		justify-content: center;
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

		.brand__name {
			margin-inline-start: 8px;
		}
	}
</style>
