import { Component, OnInit, Input } from '@angular/core';
import { RolePermission } from '../core/interfaces';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  _sidebarMenu: Array<RolePermission> = [];
  _selectedMainMenu: string;
  selectedMenu = '';
  @Input()
  set sidebarMenu(submenus: Array<RolePermission>) {
    this._sidebarMenu = submenus;

  }
  get sidebarMenu() {

    return this._sidebarMenu;
  }
  @Input()
  set selecetedMainMenu(name: string) {
    this._selectedMainMenu = name;
  }
  get selectedMainMenu() {
    return this._selectedMainMenu;
  }
  constructor() { }

  ngOnInit() {
  }

}
