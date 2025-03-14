'use client';
import Image from 'next/image';
import { useState } from 'react';

interface ModalProps {
	text: string;
}

export default function SpeechModal({ text }: ModalProps) {
	const [modal, setModal] = useState(true);


	function toggleModal() {
		setModal(!modal);
	}

	return (
		<div>
			{modal && (
				<div className='absolute left-10 right-10 bottom-10 top-10 p-5 bg-white/25 rounded-lg'>
					<button className='absolute right-2 top-2 text-red-600' onClick={() => setModal(!modal)}>
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
