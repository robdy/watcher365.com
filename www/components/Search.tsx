'use client'
import React, { useEffect, useState } from 'react';
import useDebounce from '../libs/useDebounce'


const Search = () => {
	const [search, setSearch] = useState('');
	// Debouncing taken from
	// https://hackernoon.com/how-to-use-debounce-in-nextjs
	const debouncedSearch = useDebounce(search, 500)

	useEffect(() => {
		console.log('debouncedSearch', debouncedSearch)
		updateView(debouncedSearch)
	}, [debouncedSearch])


	const updateView = (inputValue: string) => {
		// Entries can be found as li with id='li-container-*'
		const entries = document.querySelectorAll('li[id^="li-container-"]');
		entries.forEach((entry) => {
			const entryHTMLElement = entry as HTMLElement;
			if (inputValue === '') {
				entryHTMLElement.style.display = 'block';
			}
			if (!entryHTMLElement.innerHTML.toLowerCase().includes(inputValue.toLowerCase())) {
				entryHTMLElement.style.display = 'none';
			}
			else {
				entryHTMLElement.style.display = 'block';
			}
		})
	}

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
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			{/* <button onClick={() => setSearch(search => `${search} NEW`)}>New</button> */}
		</div>
	);
};

export default Search;
