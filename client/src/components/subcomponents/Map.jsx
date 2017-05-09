import React from 'react';
import { Gmaps, Marker, InfoWindow } from 'react-gmaps';
import { Well, Col } from 'react-bootstrap';

class Map extends React.Component {

  static onMapCreated(map) {
    map.setOptions({
      disableDefaultUI: true,
      panControl: true,
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: true,
      overviewMapControl: true,
      rotateControl: true,
    });
  }

  static onDragEnd(e) {
    console.warn('onDragEnd', e);
  }

  static onCloseClick() {
    console.warn('onCloseClick');
  }

  static onClick(e) {
    console.warn('onClick', e);
  }


  constructor(props) {
    super(props);
    this.state = {
      location: {
        latitude: null,
        longitude: null,
      },
      googleKey: null,
    };
    this.setStateGeoLocate = this.setStateGeoLocate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition((location) => {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}`)
        .then(response => response.json())
        .then((json) => {
          this.setStateGeoLocate(json);
        });
    });
  }
  componentWillReceiveProps(nextprops) {
    if (nextprops.coordinates) {
      const latitude = +nextprops.coordinates.latitude;
      const longitude = +nextprops.coordinates.longitude;
      const address = nextprops.coordinates.address;
      this.setState({
        location: {
          latitude,
          longitude,
          address
        },
      });
    }
  }

  /**
   *
   * @param {json} Json object from Google API call
   *
   * @returns Sets the location of the map
   *     location parameter to the geolocation's coordinates.
   * @param {geocode} sets the location for the form data
   * @param {setState} sets the location for the map to centralize
  */
  setStateGeoLocate(json) {
    this.setState({
      location: {
        latitude: json.results[0].geometry.location.lat,
        longitude: json.results[0].geometry.location.lng,
        address: json.results[0].formatted_address
      },
    });
    this.props.geoCode({
      latitude: json.results[0].geometry.location.lat,
      longitude: json.results[0].geometry.location.lng,
      address: json.results[0].formatted_address,
    });
  }
  /**
   *
   * @param {event} form submission event
   * @param this, state, Takes the search position from state object
   *
   * @returns Sets the location of the map for a query, and sets the event form
   *          location parameter to the geolocation's coordinates.
   */
  handleSubmit(event) {
    event.preventDefault();

    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${this.state.search}`)
      .then(response => response.json())
      .then((json) => {
        this.setStateGeoLocate(json);
      });
  }
  /**
   *
   * @param {event} form submission event
   * @param this, state, Takes the search position from state object
   *
   * @returns Sets the location of the map for a query, and sets the event form
   *          location parameter to the geolocation's coordinates.
   */
  handleChange(event) {
    this.setState({ search: event.target.value });
  }

  render() {
    return (
      <div>
        <Well>
          <div id="search_address">
            <form onSubmit={this.handleSubmit}>
              <input id="address" name="location" onChange={this.handleChange} type="text" />
              <input id="btn" type="submit" value="Search Address" />
            </form>
          </div>
          <Col lg={10}>
            <Well id="map-well">
              <div id="map_div">
                <Gmaps
                  width={window.innerWidth / 4 + "px"}
                  height={window.innerHeight / 2 + "px"}
                  lat={this.state.location.latitude}
                  lng={this.state.location.longitude}
                  zoom={12}
                  loadingMessage={'What\'s Happenin\''}
                  params={{ v: '3.exp', key: 'key' }}
                  onMapCreated={this.onMapCreated}
                >
                  <Marker
                    lat={this.state.location.latitude}
                    lng={this.state.location.longitude}
                    draggable
                    onDragEnd={this.onDragEnd}
                  />
                  <InfoWindow
                    lat={this.state.location.latitude}
                    lng={this.state.location.longitude}
                    onCloseClick={this.onCloseClick}
                    content={this.state.location.address}
                  />
                </Gmaps>
              </div>
            </Well>
          </Col>
        </Well>
      </div>
    );
  }
}


export default Map;
