import React from 'react';
import EntryTile from '@/components/EntryTile';
import Search from '@/components/Search';
import { pullAllEntryIDs, pullAllVersionsFromEntryID } from '@/libs/pullData';

const AllPage = async () => {
	const allEntries = await pullAllEntryIDs();

	const entriesPromisesArr: any[] = allEntries.map(async (id) => {
		const allVersions = await pullAllVersionsFromEntryID(id);
		const latestVersion = allVersions[allVersions.length - 1]
		return ({
			id: id,
			latestVersion: `v${latestVersion}.json`
		})
	})
	const entriesArr = await Promise.all(entriesPromisesArr)
	return (
		<section className="container max-w-5xl mx-auto ">
			<Search />
			<div className="my-10">
				{entriesArr.map((item, index) => (
					<ul className="my-3 divide-y-2 text-sm md:text-base" key={`list-${item}`}>
						<EntryTile key={index} entryID={item.id} version={item.latestVersion} />
					</ul>
				))}
			</div>
		</section>
	);
};

export default AllPage;