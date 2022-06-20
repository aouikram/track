import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conducteur } from './conducteur';
import { environment } from 'environments/environment';
import { Image } from 'app/image/image';




@Injectable({
  providedIn: 'root'
})
export class ConducteurService {

  private apiServerUrl=environment.apiBaseUrl;
  constructor(private http: HttpClient) {}


    public getConducteurs(): Observable<Conducteur[]>{
      return this.http.get<Conducteur[]>(`${this.apiServerUrl}/conducteur/lister_conducteurs`);
    }
  
    public addConducteur(conducteur : Conducteur): Observable<Conducteur>{
      return this.http.post<Conducteur>(`${this.apiServerUrl}/conducteur/ajouter_conducteur`, conducteur);
    }


    public getConducteurById(id : number): Observable<Conducteur> {
      return this.http.get<Conducteur>(`${this.apiServerUrl}/conducteur/trouver/${id}`);
    }
  
    public updateConducteur(conducteur: Conducteur): Observable<Conducteur> {
        
      return this.http.put<Conducteur>(`${this.apiServerUrl}/conducteur/modifier_conducteur`, conducteur);
    }

    public deleteConducteur(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiServerUrl}/conducteur/supprimer/${id}`);
    }

    public uploadImage(image : FormData): Observable<Image>{
      return this.http.post<Image>(`${this.apiServerUrl}/image/upload`, image);
    }
 
    public deleteImage(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiServerUrl}/image/supprimer/${id}`);
    }



}
