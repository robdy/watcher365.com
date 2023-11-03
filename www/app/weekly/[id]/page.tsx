
import { add } from 'date-fns';
import React from 'react';
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

export const dynamic = 'force-static';

export async function generateStaticParams() {
	const { stdout } = await exec('ls data/weekly')
	const filesArr: string[] = stdout.split('\n')

	return filesArr.map((file) => ({
		id: file.replace(/\.json$/, ''),
	}))
}

const Weekly = async ({ params }: { params: { id: string } }) => {
	const { id } = params
	// Import file from data/weekly/${id}.json
	const data = await import(`data/weekly/${id}.json`)

	return (
    <div>
			<h2 className={"text-green-700 font-bold text-sm md:text-base"}>
				Summary
			</h2>
				<p>{`${data.length} items were changed`}</p>
				<p>{`${addedItems.length} items were added`}</p>
    </div>
  );
};

export default Weekly;
