import React, {createRef} from 'react';
import 'leaflet/dist/leaflet.css';
import { Map, TileLayer, Marker, Popup, withLeaflet } from 'react-leaflet'
import L from 'leaflet'
import AntPath from "react-leaflet-ant-path";
import Buscador from './rutas'
import iconUrl from '../imagenes/punteroMapa.png'
import MensajeSnack, {handleClick} from './mensaje'

import { Button } from '@rmwc/button';
import { Radio } from '@rmwc/radio';
import { SimpleDialog } from '@rmwc/dialog';

import '@material/button/dist/mdc.button.css';
import '@material/radio/dist/mdc.radio.css';
import '@material/dialog/dist/mdc.dialog.css';

var iconoMapa = L.icon({
    iconUrl,
    iconSize: [26, 39],
    iconAnchor: [13, 39],
    popupAnchor: [0, -40],
});


class Pasajero extends React.Component {
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
      calificacion: "5",
      cedulaTaxista: "",
      noServicio: "",
      nombreTaxista: "",
      marca: "",
      referencia: "",
      placa: "",
      distancia: "",
      costo: "",
      verEstrellas: false,
      botonServicio: false,
      botonFinalizar: true,
      simpleDialogIsOpen: false
    }
    this.refMarker = createRef()
    this.refMarker1 = createRef()
    this.refMap = createRef()
    this.solicitarServicio = this.solicitarServicio.bind(this)
    this.finalizarServicio = this.finalizarServicio.bind(this)
    this.enviarCalificacion = this.enviarCalificacion.bind(this)
  }
    componentDidMount(){
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position.coords.latitude +" "+ position.coords.longitude);
            this.setState({
                posicion1:{lat: position.coords.latitude, lng: position.coords.longitude},
                posicion2:{lat: position.coords.latitude, lng: position.coords.longitude},

            })
          });
    }


    updatePosition1 = () => {
        const marker = this.refMarker.current
        const zoom = this.refMap.current
        if (marker != null) {
          //console.log(marker.leafletElement.getLatLng())
          this.setState({
            posicion1: marker.leafletElement.getLatLng(),
            zoom: zoom.leafletElement.getZoom(),
          })
        }
      }
      
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

    solicitarServicio(){ 
      console.log("origen: "+ this.state.posicion1.lat +" "+this.state.posicion1.lng)
      const input = {
        celular: this.props.identificador, 
        origen: this.state.posicion1.lat +" "+this.state.posicion1.lng,
        destino: this.state.posicion2.lat +" "+this.state.posicion2.lng,
        baul: "1"
      };
      let url = "http://"+ this.props.url + ":4000/solicitarservicio";
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
        })
        .then((response) => {
          console.log('Success:', JSON.stringify(response))
          if (response.errorBase) {
            handleClick({message: "Algo salio mal, intentalo mas tarde"})  
            console.log("Salio algo mal en a base")          
          }else{
            if(response.placa === ""){         
              handleClick({message: "No hay taxistas disponibles"})
            }else{     
              this.setState({
                cedulaTaxista: response.cedulaConductor,
                noServicio: response.numeroServicio,
                nombreTaxista: response.nombreConductor,
                marca: response.marca,
                referencia: response.referencia,
                placa: response.placa,
                distancia: response.distancia,
                costo: response.costo,
                simpleDialogIsOpen: true
              })         
              console.log("Todo exitosos")            
              this.setState({
                botonServicio: true, 
                botonFinalizar: false,                
              })
            }
          }
        }
        ).catch(error => {
          console.log("error en l base")
        })   
    }

    finalizarServicio(){
      this.setState({
        verEstrellas: true,
        botonFinalizar: true
      })
    }

    enviarCalificacion(){
      const input = {
        calificacion: parseInt(this.state.calificacion), 
        cedula: this.state.cedulaTaxista,
        noServicio: this.state.noServicio,
      };
      let url = "http://"+ this.props.url + ":4000/finalizarservicio";
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
        })
        .then((response) => {
          console.log('Success:', JSON.stringify(response))
          if (response.errorBase) {
            handleClick({message: "Algo salio mal, intentalo mas tarde"})  
            console.log("Salio algo mal en a base")          
          }else{
            if(response.exitoso){       
              handleClick({message: "Todo salio bien"})
              this.setState({
                posicion1: this.refMarker1.current.leafletElement.getLatLng(),
                verEstrellas: false,  
                botonServicio: false             
              }) 
            }else{
              handleClick({message: "Algo salio mal, intentalo mas tarde"})
              console.log("Algo salio mal en la finalizaion")
            }
          }
        }
        ).catch(error => {
          console.log("error en l base")
        })   
    }

    
    render() {
      const position1 = [this.state.posicion1.lat, this.state.posicion1.lng]
      const position2 = [this.state.posicion2.lat, this.state.posicion2.lng]
      if(position1 === position2){console.log("es igual")}
      const BotonSolicitar = withLeaflet(()=>(
        <Button variant="outlined" 
        className="solicitarTaxi" 
        disabled={(this.state.botonServicio)?
        true : false
        }
        onClick={this.solicitarServicio}>Solitar servicio</Button> 
        ))
      const BotonFinalizar = withLeaflet(()=>(
        <Button variant="outlined" 
        disabled={this.state.botonFinalizar}
        className="finalizarServicio" 
        onClick={this.finalizarServicio}>Finalizar y Pagar</Button> 
        ))
      const Calificacion = withLeaflet(()=>(
        <div id="estrellas">
          <Radio
          value="5"
          checked={this.state.calificacion === '5'}
          onChange={evt => this.setState({calificacion: evt.target.value})}>
          5
        </Radio>
        <Radio
          value="4"
          checked={this.state.calificacion === '4'}
          onChange={evt => this.setState({calificacion: evt.target.value})}>
          4
        </Radio>
        <Radio
          value="3"
          checked={this.state.calificacion === '3'}
          onChange={evt => this.setState({calificacion: evt.target.value})}>
          3
        </Radio>
        <Radio
          value="2"
          checked={this.state.calificacion === '2'}
          onChange={evt => this.setState({calificacion: evt.target.value})}>
          2
        </Radio>
        <Radio
          value="1"
          checked={this.state.calificacion === '1'}
          onChange={evt => this.setState({calificacion: evt.target.value})}>
          1
        </Radio>      
        </div>
      ))
      const BotonCalificar = withLeaflet(()=>(
        <Button variant="outlined" 
        className="calificarServicio" 
        onClick={this.enviarCalificacion}>Enviar Calificacion</Button> 
        ))
      const GeoSearch = withLeaflet(Buscador)
      const antPolygon = [
        position1,
        position2
      ];
      return (
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
          <Marker
            key={'key2'}
            draggable={true}
            onDragend={this.updatePosition2}
             position={position2}
             ref={this.refMarker1}
             icon = {iconoMapa}>
            <Popup>
            {"Esta es tu ubicacion: "}
            <br /> 
            {this.state.posicion2.lat +", " +this.state.posicion2.lng}
            </Popup>
          </Marker>
          <AntPath positions={antPolygon} options={{
            "delay": 600,
            "weight": 7,
            "color": "#0000FF",
            "pulseColor": "#000000"}} /> 
          <GeoSearch key={'buca2'} origen={true} or={this.setPosition1}/>
          <GeoSearch key={'buca3'} origen={false} or={this.setPosition2}/>
          <BotonSolicitar/>          
          <BotonFinalizar/>
          {
            (this.state.verEstrellas)?
            <div><Calificacion /><BotonCalificar/></div>: ""
          }                  
          <SimpleDialog
            title="Informacion del servicio"
            body={
              "Taxista: "+ this.state.nombreTaxista + "\n"+
              "vehiculo: " + this.state.marca +" "+ this.state.referencia +"\n"+
              "de placa: " +this.state.placa +" esta a "+ this.state.distancia +" metros\n"+
              "Total a pagar: $ " +this.state.costo
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

  export default Pasajero;