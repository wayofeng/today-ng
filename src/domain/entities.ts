import { generateUUID } from '../utils/uuid';

// 待办事项
export class Todo {
  id: string;
  title: string;
  createdAt: number;
  listUUID: string;
  desc: string;
  completedFlag: boolean;
  completedAt: number;
  dueAt: number;
  planAt: number;
  notifyMe = false;

  constructor(title: string, listUUID?: string) {
    this.id = generateUUID();
    this.title = title;
    this.listUUID = listUUID;
    this.completedFlag = false;
  }
}

// 待办事项列表
export class List {
  id: string;
  title: string;
  createdAt: number;

  constructor(title: string) {
    this.title = title;
    this.id = generateUUID();
  }
}
