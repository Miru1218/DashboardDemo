import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonModule, AvatarModule, MenuModule]
})
export class SidebarComponent {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'New',
        icon: 'pi pi-plus',
      },
      {
        label: 'Search',
        icon: 'pi pi-search',
      }
      ,
      {
        label: 'Settings',
        icon: 'pi pi-cog',
      },
      {
        label: 'Messages',
        icon: 'pi pi-inbox',
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
      }

    ];
  }
}
