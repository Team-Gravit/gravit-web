import React from "react";

export const renderWithBr = (titles: string[]) => {
	return titles.map((text, idx) => (
		<React.Fragment key={idx}>
			{text}
			{idx < titles.length - 1 && <br />}
		</React.Fragment>
	));
};
