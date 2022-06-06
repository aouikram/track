import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventData } from './eventData';
import { environment } from 'environments/environment';
import { Vehicule } from 'app/vehicule/vehicule';




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

    // get Vehicules by eventData[]
    public findAllVehicules(eventDataList : EventData[]): Observable<Vehicule[]> {
      return this.http.post<Vehicule[]>(`${this.apiServerUrl}/eventData/trouver_vehicules`, eventDataList);
    }

}