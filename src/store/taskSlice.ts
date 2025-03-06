import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getTasks } from "../api/getTasks";
import { Task } from "../types/task.type";

interface TaskState {
	tasks: Task[];
	loading: boolean;
	error: string | null;
}

const initialState: TaskState = {
	tasks: [],
	loading: false,
	error: null,
};

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
	try {
		const result = await getTasks();
		if (result && result?.length > 0) {
			return result;
		} else {
			throw new Error("No tasks added yet...");
		}
	} catch {
		throw new Error("No tasks added yet...");
	}
});

const taskSlice = createSlice({
	name: "tasks",
	initialState,
	reducers: {
		addTask: (state, action: PayloadAction<Task>) => {
			state.loading = false;
			state.error = null;
			state.tasks.push(action.payload);
		},
		deleteTask: (state, action: PayloadAction<string>) => {
			state.tasks = state.tasks.filter((task) => task.id !== action.payload);
		},
		updateTask: (state, action: PayloadAction<Task>) => {
			const index = state.tasks.findIndex((task) => task.id === action.payload.id);
			if (index !== -1) {
				state.tasks[index] = action.payload;
			}
		},
	},
	extraReducers: (builders) => {
		builders
			.addCase(fetchTasks.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchTasks.fulfilled, (state, action) => {
				state.loading = false;
				state.error = null;
				state.tasks = action.payload;
			})
			.addCase(fetchTasks.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || "No tasks added yet...";
			});
	},
});

export const { addTask, deleteTask, updateTask } = taskSlice.actions;
export default taskSlice.reducer;
