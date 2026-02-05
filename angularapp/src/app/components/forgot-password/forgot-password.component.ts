import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm!: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toastr: ToastrService) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4),]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: this.passwordMatchValidator });
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  sendOtp(): void {
    const emailControl = this.forgotPasswordForm.get('email');

    if (!emailControl || emailControl.invalid) {
      emailControl?.markAsTouched();
      this.toastr.error('Please enter OTP');
      return;
    }

    const email = emailControl.value;

    this.authService.sendOtp(email).subscribe({
      next: (res) => {
        this.toastr.success(res.message ?? 'OTP sent to your email');
      },
      error: (err) => {
        this.toastr.error(err.error?.message ?? 'Failed to send OTP. Please try again.');
      }
    });
  }

  submit() {
    if (this.forgotPasswordForm.value.newPassword != this.forgotPasswordForm.value.confirmPassword) {
      this.toastr.error('Pasword Mismatch');
      this.forgotPasswordForm.reset();
    }
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { email, newPassword, otp } = this.forgotPasswordForm.value;

    this.authService.resetPasswordWithOtp(email, newPassword, otp).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toastr.success(res.message ?? 'Password updated successfully');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error(
          err.error?.message ?? 'Invalid OTP or email. Please try again.'
        );
      },
    });
  }
}

