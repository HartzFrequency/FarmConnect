import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Feed } from '../models/feed.model';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  public apiUrl: string = `${environment.backendUrl}/feed`;
  constructor(private readonly http: HttpClient) { }

  getAllFeeds(): Observable<Feed[]> {
    return this.http.get<Feed[]>(`${this.apiUrl}/getAllFeeds`);
  }

  getFeedById(id: string): Observable<Feed> {
    return this.http.get<Feed>(`${this.apiUrl}/getFeedById/${id}`);
  }

  getFeedBySupplierId(supplierId: string): Observable<Feed[]> {
    return this.http.get<Feed[]>(`${this.apiUrl}/getFeedBySupplierId/${supplierId}`);
  }

  addFeed(feed: Feed): Observable<Feed> {
    return this.http.post<Feed>(`${this.apiUrl}/addFeed`, feed);
  }

  updateFeed(id: string, feed: Feed): Observable<Feed> {
    return this.http.put<Feed>(`${this.apiUrl}/updateFeed/${id}`, feed);
  }

  deleteFeed(id: string, feed: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/deleteFeed/${id}`, feed);
  }
}
