'use client'
import React from 'react';

const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	// Entries can be found as li with id='li-container-*'
	const entries = document.querySelectorAll('li[id^="li-container-"]');
	entries.forEach((entry) => {
		const entryHTMLElement = entry as HTMLElement;
		if (event.target.value === '') {
			entryHTMLElement.style.display = 'block';
		}
		if (!entryHTMLElement.innerHTML.toLowerCase().includes(event.target.value.toLowerCase())) {
			entryHTMLElement.style.display = 'none';
		}
		else {
			entryHTMLElement.style.display = 'block';
		}
	})
}

const Search = () => {
	return (
		<div className="container max-w-5xl mx-auto my-10">
			<input
				type="text"
				placeholder="Search something..."
				className="
				w-full text-center placeholder-center py-2 focus:outline-none 
				bg-gray-100 
				border-b-2 border-gray-100
				focus:border-b-2 focus:border-gray-300
				text-gray-600
				"
				onChange={handleSearchChange}
			/>
		</div>
	);
};

export default Search;
