'use client';
import Image from 'next/image';
import { ReactElement, useState } from 'react';

export interface ModalChainProps {
	speechChain: ModalProps[];
}

export interface ModalProps {
	text: string;
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
 */
export function SpeechModal({speechChain}: ModalChainProps) : ReactElement | null {

	const [index, setIndex] = useState(0);

	return (
		<div>
			{(index < speechChain.length) && (
				<div className='absolute left-10 right-10 bottom-10 top-10 p-5 bg-white/25 rounded-lg'>
					<div>					
						<Image className='absolute -right-2 -bottom-2 rounded-full' src='/mascot.png' alt='placeholder' width={100} height={100} />
					</div>
					{/* SPEECH BUBBLE ELEMENT */}
					<div className='relative bg-red-100/90 rounded-lg h-3/4 top-5'>
						<p className='p-5 text-center'>{speechChain[index].text}</p>

						<div
							className='absolute w-0 h-0 
						border-l-[50px] border-l-transparent
						border-t-[50px] border-t-red-100/90
						border-r-[0px] border-r-transparent
						left-3/4 top-1/1'
						></div>

						{/* Next Button / Close button / Submit Button*/}
						<button
							className='absolute right-10 bottom-10 p-5 bg-green-500/100 rounded-lg'
							onClick={() => {setIndex(index + 1)}}
						>
							{/* Close button if this is the last item */}
							{(index < speechChain.length-1) ? 'Next →' : 'Close X'} 
						</button>
					</div>

				</div>
			)}
		</div>
	);
}


export const speechChain: ModalProps[] = [
	{
		text: 'Hey there traveler! You have arrived at the Growth Garden.',
	},
	{
		text: 'I see! What do you hope to learn from me?',
	},
	{
		text: 'Interesting! What do you think you can teach me?',
	},

];
