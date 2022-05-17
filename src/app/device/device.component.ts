import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Device } from './device';
import { DeviceService } from './device.service';
import { MatPaginator } from '@angular/material/paginator';
import { NgxPaginationModule } from 'ngx-pagination';



@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit{

  title = 'geolocalisation';
  devices: Device[] = [];
  editDevice: Device | undefined;
  deleteDevice: Device | undefined;
  viewDevice : Device | undefined;


  page: number = 1;
  count: number = 0;
  tableSize: number = 4;
  tableSizes: any = [3, 6, 9, 12];



 constructor(private deviceService: DeviceService) {}

  ngOnInit(): void {
         this.getDevices();
         console.log(this.devices);
 }

 //shows the devices on the UI
   getDevices():void {
   this.deviceService.getDevices().subscribe(
     (response : Device[]) => {
       this.devices = response;
        console.log(this.devices);
     },
     (error :HttpErrorResponse) => {
       alert(error.message);
     }
   );
 }

onTableDataChange(event: any) {
  this.page = event;
  this.getDevices();
}

onTableSizeChange(event: any): void {
  this.tableSize = event.target.value;
  this.page = 1;
  this.getDevices();
}

  // search device by manufacturer or serial number
  public searchDevices(key: string):void {
    console.log(key);
    const results: Device[] = []; // array that stores all the devices that match the key : results
    for (const device of this.devices) { // loop over all the devices in the app
      if ( device.deviceIMEI.toLowerCase().indexOf(key.toLowerCase()) !== -1 
      || device.deviceName.toLowerCase().indexOf(key.toLowerCase()) !== -1){
        
        results.push(device);
      }
    }
    this.devices = results; //list the results
    if (results.length === 0 || !key) {
      this.getDevices();
    }
  }
 
 // controls the modal of the html that will be displayed 
 public onOpenModal( mode: string ,device?: Device ): void {
   const container = document.getElementById('main-container');
   const button = document.createElement('button');
   button.type = 'button';
   button.style.display = 'none';
   button.setAttribute('data-toggle', 'modal');
   if (mode === 'add') {
     button.setAttribute('data-target', '#addDeviceModal');
   }
   else if (mode === 'edit') {
    this.editDevice  = device;
     button.setAttribute('data-target', '#updateDeviceModal');
   }
   else if (mode === 'delete') {
     this.deleteDevice = device;
     button.setAttribute('data-target', '#deleteDeviceModal');
   }
   else if (mode === 'view') {
    this.viewDevice = device;
    button.setAttribute('data-target', '#viewDeviceModal');
  }
   container?.appendChild(button);
   button.click();
 }

 // adds the form input as a device
 public onAddDevice(addForm:NgForm):void{
   document.getElementById('add-device-form')?.click();
     this.deviceService.addDevice(addForm.value).subscribe(
       (response: Device) => {
         console.log(response);
         this.getDevices();
         addForm.reset();
       },
       (error: HttpErrorResponse) => {
         alert(error.message);
         addForm.reset();
       }
     );
   }

public onUpdateDevice(device:Device):void{
       this.deviceService.updateDevice(device).subscribe(
         (response: Device) => {
           console.log(response);
           this.getDevices();
         },
         (error: HttpErrorResponse) => {
           alert(error.message);
         }
       );
     }

public onDeleteDevice(deviceId: number): void {
       this.deviceService.deleteDevice(deviceId).subscribe(
         (response: void) => {
           console.log(response);
           this.getDevices();
         },
         (error: HttpErrorResponse) => {
           alert(error.message);
         }
       );
     }
 
}
