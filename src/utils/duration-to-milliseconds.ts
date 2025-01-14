export const durationToMilliseconds = (duration: string) => {
  const [minutes, seconds] = duration.split(':').map(Number);
  return (minutes * 60 + seconds) * 1000;
};
