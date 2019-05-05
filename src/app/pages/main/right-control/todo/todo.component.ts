import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  TemplateRef
} from '@angular/core';
import { Subject, combineLatest } from 'rxjs';
import { List, Todo } from '../../../../../domain/entities';
import { ListService } from '../../../../services/list/list.service';
import { TodoService } from '../../../../services/todo/todo.service';
import { takeUntil } from 'rxjs/operators';
import { floorToDate, getTodayTime } from '../../../../../utils/time';
import { NzDropdownContextComponent, NzDropdownService } from 'ng-zorro-antd';
import { Template } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.less']
})
export class TodoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  private dropDown: NzDropdownContextComponent;

  todos: Todo[] = [];
  lists: List[] = [];
  currentContextTodo: Todo;

  constructor(
    private listService: ListService,
    private todoService: TodoService,
    private dropDownService: NzDropdownService
  ) {}

  ngOnInit() {
    this.listService.list$.pipe(takeUntil(this.destroy$)).subscribe(lists => {
      this.lists = lists;
    });

    combineLatest(this.listService.currentUuid$, this.todoService.todo$)
      .pipe(takeUntil(this.destroy$))
      .subscribe(sources => {
        this.processTodos(sources[0], sources[1]);
      });

    this.todoService.getAll();
    this.listService.getAll();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  private processTodos(listUUID: string, todos: Todo[]): void {
    const filteredTodos = todos
      .filter(todo => {
        return (
          (listUUID === 'today' &&
            todo.planAt &&
            floorToDate(todo.planAt) <= getTodayTime()) ||
          (listUUID === 'todo' &&
            (!todo.listUUID || todo.listUUID === 'todo')) ||
          listUUID === todo.listUUID
        );
      })
      .map(todo => Object.assign({}, todo) as Todo);
    this.todos = filteredTodos;
    console.log(this.todos);
  }

  toggle(id: string) {}

  add(title: string): void {
    this.todoService.add(title);
  }

  click(id: string) {}

  contextMenu($event: MouseEvent, template: TemplateRef<void>, uuid: string) {
    this.dropDown = this.dropDownService.create($event, template);
    this.currentContextTodo = this.todos.find(todo => todo.id === uuid);
  }

  close() {
    this.dropDown.close();
  }

  setToday(): void {
    this.todoService.setTodoToday(this.currentContextTodo.id);
  }

  moveToList(id: string) {}

  delete(id: string) {}

  listsExcept(id: string): List[] {
    return this.lists.filter(l => l.id !== id);
  }
}
