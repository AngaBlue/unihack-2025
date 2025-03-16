async function queryAI(userInformation: string) {
	try {
		const res = await fetch('/GetSkills', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userProfile: `How can I get better at: ${userInformation}`
			})
		});

		if (!res.ok) {
			throw new Error('Failed to fetch skills');
		}

		const data = await res.json();
		for (const property in data) {
			console.log(`${property} = ${data[property]}`);
		}

		console.log(`Data = ${data}`);
		return data;
	} catch (error) {
		console.error('Error fetching skills:', error);
	}
}

export default queryAI;
