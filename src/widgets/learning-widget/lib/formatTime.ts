const formatTime = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);

	return `${minutes.toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
};
export default formatTime;
