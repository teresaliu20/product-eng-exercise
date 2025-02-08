import cx from "classnames";
import { useState } from "react";
import { FeedbackGroup } from "../hooks";
import { CircleAlert, MessageCircle } from 'lucide-react';
import { DataTable } from "./DataTable";

const importanceValue = {
  High: 2,
  Medium: 1,
  Low: 0,
} as const;

export function GroupsDataTable({ data }: { data: FeedbackGroup[] }) {
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);

  return (
    <div className=" hide-scroll-bar flex h-full w-full align-top">
      <div
        className="hide-scroll-bar h-full overflow-y-auto "
        style={{ width: 500 }}
      >
        {data.map((group, index) => (
          <div
            key={`grouped-feedback-${index}`}
            onMouseDown={() => setSelectedGroupIndex(index)}
            className={cx(" border-b px-6 py-4 hover:cursor-default", {
              "bg-primary-action-light": selectedGroupIndex === index,
              "hover:bg-hover-gray": selectedGroupIndex !== index,
            })}
          >
            <div className="mb-2 text-base font-semibold">{group.name}</div>
            <div className="text-sm mb-2">{group.summary}</div>
            
            <div className="flex items-center text-sm font-semibold text-primary-main">
              <MessageCircle className="w-3 h-3 mr-1" />
              {`Total Issues: ${group.totalFeedbackCount}`}
            </div>
            <div className="flex items-center text-sm font-semibold text-primary-main">
              <CircleAlert className="w-3 h-3 mr-1" />
              {`High Priority Issues: ${group.highImportanceCount}`}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-dusty-white w-full flex-1 p-4">
        <DataTable
          fullWidth
          data={(data[selectedGroupIndex]?.feedback ?? [])
            .sort(
              (a, b) =>
                importanceValue[b.importance] - importanceValue[a.importance]
            )
            .map((feedback) => {
              return {
                id: feedback.id,
                name: feedback.name,
                description: feedback.description,
                importance: feedback.importance,
                customerName: feedback.customer,
                date: feedback.date,
                type: feedback.type,
              };
            })}
          schema={[
            {
              headerName: "Name",
              cellRenderer: (row) => (
                <div className="py-3">
                  <div className="mb-2 font-semibold">{row.name}</div>
                  <div className="text-sm">{row.description}</div>
                </div>
              ),
            },
            {
              headerName: "Priority",
              cellRenderer: (row) => (
                <div className="whitespace-nowrap text-sm">
                  {row.importance}
                </div>
              ),
            },
            {
              headerName: "Type",
              cellRenderer: (row) => (
                <div className="whitespace-nowrap text-sm">{row.type}</div>
              ),
            },
            {
              headerName: "Customer",
              cellRenderer: (row) => (
                <div className="whitespace-nowrap text-sm">
                  {row.customerName}
                </div>
              ),
            },
            {
              headerName: "Date",
              cellRenderer: (row) =>
                row.date ? (
                  <div className="whitespace-nowrap text-sm">
                    {new Date(row.date).toLocaleDateString()}
                  </div>
                ) : undefined,
            },
          ]}
        />
      </div>
    </div>
  );
}
