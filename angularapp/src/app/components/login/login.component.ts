import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false;
  isLoading:boolean = false;
  
  constructor(private readonly fb: FormBuilder, 
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toastr: ToastrService) { }

 
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoading = true
      const loginPayload = this.loginForm.value

      this.authService.login(loginPayload).subscribe((res) => {
        this.toastr.success('Success', res.message, { timeOut: 500 })
        setTimeout(() => {
          this.isLoading = false;

          if (res.role) {
            if (res.role === 'owner') {
              this.router.navigate(['/owner']);
            } else if (res.role === 'supplier') {
              this.router.navigate(['/supplier']);
            } else {
              this.toastr.error('Unknown role', 'Login Failed')
            }
          } else {
            this.toastr.error('Error', 'Unknown role');
          }
        }, 500);
      },
        (error) => {
          this.isLoading = false;

          if (error.status === 404) {
            this.toastr.error(error.error.message, 'Login Failed')
          }
          else {
            this.toastr.error('Login failed', 'Error')
          }
        })
    }

  }

  togglePassword() {
    this.showPassword = !this.showPassword
  }
}
