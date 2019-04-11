import React from 'react';
import {
  Drawer,
  DrawerHeader,
  DrawerContent,
  DrawerTitle,
  DrawerSubtitle,
} from '@rmwc/drawer';

import {
  List,
  ListItem,
  ListItemText,
  ListItemPrimaryText,
  ListItemSecondaryText
} from '@rmwc/list';


import '@material/drawer/dist/mdc.drawer.css';
import '@material/list/dist/mdc.list.css';


let funcionAbir;
  class MenuModal extends React.Component {
    constructor(props){
      super(props)
      this.state = {
          open: false,
          conductor: false          
          };
      this.handleClick = this.handleClick.bind(this);
  }
  componentWillMount(){    
    
  }

  componentDidMount() {
    funcionAbir = this.handleClick;

  }

  handleClick = () => {
    this.setState({ open: !this.state.open});
  };

 
  render (){
    
  return(
    <div>
    <Drawer
    modal
    open={this.state.open}
    onClose={this.handleClick}
    >
    <DrawerHeader>
      <DrawerTitle>{this.props.nombre}</DrawerTitle>
      <DrawerSubtitle>cc {this.props.id}</DrawerSubtitle>
    </DrawerHeader>
    <div style={{paddingLeft: '15px', color: '#797979'}}>Usuario: 
    {(this.props.esConductor)? " Conductor" : " Pasajero"}
    </div>
    <DrawerContent>
      {(this.props.esConductor)?
    <List twoLine>
    <ListItem onClick={this.props.cobrar}>
    <ListItemText>
      <ListItemPrimaryText>Cobrar acumulado</ListItemPrimaryText>
      <ListItemSecondaryText>$ {this.props.saldo}</ListItemSecondaryText>
    </ListItemText>
    </ListItem>
    <ListItem>
    <ListItemText>
      <ListItemPrimaryText>Kilometros acumulados</ListItemPrimaryText>
      <ListItemSecondaryText>{this.props.kilometros} Km</ListItemSecondaryText>
    </ListItemText>
    </ListItem>    
    </List>
    :
    <List twoLine>
    <ListItem>
    <ListItemText>
      <ListItemPrimaryText>Kilometros acumulados</ListItemPrimaryText>
      <ListItemSecondaryText>{this.props.kilometros} Km</ListItemSecondaryText>
    </ListItemText>
    </ListItem>    
    </List>
    }
  </DrawerContent>
</Drawer>

  </div>
  )};
} 
export function handleClickMenu(){
  funcionAbir();
};

export default MenuModal;