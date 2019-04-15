import React,{Component} from 'react'
import {Redirect} from 'react-router-dom'
import { TextField } from '@rmwc/textfield';
import { Button } from '@rmwc/button';
import MensajeSnack, {handleClick} from './mensaje'
import '@material/textfield/dist/mdc.textfield.css';
import '@material/form-field/dist/mdc.form-field.css';

class RegistroConductor extends Component{
  constructor(props) {    
    super(props);
    //console.log(props)
    this.state = {
      celular: "",
      nombre: "",
      direccion: "",
      tarjeta: "",
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
    if(this.state.celular.match("^[0-9]+$")!=null){
      if(this.state.contrasena !== ""){
        const input = {
          celular: this.state.celular, 
          nombre: this.state.nombre,
          direccion: this.state.direccion,
          tarjeta: this.state.tarjeta,
          contrasena: this.state.contrasena
        };
        let url = "http://"+ this.props.url + ":4000/registropasajero";
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
          }
        })
        .then((response) => {
          console.log('Success:', JSON.stringify(response))
          if (response.errorBase) {
            handleClick({message: "Algo salio mal, intentalo mas tarde"})            
          }else{
            if(response.existente){         
              //this.props.iniciarSesion();
              handleClick({message: "Este celular ya esta registrado"})
            }else{
              alert("Registro exitoso, ya puede iniciar sesion")
              this.setState({
                registrado:true
              });
            }
          }
        }
        ).catch(error => handleClick({message: "Error de red, intentalo mas tarde"}))

      }else{
        handleClick({message: "La contraseña esta vacia"})
      }
    }else{
      handleClick({message:"El número de CELULAR es invalido"})
    }    
  }
  render(){
    if(this.props.autenticado){
      return(
        <Redirect to='/pasajero'/>
      )
    }else{
      if(this.state.registrado){
        return(
          <Redirect to='/login'/>
        )
      }else{
        return (
          <div>
          <div id="espacio"/>
          <div id="formularioPasajero">
            <div id="textfields">
          <TextField className="textfield" icon="phone"  outlined label="Celular"
            pattern="^[0-9]+$"
            required="required"
            helpText={{
              validationMsg: true,
              children: 'Solo valores numericos'
            }}
            onChange={this.handleOnchange('celular')}
            />
          <TextField className="textfield" icon="person"  outlined label="Nombre"
            pattern="^([a-z\sA-Z])*$"
            required="required"
            helpText={{
              validationMsg: true,
              children:           
                "El nombre no es valido"        
            }}
            onChange={this.handleOnchange('nombre')}
            />
            
            <TextField className="textfield" icon="credit_card"  outlined label="Número de tarjeta"
            pattern="^[0-9]+$"
            required="required"
            helpText={{
              validationMsg: true,
              children: 'Solo valores numericos'
            }}
            onChange={this.handleOnchange('tarjeta')}
            />
          <TextField className="textfield" icon="lock" type="password" 
          required="required"
          outlined label="Contraseña" 
          onChange={this.handleOnchange('contrasena')}
          />
          </div> 
          <Button
          className="botonFormulario"
        label="Registrarme"
        raised
        onClick={this.enviarSolicitud}
      />
      <br/><br/>
      <MensajeSnack/>
          </div>
          </div>
        );
      }
}
}
}
export default RegistroConductor;