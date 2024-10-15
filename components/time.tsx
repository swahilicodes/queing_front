import { useState, useEffect } from 'react';

type TimeAgoProps = {
  isoDate: string;
};

const TimeAgo: React.FC<TimeAgoProps> = ({ isoDate }) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTimeAgo = () => {
      const currentTime = new Date().getTime();
      const previousTime = new Date(isoDate).getTime();
      const differenceInSeconds = Math.floor((currentTime - previousTime) / 1000);

      let timeString = '';

      if (differenceInSeconds < 60) {
        timeString = `${differenceInSeconds} seconds ago`;
      } else if (differenceInSeconds < 3600) {
        const minutes = Math.floor(differenceInSeconds / 60);
        timeString = `${minutes} minutes ago`;
      } else if (differenceInSeconds < 86400) {
        const hours = Math.floor(differenceInSeconds / 3600);
        timeString = `${hours} hours ago`;
      } else {
        const days = Math.floor(differenceInSeconds / 86400);
        timeString = `${days} days ago`;
      }

      setTimeAgo(timeString);
    };

    // Initial call and then every 60 seconds to keep it updated
    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [isoDate]);

  return <span>{timeAgo}</span>;
};

export default TimeAgo;
