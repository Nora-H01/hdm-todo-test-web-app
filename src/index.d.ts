export interface Task {
  id: number,
  name: string,
  createdAt: string,
  updatedAt: string,
  //Bonus
  status: "to do" | "in progress" | "finished";
}
