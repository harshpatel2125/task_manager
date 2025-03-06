export type StatusTypes = "todo" | "in-progress" | "done";
export type PriorityTypes = "low" | "medium" | "high";
export interface Task {
	id: string;
	title: string;
	description: string;
	status: StatusTypes;
	priority: PriorityTypes;
	dueDate: string;
}
