<script>
	export let close

	let message = ""
	let thanks = false

	function submitFeedback() {
	  if (message == "" || message == undefined || message == null) return

	  fetch("/feedback", {
	    method: 'POST',
	    headers: {
	      'Content-Type': 'application/json',
	    },
	    body: JSON.stringify({
	      message: message,
	    })
	  }).then((response) => response.json())
	    .then(json => {
	      thanks = true

	      if (json.success == false) {
		return
	      }

	    })
	    .catch(err => console.error(err))
	}
</script>

<div class="flex items-center justify-center fixed top-0 left-0 w-full h-full bg-black/80">

	<div class="rounded-lg bg-neutral-950 p-6 max-w-[400px] w-full">

          <div class="flex items-center justify-between">
            <div class="text-lg font-semibold text-gray-200"></div>
            <button on:click={() => close()}>Close</button>
          </div>

		<div class="mt-4">

		{#if !thanks}
		<h2 class="text-center text-xl font-semibold text-neutral-200 mb-2">Share what you think</h2>

		<div class="mt-4 flex flex-col gap-4">

		  <textarea class="w-full p-4 bg-neutral-900 rounded-lg border border-neutral-800" placeholder="What you liked, what you hated?" bind:value={message}></textarea>

		  <div>
		    <button class="mx-auto flex items-center gap-2 px-4 py-2 rounded bg-neutral-950 text-white font-medium hover:scale-105 transition-all border border-neutral-800" on:click|preventDefault={() => submitFeedback()}>
		      Submit
		    </button>
		  </div>

		</div>
		{:else}
		<h2 class="text-center text-xl font-semibold text-neutral-200 mb-2">Thank you!</h2>
		{/if}

		</div>

	</div>

</div>
