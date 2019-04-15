import React,{Component} from 'react'
import {Redirect, withRouter} from 'react-router-dom'
// Redirect, withRouter
import { TextField } from '@rmwc/textfield';
import { Button } from '@rmwc/button';
import { Grid, GridCell} from '@rmwc/grid';
import { Radio } from '@rmwc/radio';
import { Switch } from '@rmwc/switch';

import MensajeSnack, {handleClick} from './mensaje'

import '@material/textfield/dist/mdc.textfield.css';
import '@material/radio/dist/mdc.radio.css';
import '@material/form-field/dist/mdc.form-field.css';
import '@material/layout-grid/dist/mdc.layout-grid.css';
import '@material/switch/dist/mdc.switch.css';

class RegistroConductor extends Component{
  constructor(props) {    
    super(props);
    this.state = {      
      nombre: "",
      cedula: "",
      existente: false,
      marca: "",
      referencia: "",
      modelo: "",
      placa: "",
      baul: "true",
      soat: "",
      contrasena: "",
      registrado: false

    };
    this.handleOnchange = this.handleOnchange.bind(this);
    this.enviarSolicitud = this.enviarSolicitud.bind(this)
  }

  handleOnchange = input => e =>{ 
      this.setState({ [input]: e.target.value});
  }  

  enviarSolicitud(){
    let valido = 0, mensaje ="",
        contrasena = this.state.contrasena,
        soat = this.state.soat,
        marca = this.state.marca,
        modelo = this.state.modelo,
        referencia = this.state.referencia,
        placa = this.state.placa,
        cedula = this.state.cedula,
        nombre = this.state.nombre;

    if(!this.state.existente){
      if(soat.match("^[0-9]+$") == null) {valido = 7}
      if(!/^[a-z0-9]+$/.test(marca.replace(/\s/g, "").toLowerCase())) {valido = 6}
      if(!/^\d{4}$/.test(modelo)){ valido = 5} 
      if(!/^[a-z0-9]+$/.test(referencia.replace(/\s/g, "").toLowerCase())) {valido = 4}
      if(!/^[a-z0-9]+$/.test(placa.replace(/\s/g, "").toLowerCase())) {valido = 3}         
    }
    if(contrasena === ""){ valido = 8}
    if(!/^[a-z0-9]+$/.test(placa.replace(/\s/g, "").toLowerCase())) {valido = 3}
    if(cedula.match("^[0-9]+$")==null){ valido = 2} 
    if(!/^[a-z]+$/.test(nombre.replace(/\s/g, "").toLowerCase())){valido = 1} 

    
    if(valido !== 0){
      switch(valido){
        case 1: mensaje = "El nombre no el valido"; break;
        case 2: mensaje = "La cedula no es valida";  break;
        case 3: mensaje = "La placa no es valida"; break;
        case 4: mensaje = "La referencia no es valida"; break;
        case 5: mensaje = "El modelo no es valido"; break;
        case 6: mensaje = "La marca no es valida"; break;
        case 7: mensaje = "El soat no es valido"; break;
        case 8: mensaje = "La contraseña esta vacia"; break;
      }
      handleClick({message: mensaje})
    }
    else{
      let input;
      if(this.state.existente){
        input = {
          contrasena: this.state.contrasena,
          placa: this.state.placa.toLowerCase(),
          cedula: this.state.cedula,
          nombre: this.state.nombre,
          existente: true
        };
      }else{
        input = {  
          contrasena: this.state.contrasena, 
          baul: JSON.parse(this.state.baul),       
          placa: this.state.placa.toLowerCase(),
          marca: this.state.marca,
          referencia: this.state.referencia,
          modelo: this.state.modelo, 
          soat: this.state.soat,                   
          cedula: this.state.cedula,
          nombre: this.state.nombre,
        };
      }
      const opciones = {
        method: 'POST',  
        body: JSON.stringify(input),  
        headers:{
          'Content-Type': 'application/json'
        }
      };
      const request = new Request("http://"+ this.props.url + ":4000/registroconductor", opciones);
      fetch(request).then(function(res) {
        if (res.ok) {
          return res.json();
        } else {
          handleClick({message: "Algo salio mal, intentalo mas tarde"})
        }
      })
      .then((response) => {
        console.log('Success:', JSON.stringify(response))
        if (response.errorBase) {
          handleClick({message: "Algo salio mal, intentalo mas tarde"})            
        }else{
          if(response.exitoso){
            alert("Registro exitoso, ya puede iniciar sesion")
            this.setState({
              registrado:true
            });
          }else{
            if(response.conductorExiste){
              handleClick({message: "Esta cedula ya esta registrada"})
            }else{
              if(response.taxiExiste && !this.state.existente){
                handleClick({message: "Este taxi ya esta registrada"})
              }else if(!response.taxiExiste && this.state.existente){
                handleClick({message: "Este taxi NO esta registrado"})
              }
            }
          }
        }
      }
      ).catch(error => handleClick({message: "Error de red, intentalo mas tarde"}))
    
    }
  }

  
  render(){
    if(this.props.autenticado){
      return(
        <Redirect to='/conductor'/>
      )
    }else{
      if(this.state.registrado){
        return(
          <Redirect to='/login'/>
        )
      }else{
        return (
          <div id="fondoFormularioConductor">
          <div id="espacio"/>
            <div className="card card-2">
              <div className="card-heading"/>
              <div id="formularioConductor">
                <h2>Conduce con nosotros</h2>
                <h3>Datos Personales</h3><br/><br/>
                <Grid>
                  <GridCell span={6}>     
                    <TextField className="textfield" icon="person"  outlined label="Nombre"
                      pattern="^([a-z\sA-Z])*$"
                      required="required"
                      helpText={{
                        validationMsg: true,
                        children: "El nombre no es valido"        
                      }}
                      onChange={this.handleOnchange('nombre')}
                    />
                    </GridCell> 
                    <GridCell span={6}>
                      <TextField className="textfield" icon="closed_caption"  outlined label="Cedula"
                        pattern="^[0-9]+$"
                        required="required"
                        helpText={{
                          validationMsg: true,
                          children: 'Solo valores numericos'
                        }}
                        onChange={this.handleOnchange('cedula')}
                      />
                    </GridCell> 
                  </Grid>
                  <h3>Datos del vehículo</h3><br/><br/><br/><br/>
                  <Switch
                    checked={this.state.existente}
                    onChange={evt => this.setState({existente: !this.state.existente})}
                    label="&nbsp;&nbsp;TAXI YA REGISTRADO"/>
                    <br/><br/>
                  <Grid>            
                  <GridCell span={6}>
                    <TextField className="textfield" icon="money"  outlined 
                      label="Placa"
                      pattern="^([a-zA-Z0-9])*$"
                      required="required"
                      helpText={{
                        validationMsg: true,
                        children: "La Placa no es valida"        
                      }}
                      onChange={this.handleOnchange('placa')}
                    />             
                  </GridCell> 
                    <GridCell span={6}>
                      <TextField className="textfield" icon="drag_indicator"  outlined 
                        disabled ={this.state.existente}
                        label="Referencia"
                        pattern="^([a-zA-Z0-9])*$"
                        required="required"
                        helpText={{
                          validationMsg: true,
                          children: "La Referencia no es valida"        
                        }}
                        onChange={this.handleOnchange('referencia')}
                      />
                    </GridCell> 
            
                  <GridCell span={6}>
                  <TextField className="textfield" icon="group_work"  outlined 
                    disabled ={this.state.existente}
                    label="Modelo"
                    pattern="^\d{4}$"
                    required="required"
                    helpText={{
                      validationMsg: true,
                      children: "El Modelo no es valido"        
                    }}
                    onChange={this.handleOnchange('modelo')}
                  />
                  </GridCell> 
                    <GridCell span={6}>
                    <TextField className="textfield" icon="local_taxi"  outlined 
                      disabled ={this.state.existente}
                      label="Marca"
                      pattern="^([a-z\sA-Z])*$"
                      required="required"
                      helpText={{
                        validationMsg: true,
                        children: "La Marca no es valida"        
                      }}
                      onChange={this.handleOnchange('marca')}
                    />
                  </GridCell> 
    
                  <GridCell span={6}>
                  <span style={{color:'#797979'}}>¿El taxi tiene Baul?</span>
                  <div id="botones">
                    <Radio className="radioBoton"
                      disabled ={this.state.existente}
                      value="true"
                      onChange={this.handleOnchange('baul')}
                      checked = {this.state.baul === 'true'}
                      >Si
                    </Radio>
                    <Radio className="radioBoton"
                      disabled ={this.state.existente}
                      value="false"
                      onChange={this.handleOnchange('baul')}
                      checked = {this.state.baul === 'false'}  
                      >No</Radio>
                  </div>
                  </GridCell> 
                    <GridCell span={6}>
                      <TextField className="textfield" icon="security"  outlined 
                      disabled ={this.state.existente}
                      label="SOAT"
                      pattern="^[0-9]+$"
                      required="required"
                      helpText={{
                        validationMsg: true,
                        children: 'Solo valores numericos'
                      }}
                      onChange={this.handleOnchange('soat')}
                      />
                    </GridCell> 
                  </Grid>
                    <TextField className="textfield" icon="lock" type="password" 
                    required="required"
                    outlined label="Contraseña" 
                    onChange={this.handleOnchange('contrasena')}
                    />
                      <Button
              className="botonFormulario"
            label="Registrarme"
            raised
            onClick={this.enviarSolicitud}
          />
          <MensajeSnack/>
              </div>
            </div>
          </div>
          );
      }  
    }
}

/** <TextField className="textfield" icon="home"  outlined label="Dirección"
      required="required"
      helpText={{
        validationMsg: true,
        children: 'Dirección vacia'
      }}
      onChange={this.handleOnchange('direccion')}
      /> */
}
export default RegistroConductor;