import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Device } from './device';
import { environment } from 'environments/environment';
import { Image } from 'app/image/image';




@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private apiServerUrl=environment.apiBaseUrl;
  constructor(private http: HttpClient) {}


    public getDevices(): Observable<Device[]>{
      return this.http.get<Device[]>(`${this.apiServerUrl}/device/lister_devices`);
    }
  
    public addDevice(device : Device): Observable<Device>{
      return this.http.post<Device>(`${this.apiServerUrl}/device/ajouter_device`, device);
    }


    public getDeviceById(id : number): Observable<Device> {
      return this.http.get<Device>(`${this.apiServerUrl}/device/trouver/${id}`);
    }
  
    public updateDevice(device: Device): Observable<Device> {
        
      return this.http.put<Device>(`${this.apiServerUrl}/device/modifier_device`, device);
    }

    public deleteDevice(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiServerUrl}/device/supprimer/${id}`);
    }

    public getAvailableDevices(): Observable<Device[]>{
      return this.http.get<Device[]>(`${this.apiServerUrl}/device/lister_devices_pas_utilise`);
    }

    public freeDevice(device : Device): Observable<Device>{
      return this.http.post<Device>(`${this.apiServerUrl}/device/liberer_device`, device);
    }

}
