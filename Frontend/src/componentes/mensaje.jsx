import React from 'react'
import { Snackbar, SnackbarAction } from '@rmwc/snackbar';

import '@material/snackbar/dist/mdc.snackbar.css';

let openSnackbarFn;

class MensajeSnack extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      open: false,
      mensaje: '',
      error: true
    };
    this.handleClick = this.handleClick.bind(this)
  }
  componentDidMount() {
    openSnackbarFn = this.handleClick;
  }

  handleClick = ({message}) => {
    this.setState({ open: true, mensaje: message});
  };
  render() {
    return (
      <Snackbar className = {
        (this.state.error)?
        "mensajeError" : "mensajeExito" 
      }      
      open={this.state.open}
      onClose={evt => this.setState({open: false})}
      icon="menu"
      message={this.state.mensaje}
      action={
        <SnackbarAction
        label="✖"               
          onClick={() => this.setState({open: false})}
        />}
        timeout={4000}
        
    />
    );
  }
}
export function handleClick({message}){
  openSnackbarFn({ message });
};

export default MensajeSnack;
