import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Affectation } from './affectation';
import { environment } from 'environments/environment';




@Injectable({
  providedIn: 'root'
})
export class AffectationService {

  private apiServerUrl=environment.apiBaseUrl;
  constructor(private http: HttpClient) {}


    public getAffectations(): Observable<Affectation[]>{
      return this.http.get<Affectation[]>(`${this.apiServerUrl}/affectation/lister_affectations`);
    }
  
    
}
