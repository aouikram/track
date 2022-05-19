import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Vehicule } from './vehicule';
import { Device } from 'app/device/device';
import { VehiculeService } from './vehicule.service';
import { MatPaginator } from '@angular/material/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import { DeviceService } from 'app/device/device.service';



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


  addedDevice : Device;
  checkedDevice : Device ;
  checkedDevices : Device[] = [];


  availableDevices:Device[]=[];


 constructor(private vehiculeService: VehiculeService , private deviceService : DeviceService) {}

  ngOnInit(): void {
         this.getVehicules();
         this.getDevices();
         this.getAvailableDevices();
         console.log(this.vehicules);
 }


 //gets list of vehicules from database
   getVehicules():void {
   this.vehiculeService.getVehicules().subscribe(
     (response : Vehicule[]) => {
       this.vehicules = response;
        console.log(this.vehicules);
     },
     (error :HttpErrorResponse) => {
       alert(error.message);
     }, ()=> this.getDevices());
 }

   //get available devices ( not used vehiculeID == null)
    public getAvailableDevices():void{
      this.deviceService.getAvailableDevices().subscribe(
        (response: Device[]) => {
          this.availableDevices = response;
          console.log(this.availableDevices);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }

    // if isChecked is true get the device with the deviceId = deviceId and add it to the vehicule
onChangeCheckbox(deviceId: number, isChecked: boolean) {

      if(isChecked == true){
        this.deviceService.getDeviceById(deviceId).subscribe(
          (response : Device) => {
            this.checkedDevice = response;
             
          },
          (error :HttpErrorResponse) => {
            alert(error.message);
          }, ()=> this.checkedDevices.push(this.checkedDevice) // add device to list of checked devices 
          );
      }
      else if (isChecked == false){
        // remove device from checkedDevices if it's in the list 
        this.checkedDevices = this.checkedDevices.filter(device => device.deviceId !== deviceId);

    } 
  console.log(this.checkedDevices);
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
   addForm.value.devices = this.checkedDevices;
   document.getElementById('add-vehicule-form')?.click();
     this.vehiculeService.addVehicule(addForm.value).subscribe(
       (response: Vehicule) => {
        this.getVehicules();
        this.checkedDevices = []; // empty checked devices array
        addForm.reset();
       },
       (error: HttpErrorResponse) => {
         alert(error.message);
         addForm.reset();
      },  ()=> this.getAvailableDevices() 
     
     
    
     ); 
     
   }

   // adds the new device to the database and adds it to the availableDevices array
   public onAddDevice(addDeviceForm:NgForm):void{
    console.log(addDeviceForm.value);
    document.getElementById('add-device-form')?.click();
    this.deviceService.addDevice(addDeviceForm.value).subscribe(
      (response: Device) => {
        this.addedDevice = response;
        this.getDevices();
        this.getAvailableDevices();
        addDeviceForm.reset();
        },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addDeviceForm.reset();
      }, // check the addedDevice in the checkbox 
      // ()=> document.getElementById("devices-checkbox-"+this.addedDevice.deviceId)?.click()
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
         }, ()=> this.getAvailableDevices()
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
         }, ()=> this.getAvailableDevices()
       );
     }
 
}
