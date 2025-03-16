import { useThree } from '@/context/ThreeContext';
import { addRandomObject } from '@/three/init';
import fetchAiTasks from '@/util/fetchAITasks';
import { useCallback, useEffect, useState } from 'react';
import useSound from 'use-sound';
import ChatOverlay, { type Step } from './ChatOverlay';

const MIN_TASK_TIME = 5_000;
const MAX_TASK_TIME = 20_000;

export default function ChatHandler() {
	const { scene } = useThree();
	const [name, setName] = useState('');
	const [goal, setGoal] = useState('');
	const [tasks, setTasks] = useState<string[]>([]);
	const [steps, setSteps] = useState<Step[]>([
		{ message: "Hey there traveler! You've made it to Growth Garden!" },
		{ message: "I'm Bruce, what's your name?", placeholder: 'Enter your name...', onConfirm: setName }
	]);

	const [playPluck] = useSound('/sounds/rise_ding.mp3', { volume: 0.3 });

	const addStep = useCallback((step: Step) => {
		setSteps(prev => [...prev, step]);
	}, []);

	const fetchGoals = useCallback(async (goal: string) => {
		const res = await fetchAiTasks(goal);
		setTasks(res.tasks);
	}, []);

	// Add name introduction
	useEffect(() => {
		if (!name) return;
		const introduction: Step = { message: `Hey ${name}, it's nice to meet you!` };
		const goalStep: Step = { message: 'How would you like to improve your life?', placeholder: 'Enter your goal...', onConfirm: setGoal };
		addStep(introduction);
		addStep(goalStep);
	}, [name, addStep]);

	// Add AI
	useEffect(() => {
		if (!goal && tasks.length === 0) return;
		fetchGoals(goal);
	}, [goal, tasks, fetchGoals]);

	// Add random task
	useEffect(() => {
		if (tasks.length === 0) return;

		// Add new task
		addStep({
			message: tasks[0],
			onConfirm: addNewTask(`Nice job ${name}!  Here's something to add to your garden!`, true),
			onCancel: addNewTask(`Don't worry ${name}!  I've got plenty more ideas!`)
		});

		function addNewTask(message: string, success = false) {
			return () => {
				if (success) {
					addRandomObject(scene);
					playPluck();
				}
				addStep({ message });
				const time = Math.random() * (MAX_TASK_TIME - MIN_TASK_TIME) + MIN_TASK_TIME;
				setTimeout(() => setTasks(prev => prev.slice(1)), time);
			};
		}
	}, [name, tasks, addStep, playPluck, scene]);

	return <ChatOverlay steps={steps} />;
}
