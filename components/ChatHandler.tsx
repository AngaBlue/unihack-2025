import fetchAiTasks from '@/util/fetchAITasks';
import { useCallback, useEffect, useState } from 'react';
import ChatOverlay, { type Step } from './ChatOverlay';

const MIN_TASK_TIME = 5_000;
const MAX_TASK_TIME = 20_000;

export default function ChatHander() {
	const [name, setName] = useState('');
	const [goal, setGoal] = useState('');
	const [tasks, setTasks] = useState<string[]>([]);
	const [steps, setSteps] = useState<Step[]>([
		{ message: "Hey there traveler! You've made it to Growth Garden!" },
		{ message: "I'm Bruce, what's your name?", placeholder: 'Enter your name...', onConfirm: setName },
		{ message: 'How would you like to improve your wellbeing?', placeholder: 'Enter your goal...', onConfirm: setGoal }
	]);

	const addStep = useCallback((step: Step) => {
		setSteps(prev => [...prev, step]);
	}, []);

	const fetchGoals = useCallback(async (goal: string) => {
		console.log('fetching goals');
		const res = await fetchAiTasks(goal);
		setTasks(res.tasks);
	}, []);

	// Add name introduction
	useEffect(() => {
		if (!name) return;
		const step: Step = { message: `Hey ${name}, it's nice to meet you!  Let's have a look around!` };
		addStep(step);
	}, [name, addStep]);

	// Add AI
	useEffect(() => {
		if (!goal) return;
		fetchGoals(goal);
	}, [goal, fetchGoals]);

	// Add random task
	useEffect(() => {
		if (tasks.length === 0) return;

		// Add new task
		addStep({
			message: tasks[0],
			onConfirm: addNewTask(`Nice job ${name}!  Here's something to add to your garden!`),
			onCancel: addNewTask(`Don't worry ${name}!  I've got plenty more ideas!`)
		});

		function addNewTask(message: string) {
			return () => {
				addStep({ message });
				const time = Math.random() * (MAX_TASK_TIME - MIN_TASK_TIME) + MIN_TASK_TIME;
				setTimeout(() => setTasks(prev => prev.slice(1)), time);
			};
		}
	}, [name, tasks, addStep]);

	return <ChatOverlay steps={steps} />;
}
