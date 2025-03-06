import { format } from "date-fns";
import { useCallback } from "react";
// Icons
import { FaSortDown, FaSortUp, FaTrash } from "react-icons/fa";
// Redux Store
import { useDispatch } from "react-redux";
import { deleteTask, updateTask } from "../store/taskSlice";
// Types
import { StatusTypes, Task } from "../types/task.type";

interface TaskListProps {
	tasks: Task[];
	filteredTasks: Task[];
	sorting: {
		field: string;
		direction: string;
	};
	handleSort: (field: string) => void;
}

export default function TaskList({
	tasks,
	filteredTasks,
	sorting,
	handleSort,
}: TaskListProps) {
	const dispatch = useDispatch();

	// Function to update task status (Memoized with useCallback to prevent unnecessary re-renders)
	const updateTaskStatus = useCallback(
		(taskId: string, newStatus: StatusTypes) => {
			const taskToUpdate = tasks.find((task) => task.id === taskId);
			if (!taskToUpdate) return;
			dispatch(updateTask({ ...taskToUpdate, status: newStatus }));
		},
		[tasks, dispatch]
	);

	// Function to delete a task (Memoized for efficiency)
	const handleDeleteTask = useCallback(
		(taskId: string) => dispatch(deleteTask(taskId)),
		[dispatch]
	);

	return (
		<table className="w-full border-collapse">
			{/* Table Header */}
			<thead>
				<tr className="bg-gray-50">
					<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
						{/* Sort by Task Name */}
						<button
							className="flex items-center space-x-1"
							onClick={() => handleSort("title")}
						>
							<span>Task</span>
							{sorting.field === "title" &&
								(sorting.direction === "asc" ? <FaSortUp /> : <FaSortDown />)}
						</button>
					</th>
					<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
						Status
					</th>
					<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
						{/* Sort by Due Date */}
						<button
							className="flex items-center space-x-1"
							onClick={() => handleSort("dueDate")}
						>
							<span>Due Date</span>
							{sorting.field === "dueDate" &&
								(sorting.direction === "asc" ? <FaSortUp /> : <FaSortDown />)}
						</button>
					</th>
					<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
						Priority
					</th>
					<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
						Actions
					</th>
				</tr>
			</thead>

			{/* Table Body */}
			<tbody className="bg-white divide-y divide-gray-200">
				{filteredTasks.map((task) => (
					<tr
						key={task.id}
						className="hover:bg-gray-50"
					>
						{/* Task Name and Description */}
						<td className="px-6 py-4">
							<div className="text-sm font-medium text-gray-900">{task.title}</div>
							<div className="text-sm text-gray-500">{task.description}</div>
						</td>

						{/* Task Status Dropdown */}
						<td className="px-6 py-4">
							<select
								value={task.status}
								onChange={(e) =>
									updateTaskStatus(task.id, e.target.value as StatusTypes)
								}
								className={`pl-2 pr-1 py-1.5 rounded-full text-sm font-semibold transition-colors focus:ring-2 focus:ring-blue-500 ${
									task.status === "done"
										? "bg-green-100 text-green-800"
										: task.status === "in-progress"
										? "bg-yellow-100 text-yellow-800"
										: "bg-gray-100 text-gray-800"
								}`}
							>
								<option value="todo">Todo</option>
								<option value="in-progress">In Progress</option>
								<option value="done">Done</option>
							</select>
						</td>

						{/* Due Date */}
						<td className="px-6 py-4 text-sm text-gray-500">
							{format(task.dueDate, "MMM dd, yyyy")}
						</td>

						{/* Priority Label */}
						<td className="px-6 py-4">
							<span
								className={`px-2 inline-flex text-sm font-semibold rounded-full ${
									task.priority === "high"
										? "bg-red-100 text-red-800"
										: task.priority === "medium"
										? "bg-yellow-100 text-yellow-800"
										: "bg-green-100 text-green-800"
								}`}
							>
								{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
							</span>
						</td>

						{/* Delete Button */}
						<td className="px-6 py-4 text-sm font-medium">
							<button
								className="text-red-600 hover:text-red-900"
								onClick={() => handleDeleteTask(task.id)}
							>
								<FaTrash />
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
