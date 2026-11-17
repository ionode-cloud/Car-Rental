import React from 'react';

export const VehicleTableSkeleton = ({ rows = 8 }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="text-[11px] uppercase tracking-wider text-gray-500 bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="p-3 sm:p-3.5">Vehicle</th>
            <th className="p-3 sm:p-3.5">Type</th>
            <th className="p-3 sm:p-3.5">Category</th>
            <th className="p-3 sm:p-3.5">Daily Rate</th>
            <th className="p-3 sm:p-3.5">Deposit</th>
            <th className="p-3 sm:p-3.5">Status</th>
            <th className="p-3 sm:p-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {Array.from({ length: rows }).map((_, idx) => (
            <tr key={idx} className="animate-pulse">
              <td className="p-3 sm:p-3.5 flex items-center gap-3">
                <div className="w-14 h-10 rounded-lg bg-gray-200 shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="h-3.5 bg-gray-200 rounded w-32 sm:w-44 max-w-full" />
                  <div className="h-2.5 bg-gray-100 rounded w-20" />
                </div>
              </td>
              <td className="p-3 sm:p-3.5">
                <div className="h-5 bg-gray-200 rounded-full w-14" />
              </td>
              <td className="p-3 sm:p-3.5">
                <div className="h-3.5 bg-gray-200 rounded w-20" />
              </td>
              <td className="p-3 sm:p-3.5">
                <div className="h-3.5 bg-gray-200 rounded w-24" />
              </td>
              <td className="p-3 sm:p-3.5">
                <div className="h-3.5 bg-gray-200 rounded w-16" />
              </td>
              <td className="p-3 sm:p-3.5">
                <div className="h-5 bg-gray-200 rounded-full w-16" />
              </td>
              <td className="p-3 sm:p-3.5 text-right">
                <div className="flex items-center justify-end gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gray-200" />
                  <div className="w-7 h-7 rounded-lg bg-gray-200" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleTableSkeleton;

