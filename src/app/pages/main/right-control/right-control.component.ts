import { Component, OnInit, ViewChild } from '@angular/core';
import { TodoComponent } from './todo/todo.component';

@Component({
  selector: 'app-right-control',
  templateUrl: './right-control.component.html',
  styleUrls: ['./right-control.component.less']
})
export class RightControlComponent implements OnInit {
  @ViewChild(TodoComponent) todos: TodoComponent;
  constructor() {}

  ngOnInit() {}

  addTodo(title: string) {
    this.todos.add(title);
  }
}
