import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Request } from '../models/request.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  public apiUrl = `${environment.backendUrl}/request`;

  constructor(private readonly http:HttpClient) { }

  addRequest(requestObject:Request):Observable<Request>{
    return this.http.post<Request>(`${this.apiUrl}/addRequest`,requestObject);
  }

  getRequestsByUserId(userId:string):Observable<Request[]>{
    return this.http.get<Request[]>(`${this.apiUrl}/getRequestsByUserId/${userId}`);
  }

  getRequestsBySupplier(supplierId:string):Observable<Request[]>{
    return this.http.get<Request[]>(`${this.apiUrl}/getAllRequestsBySupplier/${supplierId}`);
  }

  deleteRequest(requestId:string):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/deleteRequest/${requestId}`);
  }

  updateRequest(requestId:string, request:any):Observable<Request>{
    return this.http.put<Request>(`${this.apiUrl}/updateRequest/${requestId}`,request);
  }

  getAllRequests():Observable<Request[]>{
    return this.http.get<Request[]>(`${this.apiUrl}/getAllRequests`);
  }
}
