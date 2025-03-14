'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function SpeechModal() {
	const [modal, setModal] = useState(true);

	function toggleModal() {
		setModal(!modal);
	}

	return (
		<div>
			{modal && (
				<div className='absolute top-10 right-10 bottom-10 left-10 p-10 bg-white'>
					<button className='relative float-right' onClick={() => setModal(!modal)}>
						X
					</button>
          <div className='rounded-full md:rounded-full'>
					  <Image className="absolute right-10 bottom-10" src='/mascot.png' alt='placeholder' width={100} height={100} />
          </div>
					{/* SPEECH BUBBLE ELEMENT */}
					<hgroup className='relative bg-red-100 rounded-lg height-3/4'>
            <p className="p-5 text-center height-1/2">
               uam labore autem vel aliquid voluptatem expedita ab, quidem dignissimos quas earum molestias fugiat doloremque aliquam accusamus debitis officiis harum! Quam debitis facere maxime modi provident? <br /> 
              {' '}
            </p>
            <div className="absolute w-0 h-0 
              border-l-[50px] border-l-transparent
              border-t-[50px] border-t-red-100
              border-r-[0px] border-r-transparent
              left-3/4 top-1/1"
              >
            </div>
          </hgroup>
				</div>
			)}
		</div>
	);
}
