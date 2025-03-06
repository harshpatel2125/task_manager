// types
import { Task } from "../types/task.type";

// This is just a function act as a api endpoint;
export async function getTasks() {
	return new Promise<Task[]>((resolve, rejected) => {
		setTimeout(() => {
			const items = localStorage.getItem("persist:root");
			if (!items) {
				rejected({
					message: "error",
				});
				return;
			}
			const parsedTasks = JSON.parse(items).tasks;
			if (!parsedTasks) {
				rejected({
					message: "error",
				});
				return;
			}
			const tasks = JSON.parse(parsedTasks).tasks;
			if (!parsedTasks) {
				resolve([]);
				return;
			}
			// console.log(JSON.parse(parsedTasks).tasks);
			resolve(tasks);
			return;
		}, 1000);
	});
}
