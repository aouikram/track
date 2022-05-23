import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Vehicule } from './vehicule';
import { Device } from 'app/device/device';
import { VehiculeService } from './vehicule.service';
import { MatPaginator } from '@angular/material/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import { DeviceService } from 'app/device/device.service';
import { on } from 'events';



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


  freedDevices : Device[] = [];
  addedDevice : Device;
  checkedDevice : Device ;
  checkedDevices : Device[] = [];


  availableDevices:Device[]=[];


 constructor(private vehiculeService: VehiculeService , private deviceService : DeviceService) {}

  ngOnInit(): void {
         this.getVehicules();
         this.getAvailableDevices();
 }


 //gets list of vehicules from database
   getVehicules():void {
   this.vehiculeService.getVehicules().subscribe(
     (response : Vehicule[]) => {
       this.vehicules = response;
     },
     (error :HttpErrorResponse) => {
       alert(error.message);
     });
 }

   //get available devices ( not used vehiculeID == null)
public getAvailableDevices():void{
      this.deviceService.getAvailableDevices().subscribe(
        (response: Device[]) => {
          this.availableDevices = response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }

    // if isChecked is true get the device with the deviceId = deviceId and add it to the vehicule
onChangeCheckbox(deviceId: number, isChecked: boolean ) {

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
    console.log("onchange"+this.checkedDevices);
}

// empty checkedDevices array and call availableDevices
public emptyArrays(){
  this.checkedDevices = [];
  this.getAvailableDevices();
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
   button.setAttribute('data-backdrop', 'static');
   button.setAttribute('data-keyboard', 'false');

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
    console.log( this.viewVehicule);
    button.setAttribute('data-target', '#viewVehiculeModal');
    button.setAttribute('data-backdrop', 'true');
    button.setAttribute('data-keyboard', 'true');
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
 

    document.getElementById('add-device-form')?.click();

    this.deviceService.addDevice(addDeviceForm.value).subscribe(
      (response: Device) => {
        this.addedDevice = response;
        addDeviceForm.reset();
        },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addDeviceForm.reset();
      }, // display check the chekbox of the added device
      () => this.onChangeCheckbox(this.addedDevice.deviceId, true )
      
      
      
     
    );
    }


// if cancel button is clicked add the freedDevice back to the editVehicule devices list 
public onCancelEditForm():void{
   if(this.freedDevices.length != 0 ){
        // for each device in freedDevices add device to editVehicule devices list 
    for(const device of this.freedDevices  ) {
      this.editVehicule.devices.push(device);
    }
    // update editVehicule
    this.onUpdateVehicule(this.editVehicule);
   }

}

    

// finds the device with the deviceId , and updates it in the database
public freeDevice(device : Device , vehiculeId : number):void{

      this.deviceService.freeDevice(device).subscribe(
        (response: Device) => {
          this.getAvailableDevices();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        },
        ()=>{
          this.vehiculeService.removeDeviceFromVehicule(vehiculeId, device).subscribe(
            (response: Vehicule) => {
              this.editVehicule= response;
              this.getVehicules();
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            },()=>{ this.freedDevices.push(device);}
          );
        }
      );
}

public onUpdateVehicule(vehicule:Vehicule):void{
  // console.log(this.editVehicule.devices);
  // console.log(this.checkedDevices);
   let emptyDevicesArray : Device[] = [];
   vehicule.devices = this.editVehicule.devices.concat(this.checkedDevices);
  console.log(vehicule);
  this.vehiculeService.updateVehiculeDevices(emptyDevicesArray, vehicule.vehiculeId).subscribe(
    (response: Vehicule) => {
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    },()=>{
      this.vehiculeService.updateVehicule(vehicule).subscribe(
        (response: Vehicule) => {
          console.log(response);
          this.checkedDevices = [];
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }, ()=> { this.getVehicules(); 
         this.getAvailableDevices() ; 
       this.freedDevices = []; }
      );
    }
  )
       

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
