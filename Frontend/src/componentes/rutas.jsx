
import { withLeaflet, MapControl } from "react-leaflet";
import L from "leaflet";
import { OpenStreetMapProvider,GeoSearchControl } from "leaflet-geosearch";
import iconUrl from '../imagenes/punteroMapa.png'

import 'leaflet-geosearch/dist/style.css';

class GeoSearch extends MapControl {
  constructor(props, context) {
    super(props);
    
  }

  createLeafletElement(opts) {
    const searchControl = new GeoSearchControl({
      autoCompleteDelay: 100,
      showMarker: false, 
      showPopup: true,
      provider:  new OpenStreetMapProvider(),
      marker: {                                          // optional: L.Marker    - default L.Icon.Default
        icon: new L.Icon({
          iconUrl,
          iconSize: [26, 39],
          iconAnchor: [13, 39],
          popupAnchor: [0, -39],
      }),
        draggable: true,
      },
      popupFormat: ({ query, result }) => {
        (this.props.origen)?
        this.props.or(L.latLng(result.y, result.x))
        :
        this.props.or(L.latLng(result.y, result.x))       
      },
      searchLabel: (this.props.origen)?
      'Busca un origen!':
      'Busca un destino!',  
      position: "topleft",
      keepResult: true,
      autoClose: true,
    });
    return searchControl;
  }

  componentDidMount() {
    const { map } = this.props.leaflet;
    map.addControl(this.leafletElement);
  }
}

export default withLeaflet(GeoSearch);
