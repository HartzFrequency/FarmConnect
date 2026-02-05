import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, tap } from 'rxjs';
import { Login } from '../models/login.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public apiUrl: string = `${environment.backendUrl}/user`;
  private readonly tokenKey = 'authToken';
  private readonly id = 'userId';
  private readonly role = 'userRole';
  private readonly name = 'userName';
  constructor(private readonly http: HttpClient) { }

  register(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, user);
  }

  login(login: Login): Observable<any> {
    return this.http.post<{ id: string; userName: string; role: string; token: string }>(`${this.apiUrl}/login`, login).pipe(tap(data => {
      localStorage.setItem(this.tokenKey, JSON.stringify(data.token));
      localStorage.setItem(this.id, JSON.stringify(data.id));
      localStorage.setItem(this.role, JSON.stringify(data.role));
      localStorage.setItem(this.name, JSON.stringify(data.userName));
    }));
  }

  logout(): void {
    localStorage.clear();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string {
    return localStorage.getItem(this.tokenKey);
  }

  sendOtp(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgotPassword`, { email });
  }

  resetPasswordWithOtp(email: string, newPassword: string, otp: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/resetPasswordWithOtp`, {
      email,
      password: newPassword,
      otp,
    });
  }
}
