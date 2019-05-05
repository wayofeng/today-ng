import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ListService } from '../../../../services/list/list.service';
import { List } from '../../../../../domain/entities';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit, OnDestroy {
  @Input() isCollapsed: boolean;
  @ViewChild('listInput') listInput: ElementRef;
  @ViewChild('listRenameInput') listRenameInput: ElementRef;

  lists: List[];
  currentListUuid: string;
  addListModalVisible = false;
  renameListModalVisible = false;

  private distroy$ = new Subject();
  constructor(
    private listService: ListService,
    private message: NzMessageService,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    this.listService.list$.pipe(takeUntil(this.distroy$)).subscribe(lists => {
      this.lists = lists;
    });

    this.listService.currentUuid$
      .pipe(takeUntil(this.distroy$))
      .subscribe(currentListUuid => {
        this.currentListUuid = currentListUuid;
        console.log(currentListUuid);
        console.log(this.lists);
      });

    this.listService.getAll();
  }

  ngOnDestroy() {
    this.distroy$.next();
  }

  closeAddListModal(): void {
    this.addListModalVisible = false;
    this.listInput.nativeElement.value = '';
  }

  openAddListModal(): void {
    this.addListModalVisible = true;
    setTimeout(() => {
      this.listInput.nativeElement.focus();
    });
  }
  isListRepeat(title): boolean {
    const hasList = this.lists.findIndex(l => l.title === title);
    return hasList > -1 || title === 'Today' || title === 'Todo';
  }
  add(title: string): any {
    if (!title) {
      return false;
    }
    if (this.isListRepeat(title)) {
      this.message.create('error', '列表名称不能重复！');
      return false;
    }
    this.listService.add(title);
    this.closeAddListModal();
    return false;
  }
  delete(id): void {
    this.modalService.confirm({
      nzTitle: '<i>确认删除列表？</i>',
      nzContent: '<b>该操作会导致该列表下的所有待办事项被删除</b>',
      nzCancelText: '取消',
      nzOkText: '确定',
      nzOnOk: () => this.listService.delete(id)
    });
  }
  click(id): void {
    this.listService.setCurrentUuid(id);
  }
  closeRenameListModal(): void {
    this.renameListModalVisible = false;
  }
  renameOk(title): any {
    if (this.isListRepeat(title)) {
      this.message.create('error', '列表名称不能重复！');
      return false;
    }
    this.listService.rename(title);
    this.closeRenameListModal();
    return false;
  }
  rename(title): void {
    this.renameListModalVisible = true;
    setTimeout(() => {
      this.listRenameInput.nativeElement.value = title;
      this.listRenameInput.nativeElement.focus();
    });
  }
}
