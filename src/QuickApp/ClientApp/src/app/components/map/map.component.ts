import { Component , OnInit } from '@angular/core';
import  * as mapboxgl from 'mapbox-gl';
import  * as urf from '@turf/turf';
import { environment } from '../../../environments/environment';
import { AlertPromise } from '../../../../node_modules/@types/selenium-webdriver';
import {GeoJSONSource} from 'mapbox-gl';

@Component({
  selector: 'MOI-Map',
  templateUrl: './map.component.html'
})
export class MapComponent implements OnInit{
  
  public map: mapboxgl.Map;
  public Sim_Point2:any;
  style = 'mapbox://styles/mapbox/satellite-v9';
  lat = 51.53;
  lng = 25.28;
  constructor() {
      
    Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set(environment.mapbox.accessToken);
   
  }

  ngOnInit() {
    
    this.initializeMap()
 this.map.on('contextmenu',this.addMarker);
 //this.map.on('contextmenu',this.addPopUp);
 this.map.on('load', this.addTaxi);
  }
 
  private initializeMap() {
    /// locate the user
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.map.flyTo({
          center: [this.lng, this.lat]
        })
      });
    }

    this.buildMap()

  }

  buildMap() {
    
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 18,
      center: [this.lng, this.lat]
    });
    this.map.addControl(new mapboxgl.NavigationControl()); 
    this.map.on('style.load', () => {
        const waiting = () => {
          if (!this.map.isStyleLoaded()) {
            setTimeout(waiting, 200);
          } else {
            this.AddPoint();
          }
        };
        waiting();
      });
   // this.map.on('click', this.addMarker);
  }

  AddPoint()
  {
    this.Sim_Point2 = {
      "type": "FeatureCollection",
      "features": [{
          "type": "Feature",
          "properties": {},
          "geometry": {
              "type": "Point",
              "coordinates": [51.51530035085821,25.304319728433242]
  
          }
      }]
  };
  this.Sim_Point2.features[0].properties.bearing = urf.bearing(
    urf.point([51.5154090670226,25.304267464969897]),
    urf.point([51.51508845633549,25.30423320325528])
  );
  this.map.addSource('Sim_Point2', {
    "type": "geojson",
    "data": this.Sim_Point2
  });
    this.map.addLayer({
      "id": "Sim_Point2",
      "source": "Sim_Point2",
      "type": "symbol",
      "layout": {
          "icon-image": "bus-15",
          "icon-rotate": ["get", "bearing"],
          "icon-rotation-alignment": "map",
          "icon-allow-overlap": true
      }
  });
}

  onClickMe() {
    var el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = 'url(assets/images/flag.png)';
    el.style.width = '50px';
    el.style.height = '50px';
    new mapboxgl.Marker(el)
    .setLngLat([this.lng, this.lat])
    .addTo(this.map);
  }

  addTaxi(e) {
    var el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = 'url(assets/images/policecar.png)';
    el.style.width = '99px';
    el.style.height = '70px';
    new mapboxgl.Marker(el)
    .setLngLat([51.50533677693306, 25.301188354640573])
    .addTo(e.target);
  }

  addMarker(e) {
    var e1 = document.createElement('div');
    e1.className = 'marker';
    e1.style.backgroundImage = 'url(assets/images/flag.png)';
    e1.style.width = '62px';
    e1.style.height = '100px';

    e1.addEventListener('click', function() {
        var popup = new mapboxgl.Popup({closeOnClick: false})
        .setLngLat(e.lngLat)
        .setHTML(
        `
            <table>
                <tr>
                    <td>Vehicle Number</td>
                    <td>:</td>
                    <td>396783</td>
                </tr>
                <tr>
                    <td>Driver</td>
                    <td>:</td>
                    <td>Fazal</td>
                </tr>
                <tr>
                    <td>Speed</td>
                    <td>:</td>
                    <td>52 km/hr</td>
                </tr>
                <tr>
                    <td>Odometer</td>
                    <td>:</td>
                    <td>124587</td>
                </tr>
            </table>
        `
        )
        .addTo(e.target);
        e.preventDefault();
        return false;
    });

    new mapboxgl.Marker(e1)
     .setLngLat(e.lngLat)
     .addTo(e.target)
  }

  addPopUp(e) {
    var popup = new mapboxgl.Popup({closeOnClick: false})
    .setLngLat(e.lngLat)
    .setHTML(
        `
            <h1>{{ ` + e.lngLat + ` }}</h1>
        
        `
    )
    .addTo(e.target);

  }
    /// Add map controls

    /*Rameez Added Simulation Code*/
    public Sim_origin:any
    public Sim_Destination:any
    public Sim_Point:any 
    public Sim_Counter:any
    public Sim_Cordinates:any
    private  Sim_timer: number;
    public Sim_tuf_Point: any;
    public rndcntr:number=5000;
    public rndm:any;

    public Sim_Route_origin:any
    public Sim_Route_Destination:any
    public Sim_Route_Routes:any
    public Sim_Route_Point:any 
    public Sim_Route_Counter:any
    public Sim_Route_Cordinates:any
    private  Sim_Route_timer: number;
    public Sim_Route_tuf_Point: any;
    public Sim_Route_rndcntr:number=5000;
    public Sim_Route_rndm:any;
    public Sim_Route_lineDistance:any;
    Simulate_By_Route_Device():void {
        this.map.flyTo({
            center:[51.514702218254286, 25.30427200090172],
            zoom:16
          });
    
      this.Sim_Route_origin = [51.514702218254286, 25.30427200090172];
      
      // Washington DC
      this.Sim_Route_Destination = [51.50755469058109, 25.30204953583231];
      
      this.Sim_Route_Routes = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    this.Sim_Route_origin,
                    this.Sim_Route_Destination 
                ]
            }
        }]
    };
     
      
       
      this.Sim_Route_Point = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Point",
                "coordinates": this.Sim_Route_origin
            }
        }]
    };

    this.Sim_Route_Point.features[0].properties.bearing = urf.bearing(
        urf.point(this.Sim_Route_origin),
        urf.point(this.Sim_Route_Destination)
      );
    
    this.Sim_Route_lineDistance = urf.lineDistance(this.Sim_Route_Routes.features[0],{units: 'kilometers'});
    //alert(this.Sim_Route_lineDistance);
    this.Sim_Route_Cordinates = [];

// Number of steps to use in the arc and animation, more steps means
// a smoother arc and animation, but too many steps will result in a
// low frame rate


// Draw an arc between the `origin` & `destination` of the two points
for (var i = 0; i < 500; i += this.Sim_Route_lineDistance / 500) {
    var segment = urf.along(this.Sim_Route_Routes.features[0], i,{units: 'kilometers'});
    this.Sim_Route_Cordinates.push(segment.geometry.coordinates);
}

// Update the route with calculated arc coordinates
this.Sim_Route_Routes.features[0].geometry.coordinates = this.Sim_Route_Cordinates;



// Used to increment the value of the point measurement against the route.
this.Sim_Route_Counter = 0;

      
this.map.addSource('Sim_Route_Routes', {
    "type": "geojson",
    "data": this.Sim_Route_Routes
});

          this.map.addSource('Sim_Route_Point', {
              "type": "geojson",
              "data": this.Sim_Route_Point
          });
      
         
          this.map.addLayer({
            "id": "Sim_Route_Lay",
            "source": "Sim_Route_Point",
            "type": "symbol",
            "layout": {
                "icon-image": "bus-15",
                "icon-rotate": ["get", "bearing"],
                "icon-rotation-alignment": "map",
                "icon-allow-overlap": true
            }
        });
    
      
          
      this.Simulate_Roue_Interval()
      
        }
        
        Simulate_Roue_Interval():void{
            this.Sim_Route_timer = window.setInterval(() => {
              
                if(this.Sim_Route_Counter > 328000)
                {
                    window.clearInterval();
                }
                this.Sim_Route_Point.features[0].geometry.coordinates = this.Sim_Route_Cordinates[this.Sim_Route_Counter];
                if(this.Sim_Route_Counter % 4 ==0)  
                {    
                
                       var el = document.createElement('div');
                       el.className = 'marker';
                       el.style.backgroundImage = 'url(assets/images/routemark.png)';
                       el.style.width = '5px';
                       el.style.height = '5px';
                       new mapboxgl.Marker(el)
                       .setLngLat(this.Sim_Route_Cordinates[this.Sim_Route_Counter])
                       .addTo(this.map);
                   
                }

                this.Sim_Route_Point.features[0].properties.bearing = urf.bearing(
                    urf.point( this.Sim_Route_Cordinates[this.Sim_Route_Counter >= 500 ? this.Sim_Route_Counter - 1 : this.Sim_Route_Counter]),
                    urf.point( this.Sim_Route_Cordinates[this.Sim_Route_Counter >= 500 ? this.Sim_Route_Counter : this.Sim_Route_Counter + 1])
                );
             
                var st:any = this.map.getSource('Sim_Route_Point')
                st.setData( this.Sim_Route_Point);
            
                this.Sim_Route_Counter = this.Sim_Route_Counter + 1;
              }, 100);
        }

    SimulateDevice():void {
        this.map.flyTo({
            center:[51.51503213033115, 25.303961620211695],
            zoom:16
          });
    
      this.Sim_origin = [51.51503213033115, 25.303961620211695];
      
      // Washington DC
      this.Sim_Destination = [51.610, 25.267];
      
      
     
      this.Sim_Cordinates = [];
      
      
          var longt = 51.51503213033115;
          var lat = 25.303961620211695 ;
      
          longt = 51.51535131284302;
          lat= 25.30296742301762;
          this.Sim_Cordinates.push([longt,lat]);
          longt = 51.51588518747084;
          lat= 25.30169587847942;
          this.Sim_Cordinates.push([longt,lat]);
      
          longt = 51.51760897553484;
          lat= 25.29835983722448;
          this.Sim_Cordinates.push([longt,lat]);
      
          
          longt = 51.517914499535465;
          lat= 25.297483304085688;
          this.Sim_Cordinates.push([longt,lat]);
          
          
          longt = 51.518456717488476;
          lat= 25.29697762704282;
          this.Sim_Cordinates.push([longt,lat]);
      
          longt = 51.518445988662165;
          lat= 25.29766147478105;
          this.Sim_Cordinates.push([longt,lat]);
      
      
      
      longt = 51.51767024515567;
          lat= 25.29860584915343;
          this.Sim_Cordinates.push([longt,lat]);
      
      longt = 51.51683876040792;
          lat= 25.300201466443625;
          this.Sim_Cordinates.push([longt,lat]);
      
      
      longt = 51.51571759721444;
          lat= 25.30267743959957;
          this.Sim_Cordinates.push([longt,lat]);
      
      
      longt = 51.51526162180585;
          lat= 25.303856796802393;
          this.Sim_Cordinates.push([longt,lat]);
      
      
      longt = 51.51512214692252;
          lat= 25.30404108611411;
          this.Sim_Cordinates.push([longt,lat]);
      
      
      
      longt = 51.51512214692252;
          lat= 25.30404108611411;
          this.Sim_Cordinates.push([longt,lat]);
        
      // Used to increment the value of the point measurement against the route.
      this.Sim_Counter = 0;
      
      
       
      this.Sim_Point = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Point",
                "coordinates": this.Sim_origin
            }
        }]
    };
    
      
          this.map.addSource('Sim_Point', {
              "type": "geojson",
              "data": this.Sim_Point
          });
      
         
          this.map.addLayer({
              "id": "Sim_Point",
              "source": "Sim_Point",
              "type": "symbol",
              "layout": {
                  "icon-image": "bus-15",
                  "icon-rotate": ["get", "bearing"],
                  "icon-rotation-alignment": "map",
                  "icon-allow-overlap": true
              }
          });

           
      this.Sim_tuf_Point = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Point",
                "coordinates": this.Sim_origin
            }
        }]
    };
    

          this.map.addSource('Sim_tuf_Point', {
            "type": "geojson",
            "data": this.Sim_tuf_Point
        });

       
      
          
      this.SimulateInterval()
      
        }

        SimulateInterval(){

          this.Sim_timer = window.setInterval(() => {
            if ( this.rndcntr === 0)
            {
              this.rndcntr = 5000;
            }
  
            this.rndcntr = this.rndcntr - 1;
  
             this.rndm = Math.random() * this.rndcntr;
  
            if (this.Sim_Counter > 10)
            {
           this.Sim_Counter=0;
            }
            this.Sim_Point.features[0].geometry.coordinates = this.Sim_Cordinates[this.Sim_Counter];
            this.Sim_Point.features[0].properties.bearing = urf.bearing(
                urf.point( this.Sim_Cordinates[this.Sim_Counter >= 500 ? this.Sim_Counter - 1 : this.Sim_Counter]),
                urf.point( this.Sim_Cordinates[this.Sim_Counter >= 500 ? this.Sim_Counter : this.Sim_Counter + 1])
            );
         
            var sourcet:any = this.map.getSource('Sim_Point');
                sourcet.setData(this.Sim_Point);

          //this.map.getSource("Sim_Point")<GeoJSONSource.setData(this.Sim_Point);
if(this.Sim_Counter==0)
{
    this.Sim_tuf_Point.features[0].geometry.coordinates = this.Sim_origin;
}
else
{
    this.Sim_tuf_Point.features[0].geometry.coordinates = this.Sim_Cordinates[this.Sim_Counter-1];
}
        

         this.map.addSource('Sim_tuf_Point'.concat(this.rndm),{
          "type": "geojson",
          "data": this.Sim_tuf_Point
         });

        this.map.addLayer({
            "id": "Sim_Point".concat(this.rndm),
            "source": "Sim_tuf_Point".concat(this.rndm),
            "type": "symbol",
            "layout": {
                "icon-image": "car-11",
                "icon-rotate": this.Sim_Point.features[0].properties.bearing,
                "icon-rotation-alignment": "map",
                "icon-allow-overlap": true
            }
        });

   
        
            this.Sim_Counter = this.Sim_Counter + 1;
          }, 5000);
        }
   /* End of Simulation Code*/
}
