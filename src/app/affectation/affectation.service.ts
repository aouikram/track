import { Injectable, ValueProvider } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Affectation } from './affectation';
import { environment } from 'environments/environment';
import { Vehicule } from 'app/vehicule/vehicule';
import { Conducteur } from 'app/conducteur/conducteur';




@Injectable({
  providedIn: 'root'
})
export class AffectationService {

  private apiServerUrl=environment.apiBaseUrl;
  constructor(private http: HttpClient) {}


    public getAffectations(): Observable<Affectation[]>{
      return this.http.get<Affectation[]>(`${this.apiServerUrl}/affectation/lister_affectations`);
    }
  
    public getAffectationById(affectationId : number): Observable<Affectation> {
      return this.http.get<Affectation>(`${this.apiServerUrl}/affectation/trouver/${affectationId}`);
    }

    public getVehiculeById(vehiculeId : number): Observable<Vehicule> {
      return this.http.get<Vehicule>(`${this.apiServerUrl}/vehicule/trouver/${vehiculeId}`);
    }

    public getConducteurById(id : number): Observable<Conducteur> {
      return this.http.get<Conducteur>(`${this.apiServerUrl}/conducteur/trouver/${id}`);
    }

    public deleteAffectation(affectationId: number): Observable<void> {
      return this.http.delete<void>(`${this.apiServerUrl}/affectation/supprimer/${affectationId}`);
    }

    public updateAffectation(affectation: Affectation): Observable<Affectation> {
      return this.http.put<Affectation>(`${this.apiServerUrl}/affectation/modifier_affectation`, affectation);
    }

    public getVehicules(): Observable<Vehicule[]>{
      return this.http.get<Vehicule[]>(`${this.apiServerUrl}/vehicule/lister_vehicules`);
    }

    public getConducteurs(): Observable<Conducteur[]>{
      return this.http.get<Conducteur[]>(`${this.apiServerUrl}/conducteur/lister_conducteurs`);
    }

    public addAffectation(affectation : Affectation): Observable<Affectation>{
      return this.http.post<Affectation>(`${this.apiServerUrl}/affectation/ajouter_affectation`, affectation);
    }
    
    // public updateAffectationVehicule(vehicule: Vehicule , affectationId : number): Observable<Affectation> {
    //   return this.http.put<Affectation>(`${this.apiServerUrl}/affectation/modifier_vehicule/${affectationId}`, vehicule);
    // }

    // public updateAffectationConducteur(conducteur: Conducteur , affectationId : number): Observable<Affectation> {
    //   return this.http.put<Affectation>(`${this.apiServerUrl}/affectation/modifier_conducteur/${affectationId}`, conducteur);
    // }

    // public updateAffectationDateDebut(dateDebut: Date , affectationId : number): Observable<Affectation> {
    //   return this.http.put<Affectation>(`${this.apiServerUrl}/affectation/modifier_dateDebut/${affectationId}`, dateDebut);
    // }

 

    // public updateAffectationDateFin(dateFin: Date , affectationId : number): Observable<Affectation> {
    //   return this.http.put<Affectation>(`${this.apiServerUrl}/affectation/modifier_dateFin/${affectationId}`, dateFin);
    // }
}
