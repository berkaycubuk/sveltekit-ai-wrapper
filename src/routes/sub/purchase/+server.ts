export async function POST({ request, getClientAddress, locals: { supabase, session } }) {
    const request_data = await request.json();

    const ip = request.headers.get('x-forwarded-for') || getClientAddress();

	if (!session) {
		return new Response(JSON.stringify({
			success: false,
			error: "No active session.",
		}), { status: 400 });
	}

	const { error } = await supabase.from("user_plans").insert({
		user_id: session.user.id,
		customer_id: request_data.customer_id,
		order_id: request_data.order_id,
		plan_name: 'Pro',
		is_free_trial: true,
		price: 5.00,
	})

	if (error) {
		console.error(error)
	}

	// Return a response
	return new Response(JSON.stringify({
		success: true,
	}), { status: 200 });
}
