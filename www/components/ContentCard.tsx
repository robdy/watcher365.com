import React from "react";
import { format } from "date-fns";
import { formatDate } from "@/libs/formatDate";

interface Props {
  title: string | null;
  description: string | null;
  category: [] | null;
  updateDate: any | null;
  publicDisclosureAvailabilityDate: string | null;
  publicPreviewDate: string | null;
}

const ContentCard: React.FC<Props> = ({
  category,
  description,
  title,
  updateDate,
  publicPreviewDate,
  publicDisclosureAvailabilityDate,
}) => {
  return (
    <div className=" md:p-4 p-2 ">
      <div>
        {updateDate && (
          <p className="text-gray-600">
            <span className="text-sm">
              Updated : {format(new Date(updateDate), "MMM-dd-yyyy")}
            </span>
          </p>
        )}
        {title && <h1 className="font-bold my-2 ">{title}</h1>}
        {description && <p>{description}</p>}
      </div>

      {category && (
        <ul className="flex gap-2 flex-wrap mt-3 ">
          {category.map((item: string, i: number) => (
            <li key={i} className="border rounded-full bg-white  px-2 text-xs ">
              {item}
            </li>
          ))}
        </ul>
      )}
      <div className="flex mt-4  flex-col text-sm text-black">
        {publicDisclosureAvailabilityDate && (
          <p className="">
            <span className="text-xs font-bold">
              Public Disclosure Availability Date :{" "}
              {formatDate(publicDisclosureAvailabilityDate)}
            </span>
          </p>
        )}
        {publicPreviewDate && (
          <p className="">
            <span className="text-xs font-bold">
              Public Review Date : {formatDate(publicPreviewDate)}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ContentCard;
