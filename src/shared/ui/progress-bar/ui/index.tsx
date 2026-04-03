interface ProgressBarProps {
  current: number
  total: number
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = (current / total) * 100;
  
  return (
    <div className='progress-bar'>
      <div className='progress-fill' style={{ width: `${percentage}%` }} />
      <span>{current}/{total}</span>
    </div>
  );
};
