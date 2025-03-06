import { useState, useMemo, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isThisWeek, isThisMonth, isToday } from "date-fns";
// Icons
import { FaFilter, FaPlus } from "react-icons/fa";
// Components
import CreateTaskModal from "../components/CreateTaskModal";
import TaskFilters from "../components/TasksFilter";
import TaskList from "../components/TaskList";
// Redux Store
import { AppDispatch, RootState } from "../store/store";
import { openModal } from "../store/createModalSlice";
import { fetchTasks } from "../store/taskSlice";

const TaskManager = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { tasks, loading, error } = useSelector(
		(state: RootState) => state.tasks
	);

	// Filters for task list
	const [filters, setFilters] = useState({
		status: "all",
		dateRange: "all",
		priority: "all",
		search: "",
	});

	// Sorting state (default: sorting by dueDate in descending order)
	const [sorting, setSorting] = useState({
		field: "dueDate",
		direction: "desc",
	});

	// Show/hide filter section
	const [isFilterVisible, setIsFilterVisible] = useState(true);

	// Memoized filtered & sorted task list
	const filteredTasks = useMemo(() => {
		return tasks
			.filter((task) => {
				// Check if task matches filters
				const matchesStatus =
					filters.status === "all" || task.status === filters.status;
				const matchesPriority =
					filters.priority === "all" || task.priority === filters.priority;
				const matchesSearch =
					task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
					task.description.toLowerCase().includes(filters.search.toLowerCase());

				// Check date range filter
				let matchesDate = true;
				if (filters.dateRange === "today") {
					matchesDate = isToday(new Date(task.dueDate));
				} else if (filters.dateRange === "week") {
					matchesDate = isThisWeek(new Date(task.dueDate));
				} else if (filters.dateRange === "month") {
					matchesDate = isThisMonth(new Date(task.dueDate));
				}

				return matchesStatus && matchesPriority && matchesSearch && matchesDate;
			})
			.sort((a, b) => {
				// Sort tasks based on selected field
				if (sorting.field === "dueDate") {
					const dateA = new Date(a.dueDate).getTime();
					const dateB = new Date(b.dueDate).getTime();
					return sorting.direction === "asc" ? dateA - dateB : dateB - dateA;
				}
				return 0;
			});
	}, [tasks, filters, sorting]);

	// Handle sorting logic
	const handleSort = (field: string) => {
		setSorting((prev) => ({
			field,
			direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
		}));
	};

	// Fetch tasks on component mount
	useEffect(() => {
		dispatch(fetchTasks());
	}, [dispatch]);

	return (
		<Fragment>
			<div className="min-h-screen bg-gray-100 p-4">
				<div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
					<div className="p-6">
						{/* Header Section */}
						<div className="flex flex-col md:flex-row justify-between items-center mb-6">
							<h1 className="text-2xl mb-4 md:mb-0 font-bold text-gray-800">
								Task Management
							</h1>
							<div className="w-full md:w-auto flex justify-end items-center">
								{/* Create Task Button */}
								<button
									onClick={() => dispatch(openModal())}
									className="flex items-center px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm md:text-md"
								>
									<FaPlus className="mr-2" />
									Create Task
								</button>
								{/* Toggle Filter Button */}
								<button
									onClick={() => setIsFilterVisible(!isFilterVisible)}
									className="ml-2 flex items-center px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm md:text-md"
								>
									<FaFilter className="mr-2" />
									{isFilterVisible ? "Hide Filters" : "Show Filters"}
								</button>
							</div>
						</div>

						{/* Filters Section */}
						{isFilterVisible && (
							<TaskFilters
								filters={filters}
								setFilters={setFilters}
							/>
						)}

						{/* Task List Section */}
						<div className="overflow-x-auto">
							<TaskList
								tasks={tasks}
								sorting={sorting}
								handleSort={handleSort}
								filteredTasks={filteredTasks}
							/>

							{/* Loading State */}
							{loading && tasks?.length === 0 && (
								<div className="text-center py-8">
									<p className="text-gray-500">Loading tasks...</p>
								</div>
							)}

							{/* Error State */}
							{error && (
								<div className="text-center py-8">
									<p className="text-gray-500">{error}</p>
								</div>
							)}

							{/* No Tasks Found Message */}
							{filteredTasks.length === 0 && !error && !loading && (
								<div className="text-center py-8">
									<p className="text-gray-500">
										{tasks?.length === 0
											? "No tasks added yet..."
											: "No tasks found matching your criteria"}
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Create Task Modal */}
			<CreateTaskModal />
		</Fragment>
	);
};

export default TaskManager;
