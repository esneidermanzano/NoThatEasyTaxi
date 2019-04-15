import React, { Component } from 'react';
import Cuerpo from './cuerpo'
import Footer from './footer'
import logo from '../imagenes/logo1.png';
import {BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom'
// Redirect, withRouter
import Login from '../componentes/login'
import MenuModal, {handleClickMenu} from './menu'
import FormularioPasajero from '../componentes/registroPasajero'
//import Mapa from '../componentes/mapa'
import Conductor, {printPosition} from '../componentes/conductor'
import Pasajero from '../componentes/pasajero'
import FormularioConductor from '../componentes/registroConductor'
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarActionItem,
  TopAppBarTitle
} from '@rmwc/top-app-bar';
import { Button } from '@rmwc/button';

import '@material/top-app-bar/dist/mdc.top-app-bar.css';
import '@material/button/dist/mdc.button.css';

import '../estilos/index.css'

const CuerpoInicial = () => (
  <div>
    <Cuerpo/>
    <Footer/>
  </div>
);

const URL = "localhost";

class PaginaInicio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      autenticado: false,
      conductor: false,
      nombreUsuario: "",
      identificador: "",
      placa: "",
      kilometros: "Sin informacion",
      saldo: "Sin informacion"
    };
    this.cerrarMenuModal = this.cerrarMenuModal.bind(this);
    this.iniciarSesion = this.iniciarSesion.bind(this);
    this.cerrarSesion = this.cerrarSesion.bind(this)
    this.sesionIniciada = this.sesionIniciada.bind(this)
    this.cobrar = this.cobrar.bind(this)
  }

  cerrarMenuModal(){
    this.setState({
      modalOpen: false
    })
  }

  iniciarSesion(valor){
    //Es conductor??
    if(valor.valor){
      this.setState({ 
        autenticado: true, 
        conductor: true,
        nombreUsuario: valor.nombre,
        identificador: valor.id,
        placa: valor.placa
      })
    }else{
      this.setState({ 
        autenticado: true, 
        conductor: false,
        nombreUsuario: valor.nombre,
        identificador: valor.id
      })
    }

    let input = {
      identificador: this.state.identificador, 
      conductor: valor.valor
      };
    let url = "http://"+ URL +":4000/obtenerdatos";
    const opciones = {
      method: 'POST',  
      body: JSON.stringify(input),  
      headers:{
        'Content-Type': 'application/json'
      }
    };
    const request = new Request(url, opciones);
    fetch(request).then(res => res.json())
    .then((response) => {
      console.log('Exito:', JSON.stringify(response))
      if(response.errorBase){
        console.log("Error de red, intentelo mas tarde")
      }else{
        console.log("Es codnutor? " + JSON.parse(valor.valor))
        //Es conductor?
        if(valor.valor){
          this.setState({
            kilometros: response.kilometros,
            saldo: response.saldo
          })
        }else{
          this.setState({
            kilometros: response.kilometros,
            //saldo: response.saldo
          })
        }        
      }
    }).catch(err=>{
      console.log("Error de red, intentelo mas tarde")
    })

    if(valor.valor){
      console.log("inicio sesion el conductor")
    }else{
      console.log("inicio sesion el pasajero")
    }
    
  }

  cerrarSesion(){
    let input = {}, url = "";
    if(this.state.conductor){
      input = {placa: this.state.placa};
      url = "http://"+ URL +":4000/usotaxi";
    }else{
      input = {celular: this.state.identificador};
      url = "http://"+ URL +":4000/conectado";
    }
    const opciones = {
      method: 'POST',  
      body: JSON.stringify(input),  
      headers:{'Content-Type': 'application/json'}
    };
    const request = new Request(url, opciones);
    fetch(request).then(res => res.json())
    .then((response) => {
      console.log('Exito:', JSON.stringify(response))
      if (response.errorBase) {
        console.log("Error de red, intentelo mas tarde")
      }else{
        console.log("cerro sesion")
        if(this.state.conductor){
          this.setState({
            autenticado: false, 
            nombreUsuario: "",
            identificador: "",
            placa: ""
          })
        }else{
          this.setState({
            autenticado: false, 
            nombreUsuario: "",
            identificador: "",
          })
        }
      }
    }).catch(error => {
      console.log('Error de red:', error)
    });
  

  }

  sesionIniciada(){
    if (this.state.autenticado){
      return(
        <ul className="prueba">
          {(this.state.conductor)?
            ""
            :
            <li><Link to="/pasajero"><Button variant="outlined" className="button">Pasajero</Button></Link></li>
          }
          <li><Button  outlined className="button" onClick={this.cerrarSesion}>Cerrar sesión</Button></li>                                          
        </ul>
      )
    }else{
      return(
        <ul className="prueba">
          <li><Link to="/registropasajero"><Button ripple className="button" >Registro Pasajero</Button></Link></li>
          <li><Link to="/registroC"><Button ripple className="button">Registro Conductor</Button></Link></li>
          <li><Link to="/login" ><Button  outlined className="button" onClick={()=>document.getElementById("menu-btn").checked = false}>Iniciar sesión</Button></Link>               </li>
        </ul>
      )
    }
  }

  cobrar(){
    let input = {identificador: this.state.identificador};
    let url = "http://"+ URL +":4000/cobrar";
    const opciones = {
      method: 'POST',  
      body: JSON.stringify(input),  
      headers:{'Content-Type': 'application/json'}
    };
    const request = new Request(url, opciones);
    fetch(request).then(res => res.json())
    .then((response) => {
      console.log('Exito:', JSON.stringify(response))
      if(response.errorBase){
        console.log("Error de red, intentelo mas tarde")
      }else{
        console.log("Cobrado con exito")
        this.setState({
          saldo: "0"
        })        
      }
    }).catch(err=>{
      console.log("Error de red, intentelo mas tarde")
    })
  }

  render(){
    //console.log(window.location.href)

    return(
      <div>
        <Router>
          <TopAppBar className="menu" fixed>
            <TopAppBarRow>
              <TopAppBarSection alignStart>
              {
                (this.state.autenticado)?
                <TopAppBarActionItem aria-label="menu" alt="menu" className="botonMenu" icon="person" onClick={handleClickMenu}/>
                : ""
              }
                <TopAppBarTitle ><Link to="/"><img id="logo" src={logo} alt=""/></Link></TopAppBarTitle>
              </TopAppBarSection>
              <TopAppBarSection alignEnd >  
              {
                (this.state.autenticado)?
                  (this.state.conductor)?
                  <Link to="/conductor"><TopAppBarActionItem alt="ubicacion" icon="place" onClick={printPosition}/></Link>
                  : ""
                : ""
              }              
              <input className="menu-btn" type="checkbox" id="menu-btn" />
              <label className="menu-icon" htmlFor="menu-btn"><span className="navicon"></span></label>

              {this.sesionIniciada()} 
              </TopAppBarSection>
            </TopAppBarRow>
          </TopAppBar>  
          <MenuModal 
            cobrar={this.cobrar}
            url={URL}
            className="menuModal"
            kilometros={this.state.kilometros}
            saldo = {this.state.saldo}
            esConductor={this.state.conductor} 
            nombre={this.state.nombreUsuario}
            id={this.state.identificador}
            />
          <Route exact path="/" component={CuerpoInicial}></Route>
          <Route exact path="/registroC" render={() => 
            <FormularioConductor  
              url={URL}
              autenticado={this.state.autenticado} 
            />}>
          </Route> 
            
          <Route exact path="/registropasajero" render={() => 
            <FormularioPasajero  
              url={URL}
              autenticado={this.state.autenticado} 
            />}>
          </Route>     
          <Route exact path="/login" render={() => 
            <Login  
              url={URL}
              autenticado={this.state.autenticado} 
              esConductor={this.state.conductor}
              iniciarSesion={this.iniciarSesion}
            />}>
          </Route>
          <Route exact path="/pasajero" render={() => 
          {
            if(this.state.autenticado){
              return(
                <Pasajero  
                  url={URL}
                  nombre={this.state.nombreUsuario}
                  identificador={this.state.identificador}
                  autenticado={this.state.autenticado} 
                />)
            }else{
              return(
                <Redirect to='/'/>
              )
            }
          }
          }>
          </Route>
          <Route exact path="/conductor" render={() => 
          {
            if(this.state.autenticado){
              return(
                <Conductor  
                  url={URL}
                  autenticado={this.state.autenticado} 
                  identificador={this.state.identificador}
                />)
            }else{
              return(
                <Redirect to='/'/>
              )
            }
          }
          }>
          </Route>                          
        </Router>   
      </div>
    )    
  }
}
export default PaginaInicio;
