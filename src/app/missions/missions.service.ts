import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Missions} from './missions';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MissionsService {
  private apiServerUrl=environment.apiBaseUrl;
  constructor(private http: HttpClient) {}


    public getMission(): Observable<Missions[]>{
      return this.http.get<Missions[]>(`${this.apiServerUrl}/mission/lister_missions`);
    }
  
    public addMission(vehicule : Missions): Observable<Missions>{
      return this.http.post<Missions>(`${this.apiServerUrl}/mission/ajouter_mission`, vehicule);
    }


    public getMissionById(missionId : number): Observable<Missions> {
      return this.http.get<Missions>(`${this.apiServerUrl}/mission/trouver/${missionId}`);
    }
  
    public updateMission(vehicule: Missions): Observable<Missions> {
      return this.http.put<Missions>(`${this.apiServerUrl}/mission/modifier_mission`, vehicule);
    }

    public deleteMission(vehiculeId: number): Observable<void> {
      return this.http.delete<void>(`${this.apiServerUrl}/mission/supprimer/${vehiculeId}`);
    }
}