import { FaSearch } from "react-icons/fa";
import { useCallback } from "react";

interface Filters {
	status: string;
	dateRange: string;
	priority: string;
	search: string;
}

interface TaskFiltersProps {
	filters: Filters;
	setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const TaskFilters = ({ filters, setFilters }: TaskFiltersProps) => {
	// Memoized filter change handler to optimize performance
	const handleFilterChange = useCallback(
		(key: keyof Filters, value: string) => {
			setFilters((prevFilters) => ({
				...prevFilters,
				[key]: value,
			}));
		},
		[setFilters]
	);

	return (
		<div className="mb-6 p-4 bg-gray-50 rounded-lg shadow">
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
				{/* Search Input */}
				<div className="relative">
					<input
						type="text"
						placeholder="Search tasks..."
						aria-label="Search tasks"
						className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500"
						value={filters.search}
						onChange={(e) => handleFilterChange("search", e.target.value)}
					/>
					<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
				</div>

				{/* Status Filter */}
				<select
					aria-label="Filter by status"
					className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
					value={filters.status}
					onChange={(e) => handleFilterChange("status", e.target.value)}
				>
					<option value="all">All Status</option>
					<option value="todo">Todo</option>
					<option value="in-progress">In Progress</option>
					<option value="done">Done</option>
				</select>

				{/* Priority Filter */}
				<select
					aria-label="Filter by priority"
					className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
					value={filters.priority}
					onChange={(e) => handleFilterChange("priority", e.target.value)}
				>
					<option value="all">All Priority</option>
					<option value="low">Low</option>
					<option value="medium">Medium</option>
					<option value="high">High</option>
				</select>

				{/* Date Filter */}
				<select
					aria-label="Filter by date range"
					className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
					value={filters.dateRange}
					onChange={(e) => handleFilterChange("dateRange", e.target.value)}
				>
					<option value="all">All Dates</option>
					<option value="today">Today</option>
					<option value="week">This Week</option>
					<option value="month">This Month</option>
				</select>
			</div>
		</div>
	);
};

export default TaskFilters;
