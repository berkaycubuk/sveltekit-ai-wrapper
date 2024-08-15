<script>
	export let close
	export let supabase
	export let showPlans
	export let manageSubLink
</script>

<style>
@keyframes submitAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.submit-animation {
  animation-name: submitAnimation;
  animation-duration: 6s;
  animation-iteration-count: infinite;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
}
</style>

<div class="flex items-center justify-center fixed top-0 left-0 w-full h-full bg-black/80">

	<div class="rounded-lg bg-neutral-950 p-6 max-w-[400px] w-full">

          <div class="flex items-center justify-between">
            <div class="text-lg font-semibold text-gray-200"></div>
            <button on:click={() => close()}>Close</button>
          </div>

		<div class="mt-4 flex flex-col gap-2">

		  {#if !showPlans && manageSubLink}
		  <a href={manageSubLink} target="_blank" class="flex items-center justify-center gap-2 px-4 py-2 rounded bg-neutral-950 text-white font-medium hover:scale-105 transition-all border border-neutral-800 text-sm md:text-base">
		    Billing
		  </a>
		  {/if}

		  <button class="flex items-center justify-center gap-2 px-4 py-2 rounded bg-neutral-950 text-white font-medium hover:scale-105 transition-all border border-neutral-800 text-sm md:text-base" on:click|preventDefault={async () => await supabase.auth.signOut()}>
		    Logout
		  </button>

		</div>

	</div>

</div>
