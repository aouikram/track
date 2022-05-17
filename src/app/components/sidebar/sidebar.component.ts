import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/maps', title: 'Carte',  icon:'location_on', class: '' },
    { path: '/vehicule', title: 'Unité mobile',  icon:'airport_shuttle', class: '' },
    { path: '/affectation', title: 'Affectation',  icon:'swap_horiz', class: '' },
    { path: '/conducteur', title: 'Conducteur',  icon:'person_outline', class: '' },
    { path: '/device', title: 'Boitiers GPS',  icon:'my_location', class: '' },
    { path: '/utilisateur', title: 'Utilisateur',  icon:'person', class: '' },
    { path: '/map-leaflet', title: 'Map-leaflet',  icon:'location_on', class: '' },
    // { path: '/user-profile', title: 'User Profile',  icon:'person', class: '' },
    // { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
    // { path: '/missions', title: 'Missions',  icon:'task', class: '' },
    // { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
    // { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
    // { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    // { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  isExpanded: boolean = true;
  isShowing: boolean = false;
  showSubmenu: boolean = false;
  // isShow = false;

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    console.log(this.menuItems);
   
  }
  isMobileMenu() {
      if ($(window).width() > 900) {
          return false;
      }
      return true;
  };


}
