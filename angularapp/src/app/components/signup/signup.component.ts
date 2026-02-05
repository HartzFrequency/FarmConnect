import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm!: FormGroup;
  showPassword: boolean = false;
  confirmPassword: boolean = false;
  isLoading: boolean = false;

  constructor(private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly toastr: ToastrService,
    private readonly router: Router
  ) {
    this.signupForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', Validators.required],
      role: ['owner', Validators.required]
    }, { validators: this.passwordValidator })
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirm_password');

    if (!password || !confirmPassword) return null;

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      if (confirmPassword.hasError('mismatch')) {
        confirmPassword.setErrors(null);
      }
      return null;
    }
  }

  onSubmit(): void {
    console.log(this.signupForm.value);
    if (this.signupForm.valid) {
      this.isLoading = true
      const { confirm_password, ...user } = this.signupForm.value
      this.authService.register(user).subscribe((res) => {
        this.toastr.success('Please login..', res.message, { timeOut: 500 })
        setTimeout(() => {
          this.isLoading = false;
          this.router.navigate(['/login'])
        }, 500);
        this.signupForm.reset()

      },
        (error) => {       
          this.isLoading = false;
          if (error.error.message.includes('mobile')) {
            this.toastr.error('Mobile number already registered', 'Registration failed')
          }
          else if (error.error.message.includes('User already exists')) {
            this.toastr.error('Email already registered', 'Registration failed')
          }
          else if (error.error.message.includes('userName')) {
            this.toastr.error('Username already registered', 'Registration failed')
          }
          else {
            this.toastr.error('Registration failed', 'Error')
          }
        })
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword
  }
  toggleConfirmPassword() {
    this.confirmPassword = !this.confirmPassword
  }

}
