import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventData } from './eventData';
import { environment } from 'environments/environment';




@Injectable({
  providedIn: 'root'
})
export class EventDataService {

  private apiServerUrl=environment.apiBaseUrl;
  constructor(private http: HttpClient) {}


    public getEventData(): Observable<EventData[]>{
      return this.http.get<EventData[]>(`${this.apiServerUrl}/eventData/lister_eventData`);
    }
  
    public getLatestEventData(): Observable<EventData[]>{
        return this.http.get<EventData[]>(`${this.apiServerUrl}/eventData/lister_derniers_eventData`);
      }


}