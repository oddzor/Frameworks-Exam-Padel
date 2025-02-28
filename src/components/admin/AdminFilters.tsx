import React from "react";
import { AdminFilterState } from "../../types";

interface AdminFiltersProps {
  filters: AdminFilterState;
  onFilterChange: (name: keyof AdminFilterState, value: string) => void;
  onSearch: () => void;
}

const AdminFilters: React.FC<AdminFiltersProps> = ({
  filters,
  onFilterChange,
  onSearch,
}) => {
  return (
    <div className="mb-4 flex space-x-4 text-white">
      <div>
        <label className="block text-sm mb-1">Date:</label>
        <input
          type="date"
          value={filters.date || ""}
          onChange={(e) => onFilterChange("date", e.target.value)}
          className="border border-gray-500 px-2 py-1 rounded bg-gray-700 text-white"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Court:</label>
        <input
          type="text"
          placeholder="Court #1"
          value={filters.court || ""}
          onChange={(e) => onFilterChange("court", e.target.value)}
          className="border border-gray-500 px-2 py-1 rounded bg-gray-700 text-white"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Players:</label>
        <input
          type="number"
          placeholder="2 or 4"
          value={filters.players || ""}
          onChange={(e) => onFilterChange("players", e.target.value)}
          className="border border-gray-500 px-2 py-1 rounded bg-gray-700 text-white"
        />
      </div>
      <button
        onClick={onSearch}
        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 self-end"
      >
        Filter
      </button>
    </div>
  );
};

export default AdminFilters;
