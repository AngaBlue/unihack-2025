import { type NextRequest, NextResponse } from 'next/server';

interface LangflowResponse {
	outputs?: {
		outputs?: {
			results?: {
				message?: {
					text?: string;
				};
			};
		}[];
	}[];
}

export function GET(req: NextRequest) {
	return NextResponse.json({ message: 'USE POST NOT GET FUCKWIT!' });
}

// 🚀 Export named POST function for Next.js App Router
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { userProfile, mode } = body;
		console.log(`mode: ${mode}, user profile: ${userProfile}`)
		// console.log(`mode: ${mode}, user profile: ${userProfile}`)
		// if (!userProfile || typeof userProfile !== "string") {
		//   return NextResponse.json({ error: "Missing or invalid userProfile input." }, { status: 400 });
		// }

		// ✅ Ensure API Key is set in .env
		const API_KEY = process.env.langflowAPIKey;

		// ✅ Correct Langflow API execution URL
		const API_URL =
			'https://api.langflow.astra.datastax.com/lf/e0bbfb5f-0270-4bb5-b347-3b2e5bdc2256/api/v1/run/dbc47ff2-6f38-48ad-ad99-4a85a215c41f?stream=false';

		console.log(
			JSON.stringify({
				inputs: {
					MessageTextInput: { mode: mode, 'user profile': userProfile }
				}
			})
		);
		// ✅ Make request to Langflow Astra API

		const response = await fetch(API_URL, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${API_KEY}`,
				'Content-Type': 'application/json'
				// "x-api-key": <your api key>
			},
			body: JSON.stringify({
				input_value: `mode: ${mode}, user profile: ${userProfile}`,
				output_type: 'chat',
				input_type: 'chat',
				tweaks: {
					'ChatInput-AKYm6': {},
					'OpenAIModel-QFfva': {},
					'ChatOutput-BzOJQ': {},
					'OpenAIModel-yOoFS': {},
					'Agent-IHboQ': {}
				}
			})
		});

		console.log('response recieved');

		if (!response.ok) {
			const errorMessage = await response.text();
			console.error('❌ Langflow API Error:', errorMessage);
			throw new Error(`Langflow API error: ${response.status} - ${errorMessage}`);
		}

		const data: LangflowResponse = await response.json();
		// console.log("✅ Langflow API Response:", JSON.stringify(data, null, 2));

		// ✅ Extract the valid JSON from the response
		const rawMessage = data.outputs?.[0]?.outputs?.[0]?.results?.message?.text;

		if (!rawMessage) {
			throw new Error('❌ Invalid response structure from Langflow API.');
		}

		// ✅ Convert string JSON to a valid object
		const parsedMessage = JSON.parse(rawMessage);
		console.log(parsedMessage);
		return NextResponse.json({ success: true, motivationalMessage: parsedMessage['motivational_messages'], tasks: parsedMessage.tasks });
	} catch (error) {
		console.error('❌ API Error:', error);
		return NextResponse.json({ error: (error as Error).message }, { status: 500 });
	}
}

export const runtime = "nodejs";
export const maxDuration = 60;
