// shared/ui 예시
export default function Button({ onClick }: { onClick: () => void }) {
	return (
		<button type="button" onClick={onClick}>
			Button
		</button>
	);
}
