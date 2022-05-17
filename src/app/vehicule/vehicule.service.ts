import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicule } from './vehicule';
import { environment } from 'environments/environment';
import { Device } from 'app/device/device';




@Injectable({
  providedIn: 'root'
})
export class VehiculeService {

  private apiServerUrl=environment.apiBaseUrl;
  constructor(private http: HttpClient) {}


    public getVehicules(): Observable<Vehicule[]>{
      return this.http.get<Vehicule[]>(`${this.apiServerUrl}/vehicule/lister_vehicules`);
    }
  
    public addVehicule(vehicule : Vehicule): Observable<Vehicule>{
      return this.http.post<Vehicule>(`${this.apiServerUrl}/vehicule/ajouter_vehicule`, vehicule);
    }


    public getVehiculeById(vehiculeId : number): Observable<Vehicule> {
      return this.http.get<Vehicule>(`${this.apiServerUrl}/vehicule/trouver/${vehiculeId}`);
    }
  
    public updateVehicule(vehicule: Vehicule): Observable<Vehicule> {
      return this.http.put<Vehicule>(`${this.apiServerUrl}/vehicule/modifier_vehicule`, vehicule);
    }

    public deleteVehicule(vehiculeId: number): Observable<void> {
      return this.http.delete<void>(`${this.apiServerUrl}/vehicule/supprimer/${vehiculeId}`);
    }

    public getDevices(): Observable<Device[]>{
      return this.http.get<Device[]>(`${this.apiServerUrl}/vehicule/lister_devices_pas_utilise`);
    }

    public getVehiculeDevices(vehicule : Vehicule): Observable<Device[]>{
      return this.http.post<Device[]>(`${this.apiServerUrl}/lister_devices_de_vehicule`, vehicule);
    }
    
}