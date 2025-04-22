'use client'
import React, { useEffect, useState } from 'react';
import useDebounce from '../libs/useDebounce'

const Search = ({searchTerms} : {searchTerms?: string | undefined}) => {
	const [search, setSearch] = useState(searchTerms || '');
	// Debouncing taken from
	// https://hackernoon.com/how-to-use-debounce-in-nextjs
	const debouncedSearch = useDebounce(search, 500)

	useEffect(() => {
		updateView(debouncedSearch)
	}, [debouncedSearch])


	const updateView = (inputValue: string) => {
		window.history.replaceState({}, '', `/?searchterms=${inputValue}`)
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
