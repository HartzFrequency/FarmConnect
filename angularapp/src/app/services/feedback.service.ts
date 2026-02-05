import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Feedback } from '../models/feedback.model';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  public apiUrl: string = `${environment.backendUrl}/feedback`;
  constructor(private readonly http: HttpClient) { }

  getAllFeedbacksBySupplier(supplierId: string): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/supplier/${supplierId}`)
  }

  addFeedback(feedback: Feedback): Observable<Feedback> {
    return this.http.post<Feedback>(`${this.apiUrl}/addFeedback`, feedback)
  }

  deleteFeedback(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteFeedback/${id}`)
  }
}
