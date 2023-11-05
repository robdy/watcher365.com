
import React from 'react';
import { getSummaries } from '@/libs/getSummaries';
import Link from 'next/link';

const WeeklyList = async () => {
  const weeklySummaries = await getSummaries('weekly');

  return (
    <section className="container max-w-5xl mx-auto ">
      <div className="my-10">
        <h2 className={"text-green-700 font-bold text-sm md:text-base"}>Available weekly summaries</h2>
      {weeklySummaries.map((summary) => (
        <div key={summary.id}>
          <Link href={`/weekly/${summary.id}`}>{`${summary.id.slice(0, 4)}-${summary.id.slice(4, 6)}-${summary.id.slice(6, 8)}`}</Link>
        </div>
      )
      )}
    </div>
    </section>
  );
};

export default WeeklyList;
