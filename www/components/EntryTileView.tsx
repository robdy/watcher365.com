import React from "react";
import { releaseStatusesList, releasePhasesList, cloudInstancesList, platformsList, productsList, tagList } from "@/types/TagTypes"
import * as Diff from "diff";
import Link from "next/link";
import { FiFile } from "react-icons/fi";
import { BsMap } from "react-icons/bs";
import { MdHistory } from "react-icons/md"
const util = require('node:util');

const normalizeText = (text: string): string => {
	return text.replaceAll(/^,/g, "")
}

const EntryTileVew: any = async ({ beforeObj, afterObj }: any) => {
	const entryID = afterObj.guid;
	const getModifiedTags: any = (beforeTags: string[], afterTags: string[], tagList: string[]) => {

		const addedTags = afterTags.filter(tag => !beforeTags.includes(tag));
		const removedTags = beforeTags.filter(tag => !afterTags.includes(tag));

		return {
			added: addedTags,
			removed: removedTags,
		};
	};

	const modifiedTags = getModifiedTags(beforeObj.category, afterObj.category, tagList);

	const ColoredTags: any = ({ tagsList: tagsArray, modifiedTags }: any) => {
		let productsTags: any = [],
			cloudInstancesTags: any = [],
			platformsTags: any = [],
			releasePhasesTags: any = [],
			releaseStatusesTags: any = [],
			otherTags: any = [];

		// Adds new tags to the end so the red is displayed first
		// This way we can add an arrow indicating a change (to be done)
		if (modifiedTags.added) {
			tagsArray.push(...modifiedTags.added);
		}
		for (let t = 0; t < tagsArray.length; t++) {
			let badgeClasses: string = "bg-gray-50 text-gray-600 ring-gray-500/10";
			const currentTag = tagsArray[t];
			const isAdded = modifiedTags.added.includes(currentTag);
			const isRemoved = modifiedTags.removed.includes(currentTag);
			if (isAdded && !isRemoved) {
				badgeClasses = "bg-green-50 text-green-700 ring-green-600/20";
			}
			if (isRemoved && !isAdded) {
				badgeClasses = "bg-red-50 text-red-700 ring-red-600/10";
			}
			const coloredTag: React.JSX.Element = <span
				className={`inline-flex items-center rounded-md px-2 text-xs font-medium  ring-1 ring-inset ${badgeClasses} mx-1`}
			>
				{currentTag}
			</span>
			switch (true) {
				case productsList.includes(currentTag):
					productsTags.push(coloredTag);
					break;
				case cloudInstancesList.includes(currentTag):
					cloudInstancesTags.push(coloredTag);
					break;
				case platformsList.includes(currentTag):
					platformsTags.push(coloredTag);
					break;
				case releasePhasesList.includes(currentTag):
					releasePhasesTags.push(coloredTag);
					break;
				case releaseStatusesList.includes(currentTag):
					releaseStatusesTags.push(coloredTag);
					break;
				default:
					otherTags.push(coloredTag);
			}
		}

		return <React.Fragment>
			<p><span className="font-bold">Product(s):</span> {productsTags}</p>
			<p><span className="font-bold">Cloud instance(s):</span> {cloudInstancesTags}</p>
			<p><span className="font-bold">Platform(s):</span> {platformsTags}</p>
			<p><span className="font-bold">Release phase(s):</span> {releasePhasesTags}</p>
			<p><span className="font-bold">Status:</span> {releaseStatusesTags}</p>
			{otherTags.length > 0 && <p><span className="font-bold">Other tags:</span> {otherTags}</p>}
		</React.Fragment>;
	};

	const DiffedDate: any = ({
		propertyName,
	}: {
		propertyName: "publicDisclosureAvailabilityDate" | "publicPreviewDate";
	}) => {
		if (!Object.hasOwn(afterObj, propertyName)
		) {
			return null
		}
		// If the property hasn't changed in last commit
		// Or if previous value did not exist
		if (
			!Object.hasOwn(beforeObj, propertyName)
			|| beforeObj[propertyName] === afterObj[propertyName]
			|| beforeObj[propertyName] === null
			|| afterObj[propertyName] === null
		) {
			return (
				<span className={`text-gray-600`}>{afterObj[propertyName]}</span>
			);
		}

		let diffedDateObject: any = [];
		let dateDiff = Diff.diffWords(beforeObj[propertyName], afterObj[propertyName]);
		dateDiff.forEach((part) => {
			const color = part.added
				? "green-700 bg-green-200"
				: part.removed
					? "red-700 bg-red-200"
					: "gray-600";
			diffedDateObject.push(
				<span className={`text-${color}`}>{part.value}</span>
			);
		});
		return diffedDateObject;
	};

	const DiffedText: any = ({ type, }: { type: "title" | "description" }) => {
		let diffedTextObject: any = []
		if (beforeObj[type] === '') {
			return <span className={`text-gray-600`}>{afterObj[type]}</span>
		}
		const beforeText = normalizeText(beforeObj[type])
		const afterText = normalizeText(afterObj[type])
		let textDiff = Diff.diffWords(
			beforeText, afterText
		)
		if (textDiff.length > 10) {
			textDiff = Diff.diffTrimmedLines(
				beforeText, afterText
			)
		}
		textDiff.forEach((part) => {
			const color = part.added
				? "green-700 bg-green-200"
				: part.removed
					? "red-700 bg-red-200"
					: "gray-600";
			diffedTextObject.push(
				<span className={`text-${color}`}>{part.value}</span>
			);
		});
		return diffedTextObject;
	};

	return (
		<li className="flex  py-2 px-4 bg-white" key={`li-${entryID}`}>
			<div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0 text-gray-600" id={`container-${entryID}`}>
				<div className="w-full max-w-3xl flex md:items-center">
					<span>
						<p className="hover:text-green-700 py-1 font-bold">
							<DiffedText type="title" />
							{JSON.stringify(beforeObj) === JSON.stringify({}) ? (
								<span className="inline-flex items-center rounded-md bg-green-50 px-1 py-1 ml-4 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
									New
								</span>
							) : null}
						</p>
						<DiffedText type="description" />
						<p>
							<span className="font-bold">Feature ID:</span>{" "}
							{afterObj.guid}
						</p>
						<p>
							<span className="font-bold">Added to roadmap:</span>{" "}
							{new Date(Date.parse(afterObj.pubDate)).toDateString()}
						</p>
						<p>
							<span className="font-bold">Last modified:</span>{" "}
							{new Date(afterObj.updated).toDateString()}
						</p>

						<ColoredTags
							tagsList={beforeObj.category}
							modifiedTags={modifiedTags}
						/>
						<p>
							<span className="font-bold">Preview Available:</span>{" "}
							{afterObj.publicPreviewDate ? (
								<DiffedDate propertyName="publicPreviewDate" />
							) : null}
						</p>
						<p>
							<span className="font-bold">Rollout Start:</span>{" "}
							{afterObj.publicDisclosureAvailabilityDate ? (
								<DiffedDate propertyName="publicDisclosureAvailabilityDate" />
							) : null}
						</p>
					</span>
				</div>
				<div className=" md:text-sm text-xs min-w-[100px] text-gray-600">
					<a href={`https://www.microsoft.com/en-us/microsoft-365/roadmap?featureid=${entryID}`}>
						<p className="flex items-center gap-1">
							<BsMap className="p-1 text-2xl" />
							Roadmap entry
						</p>
					</a>
					<Link href={entryID} >
						<p className="flex items-center gap-1">
							<MdHistory className="p-1 text-2xl" />
							Entry history
						</p>
					</Link>
					<a href={`https://github.com/robdy/watcher365.com/blob/main/data/${entryID}.json`}><p className="flex items-center gap-1">
						<FiFile className="p-1 text-2xl" />
						Source file
					</p></a>

				</div>
			</div>
		</li>
	)

}

export default EntryTileVew