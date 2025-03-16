import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import mascot from '@/public/icon.png';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

export interface Step {
	message: string;
	placeholder?: string;
	minLength?: number;
	maxLength?: number;
	onConfirm?: (data: string) => void;
	onCancel?: () => void;
}

export interface ChatOverlayProps {
	steps: Step[];
}

export default function ChatOverlay({ steps }: ChatOverlayProps) {
	const [stepIndex, setStepIndex] = useState(0);
	const [response, setResponse] = useState<string>('');

	const currentStep = steps[stepIndex] as Step | undefined;

	const handleNext = () => {
		setStepIndex(prev => prev + 1);
		setResponse('');
	};

	const handleConfirm = () => {
		if (currentStep?.onConfirm) {
			currentStep.onConfirm(response);
			handleNext();
		}
	};

	const handleCancel = () => {
		if (currentStep?.onCancel) {
			currentStep.onCancel();
			handleNext();
		}
	};

	if (!currentStep) return;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
			className='fixed bottom-20 right-20 flex items-end space-x-2'
		>
			<div className='w-84 bg-brand-50 shadow-lg rounded-2xl p-4 flex flex-col space-y-4 border border-brand-300 relative'>
				<Card className='relative bg-brand-100 text-brand-900 border-2 border-background'>
					<CardContent className='p-4 space-y-4'>
						<p className='text-sm text-brand-900'>{currentStep.message}</p>
						{currentStep.placeholder && (
							<Input
								type='text'
								autoFocus
								placeholder={currentStep.placeholder || 'Enter response'}
								value={response}
								minLength={currentStep.minLength}
								maxLength={currentStep.maxLength}
								className='border-brand-400 text-brand-900 focus:ring-brand-500 focus:border-brand-500'
								onChange={e => setResponse(e.target.value)}
								onKeyDown={e => e.key === 'Enter' && handleConfirm()}
							/>
						)}
						<div className='flex justify-end space-x-2'>
							{currentStep.onCancel && (
								<Button
									onClick={handleCancel}
									variant='outline'
									className='border-brand-500 hover:bg-brand-300 bg-brand-200 text-brand-900 cursor-pointer'
								>
									Skip
								</Button>
							)}
							{currentStep.onConfirm && (
								<Button onClick={handleConfirm} className='bg-brand-600 text-white hover:bg-brand-700 cursor-pointer'>
									{currentStep.onCancel ? 'Done!' : 'Confirm'}
								</Button>
							)}
							{!(currentStep.onConfirm || currentStep.onCancel) && (
								<Button onClick={handleNext} className='bg-brand-700 text-white hover:bg-brand-800 cursor-pointer'>
									Next
								</Button>
							)}
						</div>
					</CardContent>
					<div
						className='absolute w-0 h-0
								border-l-[57px] border-l-transparent
								border-t-[34px] border-t-background
								border-r-[6px] border-r-transparent
								right-2 top-1/1'
					/>
					<div
						className='absolute w-0 h-0 
								border-l-[50px] border-l-transparent
								border-t-[30px] border-t-brand-100
								border-r-[5px] border-r-transparent
								right-3 top-1/1'
					/>
				</Card>
				<div className='absolute -right-10 -bottom-16 w-20 h-20 rounded-full overflow-hidden border-4 border-brand-400 bg-brand-700 shadow-md'>
					<Image src={mascot} alt='Mascot' layout='fill' objectFit='contain' className='animate-float' />
				</div>
			</div>
		</motion.div>
	);
}
