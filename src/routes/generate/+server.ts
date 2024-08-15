//import { supabase } from "$lib/supabaseClient"
import { OPENAI_API_KEY } from '$env/static/private'

export async function POST({ request, getClientAddress, locals: { supabase, session } }) {
    const server_url = "http://localhost:5173"

    const request_data = await request.json();

    const ip = request.headers.get('x-forwarded-for') || getClientAddress();

    const { data, error } = await supabase.from("generations").select("id").eq("ip_address", ip).gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())

    const free_hourly_limit = 3

    const pro_hourly_limit = 20

    if (session) {
      // validate subscription
      const response = await fetch(server_url + '/sub/active')
      const json_response = response.json()
      if (json_response.subscription) {
	if (data.length >= pro_hourly_limit) {
		return new Response(JSON.stringify({
			success: false,
			error: "Hourly limit reached, please try again in the next hour.",
		}), { status: 429 });
	}
      } else {
	if (data.length >= free_hourly_limit) {
		return new Response(JSON.stringify({
			success: false,
			error: "Hourly limit reached, please try again in the next hour.",
		}), { status: 429 });
	}
      }
    } else {
      if (data.length >= free_hourly_limit) {
	      return new Response(JSON.stringify({
		      success: false,
		      error: "Hourly limit reached, please try again in the next hour.",
	      }), { status: 429 });
      }
    }

    const openaiApiKey = OPENAI_API_KEY

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: "You're a HTML and TailwindCSS component generator. You generate HTML components that looks great and professional. You generate code for the users requirements. You only return the code, you're not chatting with the user. Your responses will be directly implemented into the code. Do not cover the code with backticks, your response will be directly applied to the code. If the user writes something inappropriate for the content of the element, change the content.",
          },
          {
            role: 'user',
            content: request_data.prompt,
          },
        ],
      }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Authorization": "Bearer " + openaiApiKey,
      },
    })

	const response_json = await response.json()

	console.log(response_json)

	if (response_json.error) {
		return new Response(JSON.stringify({
			success: false,
			error: "Something went wrong :^(",
		}), { status: 500 });
	}

	let generated = response_json.choices[0].message.content

	if (session) {
	  await supabase.from("generations").insert({
		  prompt: request_data.prompt,
		  generation: generated,
		  ip_address: ip,
		  user_id: session.user.id,
		  is_public: false,
	  })
	} else {
	  await supabase.from("generations").insert({
		  prompt: request_data.prompt,
		  generation: generated,
		  ip_address: ip,
	  })
	}

	// Return a response
	return new Response(JSON.stringify({
		success: true,
		generation: generated,
	}), { status: 200 });
}
