import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-supplier-navbar',
  templateUrl: './supplier-navbar.component.html',
  styleUrls: ['./supplier-navbar.component.css']
})
export class SupplierNavbarComponent implements OnInit {
  userName:string = ''
  userRole:string = ''
  constructor(private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toastr: ToastrService){} 
    
  ngOnInit(): void {
    this.userName = JSON.parse(localStorage.getItem('userName'))
    this.userRole = JSON.parse(localStorage.getItem('userRole'))
  }
  onLogout(){
    this.authService.logout();
    this.toastr.success('User logged out successfully', 'Success', { timeOut: 100 })
  }

}
