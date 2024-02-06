import React, { useState } from "react";

const InPageNavigation = ({ routes, activeIndex = 0, defaultHidden = [], children }) => {
	const [inPageNavIndex, setInPageNavIndex] = useState(activeIndex);
	return (
		<>
			<div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
				{routes.map((route, i) => {
					return (
						<button
							onClick={() => setInPageNavIndex(i)}
							key={i}
							className={`p-4 px-5 capitalize transition-all duration-150 ${
								defaultHidden.includes(route) ? "md:hidden" : ""
							} ${inPageNavIndex === i ? "text-black border-b border-black ease-out" : `text-dark-grey`}`}>
							{route}
						</button>
					);
				})}
			</div>
			{Array.isArray(children) ? children[inPageNavIndex] : children}
		</>
	);
};

export default InPageNavigation;
