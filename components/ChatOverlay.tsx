import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
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
			className='fixed bottom-5 right-5 w-80 bg-white shadow-lg rounded-2xl p-4 flex flex-col space-y-4 border border-gray-200'
		>
			<Card className='relative'>
				<CardContent className='p-4 space-y-4'>
					<p className='text-sm text-gray-800'>{currentStep.message}</p>
					{currentStep.placeholder && (
						<Input
							type='text'
							autoFocus
							placeholder={currentStep.placeholder || 'Enter response'}
							value={response}
							minLength={currentStep.minLength}
							maxLength={currentStep.maxLength}
							onChange={e => setResponse(e.target.value)}
							onKeyDown={e => e.key === 'Enter' && handleConfirm()}
						/>
					)}
					<div className='flex justify-end space-x-2'>
						{currentStep.onCancel && (
							<Button onClick={handleCancel} variant='outline'>
								Cancel
							</Button>
						)}
						{currentStep.onConfirm && <Button onClick={handleConfirm}>Confirm</Button>}
						{!(currentStep.onConfirm || currentStep.onCancel) && <Button onClick={handleNext}>Next</Button>}
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
