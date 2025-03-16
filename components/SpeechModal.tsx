'use client';
import { useGoalContext } from '@/context/GoalContext';
import queryAI from '@/util/queryAI';
import Image from 'next/image';
import { type FormEventHandler, type ReactElement, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

export interface ModalChainProps {
	speechChain: ModalProps[];
}

export interface ModalProps {
	text: string;
	inputInstruction?: string;
	changeValue: ValueToChange;
}

export enum ValueToChange {
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
export function SpeechModal(): ReactElement | null {
	const { name, setName } = useGoalContext();
	const { goal, setGoal } = useGoalContext();
	const { setSkillTree } = useGoalContext();

	const { speechModalScript } = useGoalContext();
	const {speechIndex, setSpeechIndex} = useGoalContext();

	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleFormSubmit: FormEventHandler<HTMLFormElement> = async e => {
		if (isLoading){
			setIsLoading(false);
			setSpeechIndex(speechIndex + 1);
		} else {
		
			e.preventDefault();
			if (speechIndex < speechModalScript.length && speechModalScript[speechIndex].inputInstruction) {
				switch (speechModalScript[speechIndex].changeValue) {
					case ValueToChange.GOAL:
						setGoal(input);
						break;
					case ValueToChange.NAME:
						setName(input);
						break;
				}
			}
			
			document.getElementById('replyInput')?.setAttribute('value', ''); // speechModalScript[speechIndex].userInput);
			console.log(`Goal: ${goal}, Name: ${name}, Index ${speechIndex}`);

			if (speechIndex >= speechModalScript.length - 1) {
				setIsLoading(true);
				const { tasks } = await queryAI(goal);
				setIsLoading(false);
				setSkillTree(tasks);
			}
			
			setSpeechIndex(speechIndex + 1);
			setInput('');
		}
	};

	// Alter the messages such that they are customised to the user
	let message = '';
	if (speechIndex < speechModalScript.length){
		message = (speechModalScript[speechIndex].text).replace(`{${ValueToChange.NAME}}`, name);
		message = message.replace(`{${ValueToChange.GOAL}}`, goal);
	}

	return (
		<div className='text-foreground text-xl'>
			{(isLoading || speechIndex < speechModalScript.length) && (
				<div className='absolute left-10 right-10 bottom-10 top-10 p-5 bg-transparent rounded-lg'>
					<div>
						<Image className='absolute -right-2 -bottom-2 rounded-full' src='/icon.png' alt='placeholder' width={100} height={100} />
					</div>
					{/* SPEECH BUBBLE ELEMENT */}
					<div className='relative bg-background/95 rounded-lg h-3/4 top-5 border-6 border-highlight flex flex-col justify-center items-center'>
						<p className='p-10 text-center'>{isLoading ? 'Thinking of steps to take for your goal, I\'ll let you know when I\'ve got something for you ☺️' : message}</p>
						{isLoading ? (
							<div className='flex justify-center items-center w-full h-full'>
								<FaSpinner className='animate-spin h-8 w-8 text-foreground' />
							</div>
						) : null}
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
						<form onSubmit={handleFormSubmit} className='w-full flex align-middle justify-center'>
							{!isLoading && speechIndex < speechModalScript.length && speechModalScript[speechIndex].inputInstruction && (
								<input
									id='replyInput'
									type='text'
									placeholder={speechModalScript[speechIndex].inputInstruction}
									className='w-3/4 p-5 m-5 rounded-lg text-foreground border-2 border-highlight'
									onChange={e => setInput(e.target.value)}
									value={input}
								/>
							)}

							{/* Next Button / Close button / Submit Button */}
							<button type='submit' className='absolute right-10 bottom-10 p-5 bg-highlight/100 rounded-lg'>
								{speechIndex < speechModalScript.length-1 ? 'Next →' : 'Close X'}
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}