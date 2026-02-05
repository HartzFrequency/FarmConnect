import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnChanges, OnInit {

  isNotLoggedIn: boolean = false;

  constructor(private readonly authService: AuthService,
    private readonly router: Router) { }

  ngOnInit(): void {
    this.isNotLoggedIn = !this.authService.isAuthenticated();
    const userRole = JSON.parse(localStorage.getItem('userRole') || 'null');

    if (!this.isNotLoggedIn && userRole === 'supplier') {
      this.router.navigate(['/supplier']);
    } else if (!this.isNotLoggedIn && userRole === 'owner') {
      this.router.navigate(['/owner']);
    }

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.isNotLoggedIn = !this.authService.isAuthenticated()
  }

}
