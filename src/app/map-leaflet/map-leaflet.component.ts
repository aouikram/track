import { Control, Map} from 'leaflet';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import "@bepo65/leaflet.fullscreen";
import { EventData } from 'app/maps/eventData';
import { EventDataService } from 'app/maps/eventData.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Vehicule } from 'app/vehicule/vehicule';
import { NgForm } from '@angular/forms';
import { identity } from 'rxjs';


@Component({
  selector: 'app-map-leaflet',
  templateUrl: './map-leaflet.component.html',
  styleUrls: ['./map-leaflet.component.scss']
})
export class MapLeafletComponent  implements   AfterViewInit {


   clickedVehicule: Vehicule;
  map : Map;
  custom : Control ; 
  vehicules: Vehicule[] = [];
  latestEventDataofAllVehicules : EventData[] = [];
  eventData: EventData[] = [];
  destinations : string[]  = ["north","north_east","north_west","west","south_west","east","south_east","south","north"];
  destinationsFrench : string[] = ["Nord","Nord-Est","Nord-Ouest","Ouest","Sud-Ouest","Est","Sud-Est","Sud","Nord"];
  icons : string[]  = ["arrow-up&iconType=awesome","call_made","call_missed","arrow-left&iconType=awesome","call_received","arrow-right&iconType=awesome","trending_down","arrow-down&iconType=awesome","arrow-up&iconType=awesome"];
  degrees : number[] = [360,45,315,270,225,90,135,180,0];
  smallIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
    iconSize:    [25, 41],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize:  [41, 41]
  });


  constructor(private eventDataService : EventDataService , private http: HttpClient) { }


  ngAfterViewInit(): void { 
    this.getLatestEventData(); 
  }
  
  //find speed intervall and asign iconCorlor
  public getSpeedColor(eventData : EventData):string {
    var speed = eventData.speedKPH;


    var speedColor = "";
    if (speed == 0 || speed == null) 
      speedColor = "230047ab";  
    else if (speed > 0 && speed <= 60)
      speedColor = "2300d100";  
    else if (speed > 60 && speed <= 80)
      speedColor = "23ffff00";
    else if (speed > 80 && speed <= 105)
      speedColor = "23ff6600";
    else if (speed > 105 && speed <= 120)
      speedColor = "23ff009c";
    else if (speed > 120)
      speedColor = "23ff0000";
    return speedColor;
  }

  // takes in a vehicule and an array of events , and returns an array of events that correspond to the vehicule
  public getLatestEventDataOfVehicule(vehicule: Vehicule, eventData: EventData[]) : EventData[] {
    let eventDataOfVehicule = [];
  for (let device of vehicule.devices) {
    for (let event of eventData) {
      if (event.device.deviceId == device.deviceId) {
        eventDataOfVehicule.push(event);
      }
    }
    return eventDataOfVehicule;
  }
}

// on click element list change the array eventData  loaded on the map , to an array of events of the clicked vehicule , and open the detail menu
   public onClickListElement(vehicule: Vehicule,  eventData: EventData[]): void {
     console.log("clicked");
    this.openDetailMenu();
    this.clickedVehicule = vehicule;
    this.eventData = this.getLatestEventDataOfVehicule(vehicule,eventData);
    this.map.off();
    this.map.remove();
    this.loadMap();
    

  }


  // changes the width of the detail menu
  public openDetailMenu(): void {

    let width = String($('div#side-menu.leaflet-sidebar').width()-100)+'px'
    let left = document.getElementById('side-menu').style.width;
  
      if(document.getElementById('detail-menu').style.width == '0px' || document.getElementById('detail-menu').style.width == '' ){
        document.getElementById('detail-menu').style.left=left;
        document.getElementById('detail-menu').style.width=width;
    }
  }

  public receive(detailForm : NgForm): void {
   console.log(detailForm.form.controls);
  }



  
  // find closest degree and assign destination 
  public getClosestDestination(eventData : EventData):string {
    var closestDestination = "";
   if (eventData.heading == null || eventData.heading == 0 ||eventData.speedKPH == 0 || eventData.speedKPH == null){
     closestDestination ="local_parking"
   }
   else {
    var degree = eventData.heading;
    var closestDegree = this.degrees[0];
    closestDestination = this.destinations[0];

    for (var i = 0; i < this.degrees.length; i++) {
      if (Math.abs(this.degrees[i] - degree) < Math.abs(closestDegree - degree)) {
        closestDegree = this.degrees[i];
        closestDestination = this.destinations[i];
      
      }
      
    }
   }


    return closestDestination;
  }

  // find closest destination of vehicule
  public getClosestDestinationOfVehicule(vehicule:Vehicule): string {
    const eventData = this.getLatestEventDataOfVehicule(vehicule,this.latestEventDataofAllVehicules);
   return this.getClosestDestination(eventData[0]);
  }

  // find closest destination of vehicule in french
  getClosestDestinatOfVehiculeFrench(vehicule:Vehicule): string {
   let destination = this.getClosestDestinationOfVehicule(vehicule);
   // find index of destination in destinations 
    let index = this.destinations.indexOf(destination);
    return this.destinationsFrench[index];
  }

  // find closest degree and assign corresponding icon
  public getClosestDestinationIcon(eventData : EventData ):string {
    var closestDestinationIcon = "";
   if (eventData.heading == null || eventData.heading == 0 ||eventData.speedKPH == 0 || eventData.speedKPH == null){
     closestDestinationIcon ="local_parking"
   }
   else {
    var degree = eventData.heading;
    var closestDegree = this.degrees[0];
    closestDestinationIcon = this.icons[0];

    for (var i = 0; i < this.degrees.length; i++) {
      if (Math.abs(this.degrees[i] - degree) < Math.abs(closestDegree - degree)) {
        closestDegree = this.degrees[i];
        closestDestinationIcon = this.icons[i];
      
      }
      
    }
   }


    return closestDestinationIcon;
  }
  
  // assign icon to eventData
  public getIcon(eventData : EventData,):L.Icon{
    var destinationIcon = this.getClosestDestinationIcon(eventData);
    var color = this.getSpeedColor(eventData);
  
    var icon = L.icon({

      iconUrl: 'https://api.geoapify.com/v1/icon/?type=material&color=%'+color+'&size=small&icon='+destinationIcon+'&scaleFactor=2&apiKey=10009fb840984ed0b026de075f9be71d',
      popupAnchor: [13, 0],
       //iconSize: [50, 70],
      iconAnchor: [15.5, 42]
    });
    return icon;
  }

  // returns array of the last position of each device
  public getLatestEventData(): EventData[] {
    this.eventDataService.getLatestEventData().subscribe(
        (response : EventData[]) => {
          this.eventData = response;
          this.latestEventDataofAllVehicules = response;
        },
        (error :HttpErrorResponse) => {
          alert(error.message);
        }, 
        () => {
          this.getVehiculesOfLatestEventData(this.eventData);
        }
          
      ); 
      return this.eventData;
}

public getVehiculesOfLatestEventData(eventData: EventData[]) {
this.eventDataService.findAllVehicules(eventData).subscribe(
  (response : Vehicule[]) => {
    this.vehicules = response;
    console.log(this.eventData);
    console.log(this.vehicules);
  },
  (error :HttpErrorResponse) => {
    alert(error.message);
  },()=> this.loadMap()

);
}

getSpeedOfVehicule(vehicule : Vehicule) : number{

  const eventDataOfVehicule = this.getLatestEventDataOfVehicule(vehicule , this.latestEventDataofAllVehicules);
  let speed = eventDataOfVehicule[0].speedKPH;
  return speed;
}
   


// make image url depending on the speed of vehicule
makeImageUrl(vehicule: Vehicule) : string{

  let speed = this.getSpeedOfVehicule(vehicule);
  let imageUrl ="../../assets/img/cars/truck-";

    var speedString = "";
    if (speed == 0 || speed == null) 
    speedString = "parked";  
    else if (speed > 0 && speed <= 60)
    speedString = "lessThan60";  
    else if (speed > 60 && speed <= 80)
    speedString = "lessThan80";
    else if (speed > 80 && speed <= 105)
      speedString = "lessThan105";
    else if (speed > 105 && speed <= 120)
      speedString = "lessThan120";
    else if (speed > 120)
      speedString = "moreThan120";

    imageUrl += speedString+".png";
    return imageUrl;
   
  }



private loadMap(): void {
    // let self = this;

    this.map = new L.Map('map', {
      center: [this.eventData[0].latitude, this.eventData[0].longitude],
      zoom: 5,
      fullscreenControl: true,
      fullscreenControlOptions: {position: 'topleft'}
    });

    // zoom and fullscreen position (top right)
    this.map.zoomControl.setPosition('topright');
    L.control.fullscreen({
      position:'topright'
    }).addTo(this.map);



    // side menu position (left)
    let Custom = Control.extend({
      onAdd(map: Map) {
         var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control customcss');
          var button = L.DomUtil.create('a', 'menuButton', container);
              button.innerHTML = '&#9776;';
              button.setAttribute('role', 'button');
             
          L.DomEvent.disableClickPropagation(button);
          L.DomEvent.on(button, 'click', this.click);
  
       
  
          return container;
      },
      onRemove(map: Map) {}
      ,
      click() {
        let width : string ;
        // mobile or small screen 
        if($('div.sidebar-wrapper.ps').width() == null){
          width = "360px";
        }
        // else take the width of the sidebar and add 100 px 
      else {
        width  = String($('div.sidebar-wrapper.ps').width()+100)+'px';
       }

        // open side menu
        if(document.getElementById('side-menu').style.width == '0px' || document.getElementById('side-menu').style.width == ''){
          console.log("here");
        document.getElementById('side-menu').style.width=width;
    }
        // close side menu
    else {
          document.getElementById('side-menu').style.width='0px';
          document.getElementById('detail-menu').style.width='0px';
        }
 

     
      }

    
    });


    this.custom = new Custom({
        position: 'topright'
       
         
  }).addTo(this.map);
 
  
 // map layers
    var googleTraffic = L.tileLayer('https://{s}.google.com/vt/lyrs=m@221097413,traffic&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      minZoom: 2,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(this.map);

    var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    }).addTo(this.map);

    var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    }).addTo(this.map);

// markers of vehicules
for (const c of this.eventData) {
         console.log(c);
          const lat = c.latitude;
      
          const lon = c.longitude;

          const customOptions = {
            'maxWidth': 200, // set max-width
            'className': 'customPopup' // name custom popup
           }
           const marker = L.marker([lat, lon], { icon: this.getIcon(c) }).addTo(this.map);

// popup of vehicules
if(c.speedKPH<60){
        const template1="<b><b><b>City: </b></b> "+c.city+"<br><b><b>Speed: </b></b>"+'<br><b><b>Speed: <span _ngcontent-mno-c22="" class="text1 text-success subtitle-2">'+c.speedKPH+" km/h</span></b></b>"+"<br><b><b>Fuel Level: </b></b>"+c.fuelLevel+"<br><b><b>Battery Level: </b></b>"+c.batteryLevel;
          marker.on('mouseover', function() {
            marker.bindPopup(template1,{className: 'mouseover-popup'});
            marker.openPopup();
          })
          
        
}else if(c.speedKPH>=60 && c.speedKPH<120){
    const template1="<b><b><b>City: </b></b> "+c.city+"<br><b><b>Speed: </b></b>"+'<br><b><b>Speed: <span _ngcontent-mno-c22="" class="text1 text-warning subtitle-2">'+c.speedKPH+" km/h</span></b></b>"+"<br><b><b>Fuel Level: </b></b>"+c.fuelLevel+"<br><b><b>Battery Level: </b></b>"+c.batteryLevel;
      marker.on('mouseover', function() {
        marker.bindPopup(template1,{className: 'mouseover-popup'});
        marker.openPopup();
})

     
}else{
  const template1="<b><b><b>City: </b></b> "+c.city+"<br><b><b>Speed: </b></b>"+'<br><b><b>Speed: <span _ngcontent-mno-c22="" class="text1 text-danger subtitle-2">'+c.speedKPH+" km/h</span></b></b>"+"<br><b><b>Fuel Level: </b></b>"+c.fuelLevel+"<br><b><b>Battery Level: </b></b>"+c.batteryLevel;
  marker.on('mouseover', function() {
    marker.bindPopup(template1,{className: 'mouseover-popup'});
    marker.openPopup();
})
}
}
}



}



