import { ITask } from "./task";

export interface IProject {
    id: number;
    name: string;
    budget: number;
    description: string;
    projectManagerUserName: string;
    tasks: ITask[];
}
