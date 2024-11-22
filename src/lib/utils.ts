export function generateRandomColor() {
	const hexColor = Math.floor(Math.random() * 16777215).toString(16);
	// Pad with zeros if needed to ensure 6 digits
	return '#' + hexColor.padStart(6, '0');
}
