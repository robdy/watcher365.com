
import EntryTileView from '@/components/EntryTileView';
import React from 'react';
import { readFile } from 'fs/promises';
import util from 'node:util';
const exec = util.promisify(require('node:child_process').exec);

export const dynamic = 'force-static';

type WeeklyData = {
	Path: string;
	CurrentVersion: {
		guid: string;
		link: string;
		category: string[];
		title: string;
		description: string;
		publicDisclosureAvailabilityDate: string | null;
		publicPreviewDate: string | null;
		pubDate: string;
		updated: string;
	};
	OldVersion: {
		guid: string;
		link: string;
		category: string[];
		title: string;
		description: string;
		publicDisclosureAvailabilityDate: string | null;
		publicPreviewDate: string | null;
		pubDate: string;
		updated: string;
	};
}


export async function generateStaticParams() {
	const { stdout } = await exec('ls data/weekly')
	const filesArr: string[] = stdout.split('\n')

	return filesArr.map((file) => ({
		id: file.replace(/\.json$/, ''),
	}))
}

const Weekly = async ({ params }: { params: { id: string } }) => {
	const { id } = params
	
	// Import file from data/weekly/${id}.json using fs
	const data = await readFile(`data/weekly/${id}.json`, 'utf-8')
	const dataArr = JSON.parse(data) as WeeklyData[]
	let otherItems = dataArr

	// Functions for detecting change types
	// If OldVersion is {} then it's a new item
	const isAdded = (item: WeeklyData) => JSON.stringify(item.OldVersion) === JSON.stringify({})
	// Check if GA or preview dates were changed
	const isRescheduled = (item: WeeklyData) => item.OldVersion.publicDisclosureAvailabilityDate !== item.CurrentVersion.publicDisclosureAvailabilityDate || item.OldVersion.publicPreviewDate !== item.CurrentVersion.publicPreviewDate
	const isLaunched = (item: WeeklyData) => !item.OldVersion.category.includes('Launched') && item.CurrentVersion.category.includes('Launched')
	const isRollingOut = (item: WeeklyData) => !item.OldVersion.category.includes('Rolling out') && item.CurrentVersion.category.includes('Rolling out')
	const isRelevant = (item: WeeklyData) => {
		let {pubDate: currentPubDate, updated: currentUpdated, ...currentVersionRel} = item.CurrentVersion
		let {pubDate: oldPubDate, updated: oldUpdated, ...oldVersionRel} = item.OldVersion
		// If items are the same then the entry is not relevant
		return JSON.stringify(currentVersionRel) !== JSON.stringify(oldVersionRel)
	}

	const addedItems = dataArr.filter(isAdded)
	otherItems = otherItems.filter(item => !addedItems.includes(item))

	// TODO Perhaps we should ignore the fact that the item was rescheduled if status was changed??
	const multipleChangesItems = otherItems.filter(item => {
		let counter = 0
		if (isRescheduled(item)) counter++
		if (isLaunched(item)) counter++
		if (isRollingOut(item)) counter++

		return counter > 1
	})
	otherItems = otherItems.filter(item => !multipleChangesItems.includes(item))

	const launchedItems = otherItems.filter(isLaunched)
	otherItems = otherItems.filter(item => !launchedItems.includes(item))

	const rollingOutItems = otherItems.filter(isRollingOut)
	otherItems = otherItems.filter(item => !rollingOutItems.includes(item))

	const rescheduledItems = otherItems.filter(isRescheduled)
	otherItems = otherItems.filter(item => !rescheduledItems.includes(item))

	const irrelevantItems = otherItems.filter(item => !isRelevant(item))
	otherItems = otherItems.filter(item => !irrelevantItems.includes(item))

	return (
		<section className="container max-w-5xl mx-auto ">
			<div className="my-10">
				<h2 className={"text-green-700 font-bold text-sm md:text-base"}>
					Summary
				</h2>
				<p>{`${dataArr.length} items were changed`}</p>
				<p>{`${addedItems.length} items were added`}</p>
				<p>{`${multipleChangesItems.length} items with multiple changes`}</p>
				<p>{`${rescheduledItems.length} items were rescheduled`}</p>
				<p>{`${launchedItems.length} items were launched`}</p>
				<p>{`${rollingOutItems.length} items started rollout`}</p>
				<p>{`${irrelevantItems.length} items were irrelevant`}</p>

				<p>{`${otherItems.length} other items`}</p>
				<h2 className={"text-green-700 font-bold text-sm md:text-base"}>
					Added items
				</h2>
				<ul className="my-3 divide-y-2 text-sm md:text-base">
					{addedItems.map(item => (
						<EntryTileView beforeObj={{
							category: [],
							title: '',
							description: ''
						}} afterObj={item.CurrentVersion} key={item.Path} />)
					)}
				</ul>

				<h2 className={"text-green-700 font-bold text-sm md:text-base"}>
					Items with multiple changes
				</h2>
				<ul className="my-3 divide-y-2 text-sm md:text-base">
					{multipleChangesItems.map(item => (
						<EntryTileView beforeObj={item.OldVersion} afterObj={item.CurrentVersion} key={item.Path} />)
					)}
				</ul>

				<h2 className={"text-green-700 font-bold text-sm md:text-base"}>
					Launched items
				</h2>
				<ul className="my-3 divide-y-2 text-sm md:text-base">
					{launchedItems.map(item => (
						<EntryTileView beforeObj={item.OldVersion} afterObj={item.CurrentVersion} key={item.Path} />)
					)}
				</ul>

				<h2 className={"text-green-700 font-bold text-sm md:text-base"}>
					Rolling out items
				</h2>
				<ul className="my-3 divide-y-2 text-sm md:text-base">
					{rollingOutItems.map(item => (
						<EntryTileView beforeObj={item.OldVersion} afterObj={item.CurrentVersion} key={item.Path} />)
					)}
				</ul>


				<h2 className={"text-green-700 font-bold text-sm md:text-base"}>
					Rescheduled items
				</h2>
				<ul className="my-3 divide-y-2 text-sm md:text-base">
					{rescheduledItems.map(item => (
						<EntryTileView beforeObj={item.OldVersion} afterObj={item.CurrentVersion} key={item.Path} />)
					)}
				</ul>

				<h2 className={"text-green-700 font-bold text-sm md:text-base"}>
					Irrelevant changes
				</h2>
				<ul className="my-3 divide-y-2 text-sm md:text-base">
					{irrelevantItems.map(item => (
						<EntryTileView beforeObj={item.OldVersion} afterObj={item.CurrentVersion} key={item.Path} />)
					)}
				</ul>


				<h2 className={"text-green-700 font-bold text-sm md:text-base"}>
					Other items
				</h2>
				<ul className="my-3 divide-y-2 text-sm md:text-base">
					{otherItems.map(item => {
						return (<EntryTileView beforeObj={item.OldVersion} afterObj={item.CurrentVersion} key={item.Path} />)
					})}
				</ul>
			</div>
		</section >
	);
};

export default Weekly;
