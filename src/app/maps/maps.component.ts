import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EventData } from './eventData';
import { EventDataService } from './eventData.service';

declare const google: any;

interface Marker {
lat: number;
lng: number;
label?: string;
draggable?: boolean;
}
@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

  eventData: EventData[] = [];

  constructor(private eventDataService : EventDataService) { }

  ngOnInit() {
      this.getLatestEventData();
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
        () => this.initmap()
      ); 
      return this.eventData;
}

   public initmap() : void{
       
 
    var myLatlng = new google.maps.LatLng(this.eventData[0].latitude,this.eventData[0].longitude);
    console.log(myLatlng);
    var mapOptions = {
        zoom: 13,
        center: myLatlng,
        scrollwheel: false, //we disable de scroll over the map, it is a really annoing when you scroll through page
        styles: [{
            "featureType": "water",
            "stylers": [{
                "saturation": 43
            }, {
                "lightness": -11
            }, {
                "hue": "#0088ff"
            }]
        }, {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [{
                "hue": "#ff0000"
            }, {
                "saturation": -100
            }, {
                "lightness": 99
            }]
        }, {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#808080"
            }, {
                "lightness": 54
            }]
        }, {
            "featureType": "landscape.man_made",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#ece2d9"
            }]
        }, {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#ccdca1"
            }]
        }, {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#767676"
            }]
        }, {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [{
                "color": "#ffffff"
            }]
        }, {
            "featureType": "poi",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "landscape.natural",
            "elementType": "geometry.fill",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#b8cb93"
            }]
        }, {
            "featureType": "poi.park",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "poi.sports_complex",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "poi.medical",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "poi.business",
            "stylers": [{
                "visibility": "simplified"
            }]
        }]

    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    for (let i = 0; i < this.eventData.length; i++) {
        
        var latLng = new google.maps.LatLng(this.eventData[i].latitude,this.eventData[i].longitude);
       
        var marker =new google.maps.Marker({
          position: latLng,
         map: map,
      
        });
    

       
    }
// for(let i=0; i < markers.length ; i++){
//     console.log(markers[i]);
//     markers[i].setMap(map);
// }
   
    // var marker = new google.maps.Marker({
    //     position: myLatlng,
    //     title: "Hello World!"
    // });

    // // To add the marker to the map, call setMap();
    // marker.setMap(map);
  
    }

}
