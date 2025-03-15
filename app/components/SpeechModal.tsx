'use client';
import Image from 'next/image';
import { useState } from 'react';

export interface ModalProps {
	text: string;
	nextButton: HTMLButtonElement;
}

export function SpeechModal( {text, nextButton}: ModalProps) {
	const [modal, setModal] = useState(true);


	function toggleModal() {
		setModal(!modal);
	}

	return (
		<div>
			{modal && (
				<div className='absolute left-10 right-10 bottom-10 top-10 p-5 bg-white/25 rounded-lg'>
					<button className='absolute right-2 top-2 text-red-600 font-bold' onClick={() => setModal(!modal)}>
						X
					</button>
					<div>					
						<Image className='absolute -right-2 -bottom-2 rounded-full' src='/mascot.png' alt='placeholder' width={100} height={100} />
					</div>
					{/* SPEECH BUBBLE ELEMENT */}
					<hgroup className='relative bg-red-100/90 rounded-lg h-3/4 top-5'>
						<p className='p-5 text-center'>{text}</p>

						<div
							className='absolute w-0 h-0 
						border-l-[50px] border-l-transparent
						border-t-[50px] border-t-red-100/90
						border-r-[0px] border-r-transparent
						left-3/4 top-1/1'
						></div>
					</hgroup>
				</div>
			)}
		</div>
	);
}


export function InfoModal({ text }: ModalProps) {}

export function InputModal({ text }: ModalProps) {
	return (
		SpeechModal({ text, nextButton: new HTMLButtonElement() })
	);
}



export function NextButton({ nextButton }: ModalProps) {
	return (
		<button
			className='absolute right-10 bottom-10 p-5 bg-white/25 rounded-lg'
			onClick={() => nextButton.click()}
		>
			Next →
		</button>
	);
}

export default function createChain(){

}
