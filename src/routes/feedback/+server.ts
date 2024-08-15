import { supabase } from "$lib/supabaseClient"

export async function POST({ request, getClientAddress }) {
    const request_data = await request.json();

    const ip = request.headers.get('x-forwarded-for') || getClientAddress();

	await supabase.from("feedbacks").insert({
		message: request_data.message,
		ip_address: ip,
	})

	// Return a response
	return new Response(JSON.stringify({
		success: true,
	}), { status: 200 });
}
