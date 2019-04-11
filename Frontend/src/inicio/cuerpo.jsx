import React from 'react'
import wifi from '../imagenes/wifi.png'
import rapido from '../imagenes/rapido.png'
import seguro from '../imagenes/seguro.png'
import celular from '../imagenes/celularFondo.png'

const Cuerpo = (props) => (

    <main id="main-wrapper">
        <section className="intro">
            <h1 className="titulo"><strong>Un taxi cuando lo necesites</strong></h1>
            <img id="celularFondo" src={celular} alt=""/>		
        </section>	
        <section className="info P1">
        <div className="izquierda">        
            <img src={rapido} alt=""/>	
        </div>		
        <div className="derecha">
            <h2 className= "tituloInfo">Un servicio contra el reloj</h2>		
            <p>Consigue un taxi cercano. Un servicio que tarda pocos minutos en llegar! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer maximus ullamcorper ligula a dignissim. Maecenas lacinia lectus non tellus mattis efficitur.</p>
        </div>
        </section>		

        <section className="info P2">
            <div className="izquierda">
                <h2 className= "tituloInfo" style={{color:'#eee'}}>Seguridad siempre contigo</h2>		
                <p>Nuestros empleados estan 100% comprobados Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer maximus ullamcorper ligula a dignissim. Maecenas lacinia lectus non tellus mattis efficitur.</p>	
            </div>		
            <div className="derecha">
                <img  src={seguro} alt=""/>
            </div>
        </section>	

        <section className="info">
        <div className="izquierda">
            <img  src={wifi} alt=""/>	
        </div>		
        <div className="derecha">
            <h2 className= "tituloInfo">Solo necesitas conexion a internet</h2>		
            <p>Desde cualquier punto con acceso puedes solicitar tu taxi! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer maximus ullamcorper ligula a dignissim. Maecenas lacinia lectus non tellus mattis efficitur.</p>
        </div>
        </section>	
        <section id="parallax1">
            <div id="para1Text"><h2>Compatible con dispositivos moviles</h2></div><div id="para1Img"></div>						
        </section>
        <section id="parallax2">
            <div id="para2Img"></div><div id="para2Text"><h2>Trabaja con nosotros</h2></div>
        </section>	        	
    </main>
);

export default Cuerpo;