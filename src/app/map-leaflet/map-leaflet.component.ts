import { AfterViewInit, Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import * as L from 'leaflet';
import { Observable, Subscriber } from 'rxjs';
import "@bepo65/leaflet.fullscreen";
import { EventData } from 'app/maps/eventData';
import { EventDataService } from 'app/maps/eventData.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-map-leaflet',
  templateUrl: './map-leaflet.component.html',
  styleUrls: ['./map-leaflet.component.css']
})
export class MapLeafletComponent  implements AfterViewInit {

  private map : any;
  private googleStreets : any;
  eventData: EventData[];
  destinations : string[]  = ["north","north_east","north_west","west","south_west","east","south_east","south","north"];
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
    console.log(speed);

    var speedColor = "";
    if (speed == 0 || speed == null) 
      speedColor = "23244c76";  
    else if (speed > 0 && speed <= 60)
      speedColor = "2310780f";  
    else if (speed > 60 && speed <= 80)
      speedColor = "23d6ff00";
    else if (speed > 80 && speed <= 105)
      speedColor = "23ff9100";
    else if (speed > 105 && speed <= 120)
      speedColor = "23ec5936";
    else if (speed > 120)
      speedColor = "23ff0000";
    return speedColor;
    console.log(speedColor);
  }

  // find closest degree and assign destination 
  public getClosestDestination(eventData : EventData):string {
    var closestDestination = "";
   if (eventData.heading == null || eventData.heading == 0 ||eventData.speedKPH == 0 || eventData.speedKPH == null){
     closestDestination ="not moving"
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

  // find closest degree and assign corresponding icon
  public getClosestDestinationIcon(eventData : EventData):string {
    var closestDestinationIcon = "";
   if (eventData.heading == null || eventData.heading == 0 ||eventData.speedKPH == 0 || eventData.speedKPH == null){
     closestDestinationIcon ="local_shipping"
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
  public getIcon(eventData : EventData):L.Icon{
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

  public getLatestEventData(): EventData[] {
    this.eventDataService.getLatestEventData().subscribe(
        (response : EventData[]) => {
          this.eventData = response;
           console.log(this.eventData);
        },
        (error :HttpErrorResponse) => {
          alert(error.message);
        }, 
        () => this.loadMap()
      ); 
      return this.eventData;
}


  
  private loadMap(): void {
    this.map = new L.Map('map', {
      center: [this.eventData[0].latitude, this.eventData[0].longitude],
      zoom: 5,
      fullscreenControl: true,
      fullscreenControlOptions: {position: 'topleft'}
    })

    
    
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


  
    

   




for (const c of this.eventData) {
         console.log(c);
          const lat = c.latitude;
      
          const lon = c.longitude;

          const customOptions = {
            'maxWidth': 200, // set max-width
            'className': 'customPopup' // name custom popup
           }
           const marker = L.marker([lat, lon], { icon: this.getIcon(c) }).addTo(this.map);
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
 
    //   this.map.flyTo([this.eventData[0].latitude, this.eventData[1].longitude], 13);

  
  }
 
  
}


