import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Medicine } from '../models/medicine.model';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  public apiUrl: string = `${environment.backendUrl}/medicine`;
  constructor(private readonly http: HttpClient) { }

  getAllMedicine(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllMedicines`);
  }

  getMedicineById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getMedicineById/${id}`)
  }

  addMedicine(medicine: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addMedicine`, medicine)
  }

  updateMedicine(id: string, medicine: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateMedicine/${id}`, medicine)
  }

  getMedicineBySupplierId(id: string): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(`${this.apiUrl}/getMedicineBySupplierId/${id}`)
  }

  deleteMedicine(id: string, medicine: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/deleteMedicine/${id}`,medicine)
  }
}
