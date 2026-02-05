import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-owner-navbar',
  templateUrl: './owner-navbar.component.html',
  styleUrls: ['./owner-navbar.component.css']
})
export class OwnerNavbarComponent implements OnInit {
  userName:string = ''
  userRole:string = ''
  constructor(private readonly authService: AuthService,
    private readonly toastr: ToastrService){}
  ngOnInit(): void {
    this.userName = JSON.parse(localStorage.getItem('userName'))   
    this.userRole = JSON.parse(localStorage.getItem('userRole'))
  }
  onLogout(){
    this.authService.logout()
    this.toastr.success('User logged out successfully', 'Success', { timeOut: 100 })
  }
}
