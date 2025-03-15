'use client';
import Image from 'next/image';
import { type FormEventHandler, type ReactElement, useState } from 'react';
import { useGoalContext } from '@/app/GoalContext';
import queryAI from '@/util/queryAI';

export interface ModalChainProps {
	speechChain: ModalProps[];
}

export interface ModalProps {
	text: string;
	inputInstruction?: string;
	changeValue:ValueToChange;
}

enum ValueToChange {
	NONE = 0,
	NAME = 1,
	GOAL = 2
}





// Requires Next Modal to be set up first.
/**
 * If nextModal is set, a button will be displayed to move to the next modal.
 * If nextModal is not set, the next button will have the close functionality.
 * If submit button is set, it will have the funcitonality of the next button or x button depending on the nextModal prop.
 * The submit button will also have the functionality of setting the text of xxxx to the value of the input field.
 * @param param0
 * @param setModal
 * @param modal
 * @returns
 * @param param0
 * @param setModal
 * @param modal
 * @returns
 */
export function SpeechModal({ speechChain }: ModalChainProps): ReactElement | null {
	
	const { name, setName } = useGoalContext();
	const { goal, setGoal } = useGoalContext();
	const { skillTree, setSkillTree } = useGoalContext();

	const [index, setIndex] = useState(0);
	const [input, setInput] = useState('');

	

	const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		if (index < speechChain.length && speechChain[index].inputInstruction){
			switch (speechChain[index].changeValue) {
				case (ValueToChange.GOAL) : setGoal(input); break;
				case (ValueToChange.NAME) : setName(input); break;
			}
		}
		setIndex(index + 1);
		setInput('');
		document.getElementById('replyInput')?.setAttribute('value', ''); // speechChain[index].userInput);
		console.log(`Goal: ${goal}, Name: ${name}, Index ${index} `);
		
		if (index >= speechChain.length){
			const { success, tasks, motivationals } = await queryAI(goal);
			
			setSkillTree(tasks);
			console.log(skillTree);
			// TODO set Motivationals
		}
	};

	return (
		<div className='text-foreground text-xl'>
			{index < speechChain.length && (
				<div className='absolute left-10 right-10 bottom-10 top-10 p-5 bg-tansparent rounded-lg'>
					<div>
						<Image className='absolute -right-2 -bottom-2 rounded-full' src='/mascot.png' alt='placeholder' width={100} height={100} />
					</div>
					{/* SPEECH BUBBLE ELEMENT */}
					<div className='relative bg-background/95 rounded-lg h-3/4 top-5 border-6 border-highlight'>
						<p className='p-10 text-center align-middle'>{speechChain[index].text}</p>
						
						<div
							className='absolute w-0 h-0
							border-l-[64px] border-l-transparent
							border-t-[60px] border-t-highlight
							border-r-[9px] border-r-transparent
							right-13 top-1/1'
							/>
						<div
							className='absolute w-0 h-0 
							border-l-[50px] border-l-transparent
							border-t-[50px] border-t-background
							border-r-[5px] border-r-transparent
							right-15 top-1/1'
						/>

						{/* Input Element */}
						<form onSubmit={handleFormSubmit}>
							{index < speechChain.length && speechChain[index].inputInstruction && (
								<input
									id='replyInput'
									type='text'
									placeholder={speechChain[index].inputInstruction}
									className='p-5 m-5 rounded-lg text-foreground'
									onChange={e => setInput(e.target.value)}
									value={input}
								/>
							)}

							{/* Next Button / Close button / Submit Button*/}
							<button type='submit' className='absolute right-10 bottom-10 p-5 bg-highlight/100 rounded-lg'>
								{/* Close button if this is the last item */}
								{index < speechChain.length - 1 ? 'Next →' : 'Close X'}
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}


export const speechChain: ModalProps[] = [
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
		text: 'Nice to meet you, xxxx! I am your guide, Growth Garden. I will help you reach your goal.',
		changeValue: ValueToChange.NONE
	},
	{
		text: 'Let us begin!',
		changeValue: ValueToChange.NONE
	}
];
