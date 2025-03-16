interface Response {
	motivation_messages: string[];
	tasks: string[];
}

export default async function fetchAiTasks(goal: string): Promise<Response> {
	try {
		throw new Error();
		const res = await fetch('/GetSkills', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userProfile: `How can I get better at: ${goal}`
			})
		});

		if (!res.ok) {
			throw new Error('Failed to fetch tasks.');
		}

		const data = await res.json();
		for (const property in data) {
			console.log(`${property} = ${data[property]}`);
		}

		console.log(`Data = ${data}`);
		return data;
	} catch (error) {
		console.error('Error fetching tasks.', error);
	}

	return {
		motivation_messages: [],
		tasks: ['Drink a glass of water.', 'Take a 5 minute walk outside.', 'Do a quick meditation session.']
	};
}
