import type React from 'react';
import { ReactElement, type ReactNode, createContext, useContext, useState } from 'react';
import { type ModalProps, ValueToChange } from '@/components/SpeechModal';

// Define the type for context state
interface GoalContextType {
	name: string;
	goal: string;
	skillTree: string[];
	speechModalScript: ModalProps[];
	speechIndex: number;
	setName: (name: string) => void;
	setGoal: (goal: string) => void;
	setSkillTree: (skillTree: string[]) => void;
	setSpeechModalScript: (script: ModalProps[]) => void;
	setSpeechIndex: (index: number) => void;
}

// Create the context with an initial empty state
const GoalContext = createContext<GoalContextType | undefined>(undefined);

// Create a provider component
export const GoalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [name, setName] = useState<string>(''); // Initialize with an empty string or any default value
	const [goal, setGoal] = useState<string>(''); // Same for goal state
	const [skillTree, setSkillTree] = useState<string[]>([]);

	const [speechModalScript, setSpeechModalScript] = useState<ModalProps[]>(welcomeSpeech);
	const [speechIndex, setSpeechIndex] = useState<number>(0);


	return <GoalContext.Provider value={{ 
		name, goal, setName, setGoal, skillTree, setSkillTree, 
		speechModalScript, setSpeechModalScript, speechIndex, setSpeechIndex 
	}}>{children}</GoalContext.Provider>;
};

// Custom hook to use the GoalContext
export const useGoalContext = (): GoalContextType => {
	const context = useContext(GoalContext);
	if (!context) {
		throw new Error('useGoalContext must be used within a GoalProvider');
	}
	return context;
};




export const welcomeSpeech: ModalProps[] = [
	{
		text: 'Hey there traveler! You have arrived at the Growth Garden.',
		changeValue: ValueToChange.NONE
	},
	{
		text: 'What do you hope to learn from me?',
		inputInstruction: 'How can I get better at ...?',
		changeValue: ValueToChange.GOAL
	},
	{
		text: 'Awesome, I think I can help you with that. What is your name?',
		inputInstruction: 'Your Name:',
		changeValue: ValueToChange.NAME
	},
	{
		text: `Nice to meet you, {${ValueToChange.NAME}}! I am your guide, Growth Garden. I will help you reach your goal.`,
		changeValue: ValueToChange.NONE
	},
	{
		text: 'Let us begin!',
		changeValue: ValueToChange.NONE
	}
];

export const reviseGoalSpeech: ModalProps[] = [
	{
		text: `Hey there {${ValueToChange.NAME}}, I'm so sorry that your goal, {${ValueToChange.GOAL}}, is not working out 😞`,
		changeValue: ValueToChange.NONE
	},
	{
		text: 'Let\'s change your goal to something that works better for you!',
		inputInstruction:"I would like to be better at...",
		changeValue: ValueToChange.GOAL
	},
	{
		text: 'Awesome! Let\s get to it!',
		changeValue: ValueToChange.NONE
	}
];


export function ScriptChangeButton() : ReactElement {
	const { setSpeechModalScript } = useGoalContext();
	const { setSpeechIndex } = useGoalContext();
	const { goal } = useGoalContext();

	const changeScript = () => {
			setSpeechModalScript(reviseGoalSpeech);
			setSpeechIndex(0);
	};

	return <div className='flex flex-row absolute top-3 left-3 space-x-1.5'>
		<p className='bg-background text-foreground border-highlight border-2 rounded-lg p-2 '>Your Goal: {goal} </p>
		<button type='button' onClick={changeScript} className='bg-transparent border-transparent text-highlight'> <i>Revise</i></button>
	</div>
	
	
}