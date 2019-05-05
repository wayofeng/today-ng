import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalStorageService } from '../local-storage.service';
import { List } from '../../../domain/entities';
import { LISTS } from '../local-storage.namespace';

type SpecialListUUID = 'today' | 'todo';

@Injectable()
export class ListService {
  private current: List;
  private lists: List[] = [];

  currentUuid: SpecialListUUID | string = 'today';
  currentUuid$ = new Subject<string>();
  current$ = new Subject<List>();
  list$ = new Subject<List[]>();

  constructor(private store: LocalStorageService) {}

  private persist(): void {
    this.store.set(LISTS, this.lists);
  }

  private broadCase(): void {
    this.list$.next(this.lists);
    this.current$.next(this.current);
    this.currentUuid$.next(this.currentUuid);
  }

  add(title: string): void {
    const newList = new List(title);
    this.lists.push(newList);
    this.currentUuid = newList.id;
    this.current = newList;
    this.persist();
    this.broadCase();
  }

  delete(id): void {
    this.lists = this.lists.filter(l => l.id !== id);
    const len = this.lists.length;
    this.currentUuid = len
      ? this.lists[len - 1].id
      : this.currentUuid === 'today'
      ? 'today'
      : 'todo';
    this.persist();
    this.broadCase();
  }

  getAll(): void {
    this.lists = this.store.get(LISTS);
    this.broadCase();
  }

  setCurrentUuid(id: string) {
    this.currentUuid = id;
    this.current = this.lists.find(item => item.id === id);
    this.broadCase();
  }

  getCurrentUuid(): string | SpecialListUUID {
    return this.currentUuid;
  }

  rename(title: string) {
    this.lists.find(l => l.id === this.currentUuid).title = title;
    this.persist();
    this.broadCase();
  }
}
