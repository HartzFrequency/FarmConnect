import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Livestock } from '../models/livestock.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LivestockService {

  public apiUrl: string = `${environment.backendUrl}/livestock`;

  constructor(private readonly http: HttpClient) { }

  getLivestockById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getLivestockById/${id}`);
  }

  addLivestock(livestock: any): Observable<Livestock> {
    return this.http.post<Livestock>(`${this.apiUrl}/addLivestock`, livestock);
  }

  updateLivestock(id: string, livestock: Livestock): Observable<Livestock> {
    return this.http.put<Livestock>(`${this.apiUrl}/updateLivestock/${id}`, livestock);
  }

  getLivestockByUserId(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getLivestockByUser/${id}`);
  }

  deleteLivestock(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteLivestock/${id}`);
  }

  getLivestockByUserIdowner(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getLivestockByUser/${userId}`)
  }
}
