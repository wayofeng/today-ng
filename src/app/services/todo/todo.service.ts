import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Todo } from '../../../domain/entities';
import { ListService } from '../list/list.service';
import { LocalStorageService } from '../local-storage.service';
import { TODOS } from '../local-storage.namespace';
import { floorToMinute, ONE_HOUR, getCurrentTime } from '../../../utils/time';

@Injectable()
export class TodoService {
  todo$ = new Subject<Todo[]>();

  private todos: Todo[] = [];

  constructor(
    private listService: ListService,
    private store: LocalStorageService
  ) {
    this.todos = this.store.getList(TODOS);
  }

  private broadCast(): void {
    this.todo$.next(this.todos);
  }

  private persist(): void {
    this.store.set(TODOS, this.todos);
  }

  getAll(): void {
    this.todos = this.store.getList(TODOS);
    this.broadCast();
  }

  add(title: string): void {
    const listUuid = this.listService.getCurrentUuid();
    const todo = new Todo(title, listUuid);
    this.todos.push(todo);
    this.persist();
    this.broadCast();
  }

  getByUuid(id: string): Todo {
    return this.todos.find(todo => todo.id === id);
  }

  setTodoToday(id: string): void {
    const todo = this.getByUuid(id);
    if (todo && !todo.completedFlag) {
      todo.planAt = floorToMinute(new Date()) + ONE_HOUR;
      this.update(todo);
    }
  }

  update(todo: Todo): void {
    const todoIndex = this.todos.findIndex(t => t.id === todo.id);
    if (todoIndex > -1) {
      todo.completedAt = todo.completedFlag ? getCurrentTime() : undefined;
      this.todos.splice(todoIndex, 1, todo);
      this.persist();
      this.broadCast();
    }
  }
}
