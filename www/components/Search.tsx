'use client'
import React from 'react';

const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	// Entries can be found as div with id='container-*'
	const entries = document.querySelectorAll('div[id^="container-"]');
	console.log(event.target.value);
	entries.forEach((entry) => {
		if (event.target.value === '') {
			(entry as HTMLElement).style.display = 'block';
		}
		if (!(entry as HTMLElement).innerHTML.toLowerCase().includes(event.target.value.toLowerCase())) {
			(entry as HTMLElement).style.display = 'none';
		}
		else {
			(entry as HTMLElement).style.display = 'block';
		}
	})
	if (event.target.value === 'a') {
		console.log(entries[0]);
		(entries[0] as HTMLElement).style.display = 'none';
		console.log(entries[0]);
	}
}

const Search = () => {
  return (
    <div>
      <input type="text" placeholder="Search..." onChange={handleSearchChange}/>
      <button>Search</button>
    </div>
  );
};

export default Search;
