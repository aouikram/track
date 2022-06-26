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
import * as E from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-bing-layer';

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
  eventDatadates: EventData[] = [];
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
  googleHybrid: L.TileLayer;
  googleTerrain: L.TileLayer;
  googleStreets: L.TileLayer;
  openStreetMap: L.TileLayer;
  tomtom: L.TileLayer;
  tomtomMapDefault: any;
  tomtomMapSatellite: any;

  i : number;
  message: string;

  constructor(private eventDataService : EventDataService , private http: HttpClient) { }


  ngAfterViewInit(): void { 
    L.Icon.Default.imagePath = "assets/leaflet/" 
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
    if(vehicule != null){
      for (let device of vehicule.devices) {
        for (let event of eventData) {
          if (event.device.deviceId == device.deviceId) {
            eventDataOfVehicule.push(event);
          }
        }
        return eventDataOfVehicule;
      }
    }
    return eventDataOfVehicule;
 
}

// on click element list change the array eventData  loaded on the map , to an array of events of the clicked vehicule , and open the detail menu
   public onClickListElement(vehicule: Vehicule,  eventData: EventData[]): void {
  
     this.message="";
    this.openDetailMenu();
    this.clickedVehicule = vehicule;
    this.eventData = this.getLatestEventDataOfVehicule(vehicule,eventData);
    this.map.off();
    this.map.remove();
    this.loadMap("click");
    

  }


  // changes the width of the detail menu
  public openDetailMenu(): void {
     
    let width = String($('div#side-menu.leaflet-sidebar').width()-100)+'px'
    let left = document.getElementById('side-menu').style.width;
  
      if(document.getElementById('detail-menu').style.width == '0px' || document.getElementById('detail-menu').style.width == '' ){
        document.getElementById('detail-menu').style.top = "0";
        document.getElementById('detail-menu').style.left=left;
        document.getElementById('detail-menu').style.width=width;
        document.getElementById('detail-menu').style.position="fixed";
        document.getElementById('detail-menu').style.padding="10px 20px 10px 0";
    }

    document.getElementById('icon-close-menu').style.visibility="hidden";
  }





 public closeSideMenu(): void {
    document.getElementById('side-menu').style.width='0px';
    this.closeDetailMenu();
  }

  public receive(detailForm : NgForm): void {
    var deviceId: number;

    this.message="";

    if(detailForm.form.controls.deviceId == null || detailForm.form.controls.deviceId?.value == ""){
      deviceId = this.clickedVehicule.devices[0].deviceId;
    }
    else {
      deviceId = detailForm.form.controls.deviceId.value;
    }
    console.log(deviceId);
   this.eventDatadates=this.getEventDataBeetwenDates(deviceId,Date.parse(detailForm.form.controls.dateDebut.value)/1000,Date.parse(detailForm.form.controls.dateFin.value)/1000);
 
  }

public getEventDataBeetwenDates(id:number,timestamp1:number,timestamp2:number): EventData[] {
  
  this.eventDataService.getEventDataBeetwenDates(id,timestamp1,timestamp2).subscribe(
    (response : EventData[]) => {
      this.eventDatadates = response;
      console.log(this.eventDatadates);
      
    },
    (error :HttpErrorResponse) => {
      alert(error.message);
    },
    ()=>this.subscribe1(this.eventDatadates)
    );
    console.log(this.eventDatadates);
return this.eventDatadates;


}

public subscribe1(eventDatadates : EventData[]) {

  if(eventDatadates.length > 1){
    this.eventDatadates=eventDatadates;
    this.eventData = eventDatadates;
    this.map.off();
    this.map.remove();
    this.loadMap("itenerary");
  }
  else {
    this.message = "aucun trajet trouvé "
  }

}

public closeDetailMenu(): void {
  document.getElementById('detail-menu').style.width = "0px";
  document.getElementById('icon-close-menu').style.visibility="visible";
  document.getElementById('detail-menu').style.padding="0";
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
    if(vehicule != null){
      const eventData = this.getLatestEventDataOfVehicule(vehicule,this.latestEventDataofAllVehicules);
      return this.getClosestDestination(eventData[0]);
    }

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
    if(eventData.heading == null || eventData.heading == 0){
        closestDestinationIcon ='';
    }
  else if ( eventData.speedKPH == 0 || eventData.speedKPH == null){
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
    if(destinationIcon != ""){
       destinationIcon = "&icon="+destinationIcon; 
    }
    var color = this.getSpeedColor(eventData);
  
    var icon = L.icon({

      iconUrl: 'https://api.geoapify.com/v1/icon/?type=material&color=%'+color+'&size=small'+destinationIcon+'&scaleFactor=2&apiKey=10009fb840984ed0b026de075f9be71d',
      // popupAnchor: [13, 0],
      iconSize: [35, 55],
      // iconAnchor: [15.5, 42]
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
  },
  (error :HttpErrorResponse) => {
    alert(error.message);
  },()=> { 
    if(this.map != null){
      this.eventData = eventData;
      this.map.off();
      this.map.remove();
    }
    this.loadMap("default");
  }


);
}

//enter array of eventData keep only the eventData where speedKPH equals 0
public getEventDataWithNoSpeed(eventData: EventData[]): EventData[] {
  console.log(eventData);
  var eventDataWithNoSpeed = [];
  for (var i = 0; i < eventData.length; i++) {
    if (eventData[i].speedKPH == 0) {

      eventDataWithNoSpeed.push(eventData[i]);
    }

  }

  return eventDataWithNoSpeed;
}

//display all eventData where speedKPH equals 0
public displayEventDataWithNoSpeed(eventData: EventData[]): void {
    this.getVehiculesOfLatestEventData(this.getEventDataWithNoSpeed(eventData));
}


getSpeedOfVehicule(vehicule : Vehicule) : number{
if(vehicule != null){
  const eventDataOfVehicule = this.getLatestEventDataOfVehicule(vehicule , this.latestEventDataofAllVehicules);
  let speed = eventDataOfVehicule[0].speedKPH;
  return speed;
}

}
   


// make image url depending on the speed of vehicule
makeImageUrl(vehicule: Vehicule) : string{
  if(vehicule != null){
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
 
   
  }


AddLayer(mapLayer : string){
  // get buttons 
  var defaultButton = document.getElementById("defaultButton");
  var hybridButton = document.getElementById("hybridButton");
  var terrainButton = document.getElementById("terrainButton");
  var tomtomDefaultButton = document.getElementById("tomtomDefaultButton");
  var tomtomHybridButton = document.getElementById("tomtomHybridButton");

  hybridButton.setAttribute("class", "choice-button");
  terrainButton.setAttribute("class", "choice-button");
  defaultButton.setAttribute("class", "choice-button");




  // remove all layers
 if(this.googleHybrid != null){
  this.map.removeLayer(this.googleHybrid);
 }
 if(this.googleStreets != null){
      this.map.removeLayer(this.googleStreets);
 }
  if(this.googleTerrain != null){
      this.map.removeLayer(this.googleTerrain);
  }
  if(this.tomtomMapSatellite != null){

    this.map.removeLayer(this.tomtomMapSatellite);
  }
  if(this.tomtomMapDefault != null){
    this.map.removeLayer(this.tomtomMapDefault);
  }


  // add selected layer 
  if (mapLayer == "terrain"){

  this.googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
}).addTo(this.map);

  terrainButton.setAttribute("class", "choice-button button-clicked");
  }

  else if (mapLayer == "hybrid"){
    this.googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
  }).addTo(this.map);
  hybridButton.setAttribute("class", "choice-button button-clicked");
  }

  else if (mapLayer == "streets"){
  this.map.addLayer(this.googleStreets);
  defaultButton.setAttribute("class", "choice-button button-clicked");
  }
  else if(mapLayer == "tomtomMapSatellite"){
    this.tomtomMapSatellite = L.tileLayer('https://api.tomtom.com/map/1/tile/sat/main/{z}/{x}/{y}.jpg?key=1cRN2mBUhsKtt6RArfK6HJSUN3M6Gl2P', 
    {attribution:'TOMTOM'}
    ).addTo(this.map);
    tomtomHybridButton.setAttribute("class", "choice-button button-clicked");
    tomtomDefaultButton.setAttribute("class", "choice-button");
  }
  else if(mapLayer == "tomtomMapDefault"){
      this.map.addLayer(this.tomtomMapDefault);
      tomtomDefaultButton.setAttribute("class", "choice-button button-clicked");
      tomtomHybridButton.setAttribute("class", "choice-button");
  }





  
}

hideGoogleMapsDetails(){
  // hide element with id map-details
  var mapDetails = document.getElementById("map-details");
  mapDetails.style.display = "none";

}

displayGoogleMapsDetails(){
  // display element with id map-details
  var mapDetails = document.getElementById("map-details");
  mapDetails.style.display = "block";

}

displayTomtomDetails(){
  var tomtomMapDetails = document.getElementById("tomtom-map-details");
  tomtomMapDetails.style.display = "block";
}

hideTomtomDetails(){
  var tomtomMapDetails = document.getElementById("tomtom-map-details");
  tomtomMapDetails.style.display = "none";
}


changeMapType(mapType: string){
  console.log(mapType);
  var streetMapButton = document.getElementById("streetMapButton");
  var googleMapButton = document.getElementById("googleMapButton");
  var tomtomMapButton = document.getElementById("tomtomMapButton");

  var tomtomDefaultButton = document.getElementById("tomtomDefaultButton");
  var tomtomHybridButton = document.getElementById("tomtomHybridButton");

  var defaultButton = document.getElementById("defaultButton");
  var hybridButton = document.getElementById("hybridButton");
  var terrainButton = document.getElementById("terrainButton");

  hybridButton.setAttribute("class", "choice-button");
  terrainButton.setAttribute("class", "choice-button");
  defaultButton.setAttribute("class", "choice-button");

  streetMapButton.setAttribute("class", "choice-button");
  googleMapButton.setAttribute("class", "choice-button");
  tomtomMapButton.setAttribute("class", "choice-button");

    // remove all layers
 if(this.googleHybrid != null){
  this.map.removeLayer(this.googleHybrid);
 }
  if(this.googleStreets != null){
      this.map.removeLayer(this.googleStreets);
 }
  if(this.googleTerrain != null){
      this.map.removeLayer(this.googleTerrain);
  }
  if(this.openStreetMap != null){
      this.map.removeLayer(this.openStreetMap);
  }
 if(this.tomtomMapDefault != null){
  this.map.removeLayer(this.tomtomMapDefault);
}
 if(this.tomtomMapSatellite != null){
  this.map.removeLayer(this.tomtomMapSatellite);
}

// openStreetMap
if (mapType == "openStreetMap"){
  
  streetMapButton.setAttribute("class", "choice-button button-clicked");

    this.openStreetMap =  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(this.map);
}
// googleMap
else if (mapType == "googleMap"){

  googleMapButton.setAttribute("class", "choice-button button-clicked");
  this.map.addLayer(this.googleStreets);
  defaultButton.setAttribute("class", "choice-button button-clicked");

}
else if(mapType == "tomtomMap"){
  tomtomMapButton.setAttribute("class", "choice-button button-clicked");
  tomtomDefaultButton.setAttribute("class", "choice-button button-clicked");
  tomtomHybridButton.setAttribute("class", "choice-button");
  this.tomtomMapDefault =   L.tileLayer('https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=1cRN2mBUhsKtt6RArfK6HJSUN3M6Gl2P', 
  {attribution:'TOMTOM'}
  ).addTo(this.map);

}
}




private loadMap(mode : string): void {
     let self = this;

     if(mode=="default"){
      this.map = new L.Map('map', {
        center: [this.eventData[0].latitude, this.eventData[0].longitude],
        zoom: 5,
        fullscreenControl: true,
        fullscreenControlOptions: {position: 'topleft'}
    
      });
     }
  else {
    this.map = new L.Map('map', {
      center: [this.eventData[0].latitude, this.eventData[0].longitude],
      zoom: 15,
      fullscreenControl: true,
      fullscreenControlOptions: {position: 'topleft'}
  
    });
  }

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
        // else find the width of the sidebar and add 100 px 
      else {
        width  = String($('div.sidebar-wrapper.ps').width()+100)+'px';
       }

        // open side menu
        if(document.getElementById('side-menu').style.width == '0px' || document.getElementById('side-menu').style.width == ''){
        document.getElementById('side-menu').style.width=width;
    }
        // close side menu and detail menu if open
    else {
          self.closeSideMenu();
        }
 

     
      }

    
    });


    this.custom = new Custom({
        position: 'topright'
       
         
  }).addTo(this.map);
 
  
 // map default layer : google streets
    this.googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3'],
  
    }).addTo(this.map);
   
    // (L as any).tileLayer.bing("KosJhYsNl9rPBCQR0tax~tByUmD7BQ4l9GYu2I3G4AA~AmqA8bQckm7SvE5Ij4moPmTFzAHz-CHYzJQz7x-ezDGBjkuFeGt9IpvfpTGvCbHT", {type: 'AerialWithLabels'}).addTo(this.map);
//     var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/YOUR-API-KEY/997/256/{z}/{x}/{y}.png',
// cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18}).addTo(this.map);


let index = 0;
for (const c of this.eventData) {
  
          const lat = c.latitude;
      
          const lon = c.longitude;

          if(mode == "itenerary"){

            if(index<this.eventData.length-1){
              var pointA = new L.LatLng(this.eventData[index].latitude, this.eventData[index].longitude);
              var pointB = new L.LatLng(this.eventData[index+1].latitude, this.eventData[index+1].longitude);
              var pointList = [pointA, pointB];
              index++;

              var firstpolyline = new L.Polyline(pointList, {
                  color: 'red',
                  weight: 3,
                  opacity: 0.5,
                  smoothFactor: 1
              });
              firstpolyline.addTo(this.map);
          }
        }

          const customOptions = {
            'maxWidth': 200, // set max-width
            'className': 'customPopup' // name custom popup
           }
           const marker = L.marker([lat, lon], { icon: this.getIcon(c) }).addTo(this.map);

// popup of vehicules
if(c.speedKPH<60){
            const template1="<b><b><b>City: </b></b> "+c.city+"<br><b><b>Speed: </b></b>"+'<br><b><b>Speed: <span _ngcontent-mno-c22="" class="text1 text-success subtitle-2">'+c.speedKPH+" km/h</span></b></b>"+"<br><b><b>Fuel Level: </b></b>"+c.fuelLevel+"<br><b><b>Battery Level: </b></b>"+c.batteryLevel;
            marker.bindPopup(template1);
            marker.getPopup().options.closeButton = false;

     
}
else if(c.speedKPH>=60 && c.speedKPH<120){
    const template1="<b><b><b>City: </b></b> "+c.city+"<br><b><b>Speed: </b></b>"+'<br><b><b>Speed: <span _ngcontent-mno-c22="" class="text1 text-warning subtitle-2">'+c.speedKPH+" km/h</span></b></b>"+"<br><b><b>Fuel Level: </b></b>"+c.fuelLevel+"<br><b><b>Battery Level: </b></b>"+c.batteryLevel;

   
        marker.bindPopup(template1);
        marker.getPopup().options.closeButton = false;
    
}
else{
  const template1="<b><b><b>City: </b></b> "+c.city+"<br><b><b>Speed: </b></b>"+'<br><b><b>Speed: <span _ngcontent-mno-c22="" class="text1 text-danger subtitle-2">'+c.speedKPH+" km/h</span></b></b>"+"<br><b><b>Fuel Level: </b></b>"+c.fuelLevel+"<br><b><b>Battery Level: </b></b>"+c.batteryLevel;
    marker.bindPopup(template1);
    marker.getPopup().options.closeButton = false;

}


}
}

// private loadMap2(eventData:EventData[]): void {
//   // let self = this;

//   this.map = new L.Map('map', {
//     center: [this.eventData[0].latitude, this.eventData[0].longitude],
//     zoom: 5,
//     fullscreenControl: true,
//     fullscreenControlOptions: {position: 'topleft'}
//   });

//   // zoom and fullscreen position (top right)
//   this.map.zoomControl.setPosition('topright');
//   L.control.fullscreen({
//     position:'topright'
//   }).addTo(this.map);



//   // side menu position (left)
//   let Custom = Control.extend({
//     onAdd(map: Map) {
//        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control customcss');
//         var button = L.DomUtil.create('a', 'menuButton', container);
//             button.innerHTML = '&#9776;';
//             button.setAttribute('role', 'button');
           
//         L.DomEvent.disableClickPropagation(button);
//         L.DomEvent.on(button, 'click', this.click);

     

//         return container;
//     },
//     onRemove(map: Map) {}
//     ,
//     click() {
//       let width : string ;
//       // mobile or small screen 
//       if($('div.sidebar-wrapper.ps').width() == null){
//         width = "360px";
//       }
//       // else take the width of the sidebar and add 100 px 
//     else {
//       width  = String($('div.sidebar-wrapper.ps').width()+100)+'px';
//      }

//       // open side menu
//       if(document.getElementById('side-menu').style.width == '0px' || document.getElementById('side-menu').style.width == ''){
//         console.log("here");
//       document.getElementById('side-menu').style.width=width;
//   }
//       // close side menu
//   else {
//         document.getElementById('side-menu').style.width='0px';
//         document.getElementById('detail-menu').style.width='0px';
//       }


   
//     }

  
//   });


//   this.custom = new Custom({
//       position: 'topright'
     
       
// }).addTo(this.map);


// // map layers


//   var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
//     maxZoom: 20,
//     subdomains:['mt0','mt1','mt2','mt3']
//   }).addTo(this.map);

//   // for (let i = 0; i < eventData.length-1; i++) {
    
//   //  var pointA = new L.LatLng(eventData[i].latitude, eventData[i].longitude);
//   //  var pointB = new L.LatLng(eventData[i+1].latitude, eventData[i+1].latitude);
//   //  var pointList = [pointA, pointB];
  
//   // //  var firstpolyline = new L.Polyline(pointList, {
//   // //      color: 'red',
//   // //      weight: 3,
//   // //      opacity: 0.5,
//   // //      smoothFactor: 1
//   // //  });
//   // //  firstpolyline.addTo(this.map);

//   //  var control = E.Routing.control({
//   //   waypoints: pointList,
//   //   show: false,
//   //   waypointMode: 'snap',
  
//   // }).addTo(this.map);
    
//   // }


 



//  this.i=0;
// for (const c of eventData) {
//        console.log(c);
       
//         const lat = c.latitude;
    
//         const lon = c.longitude;

//         // var pointA = new L.LatLng(lat, lon);
//         // var pointB = new L.LatLng(lat+0.02, lon+0.025);
//         // var pointList = [pointA,pointB];
 
//         // var control = E.Routing.control({
//         //   waypoints: pointList,
//         //   waypointMode:'snap',
      
//         // }).addTo(this.map);

//         if(this.i<eventData.length-1){
//         var pointA = new L.LatLng(eventData[this.i].latitude, eventData[this.i].longitude);
//         var pointB = new L.LatLng(eventData[this.i+1].latitude, eventData[this.i+1].longitude);
//         var pointList = [pointA, pointB];
//         console.log(pointList);
//        this.i++;
//         var firstpolyline = new L.Polyline(pointList, {
//             color: 'red',
//             weight: 3,
//             opacity: 0.5,
//             smoothFactor: 1
//         });
//         firstpolyline.addTo(this.map);
     
//       //   var control = E.Routing.control({
//       //    waypoints: pointList,
//       //    show: false,
//       //    waypointMode: 'snap',
       
//       //  }).addTo(this.map);
//       }
//         const customOptions = {
//           'maxWidth': 200, // set max-width
//           'className': 'customPopup' // name custom popup
//          }
//          const marker = L.marker([lat, lon], { icon: this.getIcon(c) }).addTo(this.map);

// // popup of vehicules
// if(c.speedKPH<60){
//       const template1="<b><b><b>City: </b></b> "+c.city+"<br><b><b>Speed: </b></b>"+'<br><b><b>Speed: <span _ngcontent-mno-c22="" class="text1 text-success subtitle-2">'+c.speedKPH+" km/h</span></b></b>"+"<br><b><b>Fuel Level: </b></b>"+c.fuelLevel+"<br><b><b>Battery Level: </b></b>"+c.batteryLevel;

//         marker.on('mouseover', function() {
//           marker.bindPopup(template1,{className: 'mouseover-popup'});
//           marker.openPopup();
//         })
        
       
       
        
      
// }else if(c.speedKPH>=60 && c.speedKPH<120){
//   const template1="<b><b><b>City: </b></b> "+c.city+"<br><b><b>Speed: </b></b>"+'<br><b><b>Speed: <span _ngcontent-mno-c22="" class="text1 text-warning subtitle-2">'+c.speedKPH+" km/h</span></b></b>"+"<br><b><b>Fuel Level: </b></b>"+c.fuelLevel+"<br><b><b>Battery Level: </b></b>"+c.batteryLevel;
//   const template="";
//     marker.on('mouseover', function() {
//       marker.bindPopup(template1,{className: 'mouseover-popup'});
//       marker.openPopup();
// })

   
// }else{
// const template1="<b><b><b>City: </b></b> "+c.city+"<br><b><b>Speed: </b></b>"+'<br><b><b>Speed: <span _ngcontent-mno-c22="" class="text1 text-danger subtitle-2">'+c.speedKPH+" km/h</span></b></b>"+"<br><b><b>Fuel Level: </b></b>"+c.fuelLevel+"<br><b><b>Battery Level: </b></b>"+c.batteryLevel;
// const template="";
// marker.on('mouseover', function() {
//   marker.bindPopup(template1,{className: 'mouseover-popup'});
//   marker.openPopup();
// })
// }
// }
// }


}




