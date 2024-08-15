<script>
	export let close
	export let generation

	import Highlight from "svelte-highlight"
	import ashes from "svelte-highlight/styles/ashes"
	import xml from "svelte-highlight/languages/xml"
	import { onDestroy, onMount } from "svelte";

	let tailwindLink
	let copied = false

	onMount(() => {
		tailwindLink = document.createElement("link");
		tailwindLink.rel = "stylesheet";
		tailwindLink.href = "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
		document.head.appendChild(tailwindLink);
	});

	function copyToClipboard() {
		navigator.clipboard.writeText(generation.generation);
		copied = true
	}

	onDestroy(() => {
		if (tailwindLink) {
			document.head.removeChild(tailwindLink);
		}
	})
</script>

<div class="fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center">

	<div class="p-6 bg-neutral-950 rounded-lg container w-full max-h-[90vh] overflow-y-auto">

		<div class="flex items-center justify-between">
			<div></div>
			<button class="px-3 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-all" on:click|preventDefault={() => close()}>Close</button>
		</div>

		<div class="mt-4">

			<h2 class="text-2xl mb-10 italic">"{generation.prompt}"</h2>

			<div class="max-h-[60vh] overflow-y-auto text-black">
				{@html generation.generation}
			</div>

			<div class="mt-10 max-h-[20vh] max-w-[80vw] overflow-y-auto">
				<Highlight code={generation.generation} language={xml} />
			</div>

			<div class="mt-4">

              <button class="flex items-center mx-auto gap-2 hover:gap-3 transition-all bg-black text-white hover:bg-neutral-900 font-semibold py-2 px-4 border border-black rounded" on:click|preventDefault={() => copyToClipboard()}>
				{#if copied}
				Copied
				{:else}
                Copy to clipboard
				{/if}
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-copy"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><path d="M16 4h2a2 2 0 0 1 2 2v4"/><path d="M21 14H11"/><path d="m15 10-4 4 4 4"/></svg>
              </button>

			</div>

		</div>

	</div>

</div>
