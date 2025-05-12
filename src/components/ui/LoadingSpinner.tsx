import { twMerge } from 'tailwind-merge';

type SpinnerSize = 'small' | 'medium' | 'large';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const LoadingSpinner = ({ size = 'medium', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-6 h-6 border-2',
    large: 'w-10 h-10 border-3',
  };

  return (
    <div
      className={twMerge(
        'animate-spin rounded-full border-t-transparent border-primary-600',
        sizeClasses[size],
        className
      )}
    />
  );
};

export default LoadingSpinner;