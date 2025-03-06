import { useEffect } from "react";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import { v4 as uuidv4 } from "uuid";
// Redux store
import { useDispatch, useSelector } from "react-redux";
import { addTask } from "../store/taskSlice";
import { closeModal } from "../store/createModalSlice";
import { RootState } from "../store/store";
// Types
import { PriorityTypes, StatusTypes } from "../types/task.type";

// Define Type for Form Values
interface TaskFormValues {
	title: string;
	description: string;
	status: StatusTypes;
	priority: PriorityTypes;
	dueDate: string;
}

export default function CreateTaskModal() {
	const dispatch = useDispatch();
	const visible = useSelector((state: RootState) => state.createModal.visible);

	// Define Form Validation Schema using Yup
	const validationSchema: Yup.Schema<TaskFormValues> = Yup.object({
		title: Yup.string().required("Task title is required"),
		description: Yup.string().required("Task description is required"),
		status: Yup.mixed<StatusTypes>()
			.oneOf(["todo", "in-progress", "done"])
			.required("Status is required"),
		priority: Yup.mixed<PriorityTypes>()
			.oneOf(["low", "medium", "high"])
			.required("Priority is required"),
		dueDate: Yup.string().required("Due date is required"),
	});

	// Formik for form handling
	const formik = useFormik<TaskFormValues>({
		initialValues: {
			title: "",
			description: "",
			status: "todo",
			priority: "low",
			dueDate: "",
		},
		validationSchema,
		onSubmit: (
			values: TaskFormValues,
			{ resetForm }: FormikHelpers<TaskFormValues>
		) => {
			dispatch(addTask({ id: uuidv4(), ...values }));
			resetForm();
			dispatch(closeModal());
		},
	});

	// Set default due date (7 days later)
	useEffect(() => {
		const today = new Date();
		today.setDate(today.getDate() + 7);
		formik.setFieldValue("dueDate", today.toISOString().split("T")[0]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Dialog
			open={visible}
			onClose={() => dispatch(closeModal())}
			className="relative z-10"
		>
			<DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
			<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
				<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
					<DialogPanel className="relative transform w-full max-w-lg overflow-hidden rounded-lg bg-white text-left shadow-xl sm:my-8">
						<div className="bg-white px-6 pt-5 pb-4 sm:p-8">
							<DialogTitle
								as="h3"
								className="text-lg font-semibold text-gray-900"
							>
								Create Task
							</DialogTitle>
							<form
								className="mt-5 grid grid-cols-1 gap-y-3"
								onSubmit={formik.handleSubmit}
							>
								{/* Task Title */}
								<div>
									<label className="text-sm">Task Title</label>
									<input
										type="text"
										{...formik.getFieldProps("title")}
										className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
									/>
									{formik.touched.title && formik.errors.title && (
										<p className="text-red-500 text-xs">{formik.errors.title}</p>
									)}
								</div>

								{/* Task Description */}
								<div>
									<label className="text-sm">Task Description</label>
									<textarea
										{...formik.getFieldProps("description")}
										className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
									/>
									{formik.touched.description && formik.errors.description && (
										<p className="text-red-500 text-xs">{formik.errors.description}</p>
									)}
								</div>

								{/* Task Status */}
								<div>
									<label className="text-sm">Task Status</label>
									<select
										{...formik.getFieldProps("status")}
										className="w-full px-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
									>
										<option value="todo">Todo</option>
										<option value="in-progress">In Progress</option>
										<option value="done">Done</option>
									</select>
									{formik.touched.status && formik.errors.status && (
										<p className="text-red-500 text-xs">{formik.errors.status}</p>
									)}
								</div>

								{/* Task Priority */}
								<div>
									<label className="text-sm">Task Priority</label>
									<select
										{...formik.getFieldProps("priority")}
										className="w-full px-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
									>
										<option value="low">Low</option>
										<option value="medium">Medium</option>
										<option value="high">High</option>
									</select>
									{formik.touched.priority && formik.errors.priority && (
										<p className="text-red-500 text-xs">{formik.errors.priority}</p>
									)}
								</div>

								{/* Due Date */}
								<div>
									<label className="text-sm">Due Date</label>
									<input
										type="date"
										{...formik.getFieldProps("dueDate")}
										className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
									/>
									{formik.touched.dueDate && formik.errors.dueDate && (
										<p className="text-red-500 text-xs">{formik.errors.dueDate}</p>
									)}
								</div>

								{/* Buttons */}
								<div className="flex justify-end space-x-2 mt-3">
									<button
										type="button"
										onClick={() => dispatch(closeModal())}
										className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm"
									>
										Cancel
									</button>
									<button
										type="submit"
										className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
									>
										Create
									</button>
								</div>
							</form>
						</div>
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	);
}
