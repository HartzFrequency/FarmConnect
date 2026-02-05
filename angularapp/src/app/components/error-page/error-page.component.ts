import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent {

  dynamicRouterLink: string = '/login'

  constructor(private readonly router: Router) { }

  ngOnInit(): void {
    const userRole = JSON.parse(localStorage.getItem('userRole') || 'null');
    if (userRole === 'supplier') {
      this.dynamicRouterLink = '/supplier';
    } else if (userRole === 'owner') {
      this.dynamicRouterLink = '/owner';
    } else {
      this.dynamicRouterLink = '/';
    }
  }
}
