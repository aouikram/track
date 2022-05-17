import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Vehicule } from './vehicule';
import { Device } from 'app/device/device';
import { VehiculeService } from './vehicule.service';
import { MatPaginator } from '@angular/material/paginator';
import { NgxPaginationModule } from 'ngx-pagination';



@Component({
  selector: 'app-vehicule',
  templateUrl: './vehicule.component.html',
  styleUrls: ['./vehicule.component.css']
})
export class VehiculeComponent implements OnInit{

  title = 'geolocalisation';
  vehicules: Vehicule[] = [];
  editVehicule: Vehicule | undefined;
  deleteVehicule: Vehicule | undefined;
  viewVehicule : Vehicule | undefined;
  vehicule : Vehicule | undefined;
  devices:Device[]=[];
  devices1:Device[]=[];
  device:Device;
  page: number = 1;
  count: number = 0;
  tableSize: number = 4;
  tableSizes: any = [3, 6, 9, 12];



 constructor(private vehiculeService: VehiculeService) {}

  ngOnInit(): void {
         this.getVehicules();
         this.getDevices();
         console.log(this.vehicules);
 }

 //shows the vehicules on the UI
   getVehicules():void {
   this.vehiculeService.getVehicules().subscribe(
     (response : Vehicule[]) => {
       this.vehicules = response;
        console.log(this.vehicules);
     },
     (error :HttpErrorResponse) => {
       alert(error.message);
     }, ()=> this.getDevices())
 }
 getDevices():void{
//get device who their etat = false (qui sont disponibles) 
  this.vehiculeService.getDevices().subscribe(
    (response : Device[]) => {
      this.devices = response;
       console.log(this.devices);
    },
    (error :HttpErrorResponse) => {
      alert(error.message);
    }
  );
  
 }
 getVehiculeDevices(vehicule? : Vehicule):Device[]{
console.log(vehicule);
  this.vehiculeService.getVehiculeDevices(vehicule).subscribe(
    (response : Device[]) => {
      this.devices1 = response;
       console.log(this.devices1);
    },
    (error :HttpErrorResponse) => {
      alert(error.message);
    }
  ); return this.devices1;
  
 }

onTableDataChange(event: any) {
  this.page = event;
  this.getVehicules();
}

onTableSizeChange(event: any): void {
  this.tableSize = event.target.value;
  this.page = 1;
  this.getVehicules();
}

  // search vehicule by manufacturer or serial number
  public searchVehicules(key: string):void {
    console.log(key);
    const results: Vehicule[] = []; // array that stores all the vehicules that match the key : results
    for (const vehicule of this.vehicules) { // loop over all the vehicules in the app
      if ( vehicule.serialNumber.toLowerCase().indexOf(key.toLowerCase()) !== -1 
      || vehicule.manufacturer.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || vehicule.licensePlate.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || vehicule.model.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || vehicule.equipmentType.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        
        results.push(vehicule);
      }
    }
    this.vehicules = results; //list the results
    if (results.length === 0 || !key) {
      this.getVehicules();
    }
  }
 
 // controls the modal of the html that will be displayed 
 public onOpenModal( mode: string ,vehicule?: Vehicule ): void {
   const container = document.getElementById('main-container');
   const button = document.createElement('button');
   button.type = 'button';
   button.style.display = 'none';
   button.setAttribute('data-toggle', 'modal');
   if (mode === 'add') {
     button.setAttribute('data-target', '#addVehiculeModal');
   }
   else if (mode === 'edit') {
    this.editVehicule  = vehicule;
     button.setAttribute('data-target', '#updateVehiculeModal');
   }
   else if (mode === 'delete') {
     this.deleteVehicule = vehicule;
     button.setAttribute('data-target', '#deleteVehiculeModal');
   }
   else if (mode === 'view') {
    this.viewVehicule = vehicule;
    button.setAttribute('data-target', '#viewVehiculeModal');
  }
   container?.appendChild(button);
   button.click();
 }

 // adds the form input as a vehicule
 public onAddVehicule(addForm:NgForm):void{
   document.getElementById('add-vehicule-form')?.click();
     this.vehiculeService.addVehicule(addForm.value).subscribe(
       (response: Vehicule) => {
         console.log(response);
         this.getVehicules();
         addForm.reset();
       },
       (error: HttpErrorResponse) => {
         alert(error.message);
         addForm.reset();
       }
     );
   }

public onUpdateVehicule(vehicule:Vehicule):void{
       this.vehiculeService.updateVehicule(vehicule).subscribe(
         (response: Vehicule) => {
           console.log(response);
           this.getVehicules();
         },
         (error: HttpErrorResponse) => {
           alert(error.message);
         }
       );
     }

public onDeleteVehicule(vehiculeId: number): void {
       this.vehiculeService.deleteVehicule(vehiculeId).subscribe(
         (response: void) => {
           console.log(response);
           this.getVehicules();
         },
         (error: HttpErrorResponse) => {
           alert(error.message);
         }
       );
     }
 
}
