import React, {createRef} from 'react';
import 'leaflet/dist/leaflet.css';
import { Map, TileLayer, Marker, Popup, withLeaflet } from 'react-leaflet'
import L from 'leaflet'
//import AntPath from "react-leaflet-ant-path";
import Buscador from './rutas'
import iconUrl from '../imagenes/punteroMapa.png'
import MensajeSnack, {handleClick} from './mensaje'
import { SimpleDialog } from '@rmwc/dialog';

import '@material/dialog/dist/mdc.dialog.css';


var iconoMapa = L.icon({
    iconUrl,
    iconSize: [26, 39],
    iconAnchor: [13, 39],
    popupAnchor: [0, -40],
});

let funcionImprimir;

class Conductor extends React.Component {
  constructor(props){
    super(props)
    this.state = {
        posicion1:{
            lat: 3.4517923,
            lng: -76.5324943,
        },
        posicion2:{
            lat: 3.4517999,
            lng: -76.5324999,
        },
      zoom: 16,
      origen: false,
      servicio : "",
      nombrePasajero: "",
      distancia: "",
      costo: "",
      simpleDialogIsOpen: false

    }
    this.refMarker = createRef()
    this.refMarker1 = createRef()
    this.refMap = createRef()
  }
    componentWillMount(){
      funcionImprimir = this.printPosition;
      this.consultarServicio()
    }

    componentDidMount(){      
      navigator.geolocation.getCurrentPosition((position) => {
          console.log(position.coords.latitude +" "+ position.coords.longitude);
          this.setState({
              posicion1:{lat: position.coords.latitude, lng: position.coords.longitude},
              posicion2:{lat: position.coords.latitude, lng: position.coords.longitude},

          })
        });
        this.setState({servicio: setInterval(this.consultarServicio, 5000)})
    }


    componentWillUnmount(){
      this.setState({servicio: clearInterval(this.state.servicio)})
    }
      
    // ======= Comienzo actualizar marcadores al buscar ==========
    setPosition1 = (lating) => {
      this.refMarker.current.leafletElement.setLatLng(lating)
      const zoom = this.refMap.current
      //console.log(this.refMarker.current.leafletElement.getLatLng())
      this.setState({
        posicion1: this.refMarker.current.leafletElement.getLatLng(),
        zoom: zoom.leafletElement.getZoom(),
      })        
    }

    setPosition2 = (lating) => {
      this.refMarker1.current.leafletElement.setLatLng(lating)
      const zoom = this.refMap.current
      //console.log(this.refMarker1.current.leafletElement.getLatLng())
      this.setState({
        posicion2: this.refMarker1.current.leafletElement.getLatLng(),
        zoom: zoom.leafletElement.getZoom()
      })      
    }
    // ======= Fin actualizar marcadores al buscar ==========

    // ======= Comienzo al arrastrar los marcadores ==========
    updatePosition1 = () => {
      const marker = this.refMarker.current
      const zoom = this.refMap.current
      if (marker != null) {
        //console.log(marker.leafletElement.getLatLng())
        this.setState({
          posicion1: marker.leafletElement.getLatLng(),
          zoom: zoom.leafletElement.getZoom()
        })
      }
    }

    updatePosition2 = () => {
      const marker = this.refMarker1.current
      const zoom = this.refMap.current
      if (marker != null) {
          //console.log(zoom.leafletElement.getZoom())
        this.setState({
          posicion2: marker.leafletElement.getLatLng(),
          zoom: zoom.leafletElement.getZoom(),
        })
      }
    }
    // ======= Fin al arrastrar los marcadores ==========

    printPosition = () => {
      if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position) => {
          console.log(position.coords.latitude +" "+ position.coords.longitude);
          this.setState({
              posicion1:{lat: position.coords.latitude, lng: position.coords.longitude}
              // posicion2:{lat: position.coords.latitude, lng: position.coords.longitude},
          })
        }, (error) => {
          alert("Tu navegador bloqueo la ubicacion")
        });
      } else{
        alert("Tu sistema no soporta ubicacion")
      }
    }

    consultarServicio = () => {
      const input = {
        cedula: this.props.identificador,
      };
      let url = "http://"+ this.props.url + ":4000/consultarservicio";
        const opciones = {
          method: 'POST',  
          body: JSON.stringify(input),  
          headers:{
            'Content-Type': 'application/json'
          }
        };

        const request = new Request(url, opciones);
        fetch(request).then(function(res) {
          if (res.ok) {
            return res.json();
          } else {
            handleClick({message: "Algo salio mal, intentalo mas tarde"})
            console.log("algo salio mal")
          }
        }).then((response) => {
          console.log('Success:', JSON.stringify(response))
          if (response.errorBase) {
            handleClick({message: "Algo salio mal, intentalo mas tarde"})  
            console.log("Salio algo mal en a base")          
          }else{
            if(response.hayServicio){
              //handleClick({message: "Todo salio bien"})
              console.log("Prestando Servicio")
              this.setState({
                posicion1: {lat: response.destinoX, lng: response.destinoY},
                nombrePasajero: response.nombrePasajero,
                distancia: response.distancia,
                costo: response.costo,
                simpleDialogIsOpen: true
              })
            }else{
              console.log("no hay servicios")
            }        
              
          }
        }
        ).catch(error => {
          console.log("error en l base")
        })   
    }    


    render() {

        const position1 = [this.state.posicion1.lat, this.state.posicion1.lng]
      //const position2 = [this.state.posicion2.lat, this.state.posicion2.lng]
      //console.log((position1[0] + position2[0])/2 +" "+ (position1[1] + position2[1])/2)
      //const positionF = [(position1[0] + position2[0])/2, (position1[1] + position2[1])/2]
      const GeoSearch = withLeaflet(Buscador)
      const antPolygon = [
        position1
      ];
      return (

//center={positionF} zoom={this.state.zoom}
        <Map className="mapa" maxZoom= "19" bounds = {antPolygon}  ref={this.refMap}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            key={'key1'}            
            draggable={true}
            onDragend={this.updatePosition1}
             position={position1}
             ref={this.refMarker}
             icon = {iconoMapa}>
            <Popup>
            {"Esta es tu ubicacion: "}
            <br /> 
            {this.state.posicion1.lat +", " +this.state.posicion1.lng}
            </Popup>
          </Marker>
          <div id="patrulla">
          <GeoSearch key={'buca2'} origen={true} or={this.setPosition1}/>
          </div>
          <SimpleDialog
            title="Informacion del servicio"
            body={
              "Pasajero: "+ this.state.nombrePasajero + "\n"+
              "Ganacia: " + this.state.costo +"\n"+
              "Distancia: " +this.state.distancia
            }
            open={this.state.simpleDialogIsOpen}
            onClose={evt => {
              this.setState({simpleDialogIsOpen: false})
            }}
          /> 
          <MensajeSnack style={{zIndex:'9999'}}/>
        </Map>
      )
    }
  }

export function printPosition(){
  funcionImprimir();
};
  export default Conductor;