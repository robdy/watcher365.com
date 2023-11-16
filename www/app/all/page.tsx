import React from 'react';
import EntryTile from '@/components/EntryTile';
import Search from '@/components/Search';
const util = require('node:util');
const fs = require('fs');
const exec = util.promisify(require('node:child_process').exec);

const AllPage = async () => {
	const { stdout } = await exec('find ../data/versions/ -mindepth 1 -type d')
	let filesArr: string[] = stdout.split('\n')
	// Remove last empty item
	filesArr.pop()

	let entriesArr: any[] = filesArr.map((file) => {
		const allVersions = fs.readdirSync(file)
		const latestVersion = allVersions[allVersions.length - 1]
		return ({
			id: file.split('/')[3],
			latestVersion: latestVersion
		})
	})
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