export interface ITask {
  id: number;
  name: string;
  deadline: Date;
  state: boolean;
  description: string;
  projectId: number;
  projectName: string;
  developerId: number;
  developerUserName: string;
  [key: string]: any;
}
