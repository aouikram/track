import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MissionsService } from './missions.service';
import { Missions } from './Missions';
@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.scss']
})
export class MissionsComponent implements OnInit {

 
  title = 'geolocalisation';
  missions:Missions[] = [];
  editVehicule: Missions | undefined;
  deleteVehicule: Missions | undefined;

 constructor(private missionsService: MissionsService) {}

 ngOnInit(): void {
         this.getMissions();
 }

 //shows the vehicules on the UI
 public getMissions():void {
   this.missionsService.getMission().subscribe(
     (response : Missions[]) => {
       this.missions = response;
     },
     (error :HttpErrorResponse) => {
       alert(error.message);
     }
   );
 }
 // search vehicule by vehicule code or serial number
 
}
