import React,{Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import MensajeSnack, {handleClick} from './mensaje'
import { TextField } from '@rmwc/textfield';
import { Radio } from '@rmwc/radio';
import { Button } from '@rmwc/button';
import { LinearProgress } from '@rmwc/linear-progress';

import '@material/textfield/dist/mdc.textfield.css';
import '@material/radio/dist/mdc.radio.css';
import '@material/linear-progress/dist/mdc.linear-progress.css';

class Login extends Component{
  constructor(props) {    
    super(props);
    //console.log(props)
    this.state = {
      identificador: "",
      contrasena: "",
      conductor: "true",
      showPassword : true,
      closedProgress: true
    };
    this.handleOnchange = this.handleOnchange.bind(this);
    this.enviarSolicitud = this.enviarSolicitud.bind(this)
  }

  handleOnchange = input => e =>{ 
      this.setState({ [input]: e.target.value});
  }  
  enviarSolicitud(){
    let esConductor = (JSON.parse(this.state.conductor));
    if(this.state.identificador.match("^[0-9]+$")!=null){
      if(this.state.contrasena !== ""){
        const input = {
          identificador: this.state.identificador, 
          contrasena: this.state.contrasena,
          conductor: false
        };
        let url = "http://"+ this.props.url +":4000/login";
        if(esConductor){
          input.conductor = true;
        }
        const opciones = {
          method: 'POST',  
          body: JSON.stringify(input),  
          headers:{
            'Content-Type': 'application/json'
          }
        };
        const request = new Request(url, opciones);
        this.setState({closedProgress: false})
        fetch(request).then(res => res.json())
        .then((response) => {

          this.setState({closedProgress: true})
          console.log('Exito:', JSON.stringify(response))

          if (response.identificador) {
            if(response.contrasena){
              if(esConductor){
                if(response.ocupado){
                  handleClick({message: "El taxi esta siendo usado!!"})
                }else{
                  this.props.iniciarSesion({valor: esConductor, nombre: response.nombre, id:response.id, placa: response.placa});
                }
              }else{
                if(response.ocupado){
                  handleClick({message: "La sesion ya esta iniciada"})
                }else{
                  this.props.iniciarSesion({valor: esConductor, nombre: response.nombre, id:response.id});
                }
              }            
            }else{
              handleClick({message: "Contraseña incorrecta"})
            }
          }else{
            handleClick({message: (esConductor)?
                                  "El Conductor no esta registrado":
                                  "El Pasajero no esta registrado"
                                })
          }
        }
        )
        .catch(error => {
          console.log('Error:', error)
          this.setState({closedProgress: true})
          handleClick({message: "Error de red, intentelo mas tarde"})
          });

      }else{
        handleClick({message: "La contraseña esta vacia"})
      }
    }else{
      handleClick({message: (esConductor)?
                  "El número de CEDULA es invalido":
                  "El número de CELULAR es invalido"
                  })
    }    
  }

  render(){
    if(this.props.autenticado){
      if(this.props.esConductor){
        return(
          <Redirect to='/conductor'/>
        )
      }else{
        return(
          <Redirect to='/pasajero'/>
        )
      }
    
  }else{
  return (
    <div>
      <div id="espacio"/>
      <div className="card card-1">
        <div className="card-heading">          
          <div id="mundo"/>
          <div id="taxi"/>
        </div>
        <div id="formularioLogin">
        <h2>Iniciar Sesión</h2>
          <div id="botones">
            <Radio className="radioBoton"
              value="true"
              onChange={this.handleOnchange('conductor')}
              checked = {this.state.conductor === 'true'}
              >Conductor
            </Radio>
            <Radio className="radioBoton"
              value="false"
              onChange={this.handleOnchange('conductor')}
              checked = {this.state.conductor === 'false'}  
              >Pasajero
            </Radio>
          </div>

        <TextField className="textfield" icon="person"  outlined label={
                (JSON.parse(this.state.conductor))?
                "Cedula":
                "Celular"
              } 
          pattern="^[0-9]+$"
          required="required"
          helpText={{
            validationMsg: true,
            children: 'Solo valores numericos'
          }}
          onChange={this.handleOnchange('identificador')}
          />
          <TextField className="textfield" icon="lock" type="password" 
          required="required"
          outlined label="Contraseña" 
          onChange={this.handleOnchange('contrasena')}
          />        
          <Button
          className="botonFormulario"
          label="Iniciar Sesion"
          raised
          onClick={this.enviarSolicitud}
          /><br/><br/>
          <span className="mensajito">¿Aun sin cuenta? <Link to={
            (this.state.conductor==="true")?
            "/registroC" :
            "/registropasajero"
          } >registrare aqui</Link></span>      
          <MensajeSnack />
          <LinearProgress className="progreso" closed={this.state.closedProgress}/>          
        </div>        
      </div>
    </div>
    );
}
}
}
export default Login;