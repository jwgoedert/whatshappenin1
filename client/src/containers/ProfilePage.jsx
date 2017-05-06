import React, { Component } from 'react';
import Auth from '../modules/Auth.js';
import Profile from '../components/Profile.jsx';

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secretData: '',
      eventList: [],
      detailsBox: {
        name,
      },
    };
    /**
   *
   * @param {events} a list of event objects from query
   * @returns Sets the state eventlist to the array of events
   */
    fetch('/events').then(events => events.json())
    .then((events) => {
      this.setState({
        eventList: events,
        detailsBox: events[0]
      });
    }).catch(err => console.log(err));
    this.setCoordinates = this.setCoordinates.bind(this);
    this.setDetailsBox = this.setDetailsBox.bind(this);
    this.setEventList = this.setEventList.bind(this);
  }

  /**
   * This method will be executed after initial rendering.
   */
  componentDidMount() {
    /**
   *
   * @param {none} sets security token
   * @returns sets secret message on state for authorization
   * with the given location
   */
    fetch('/api/Profile', {
      method: 'GET',
      headers: new Headers({
        'Content-type': 'application/x-www-form-urlencoded',
        authorization: `bearer ${(Auth.getToken())}`
      })
    }).then(res => res.json())
    .then((data) => {
      this.setState({
        secretData: data.message,
      });
    })
    .catch(err => `Whoops: ${err}`);
  }


  /**
   * Returns the sum of a and b
   * @param {event} the event object a user clicks on
   * @return Sets the state detailbox to the clicked event
   */
  setDetailsBox(detailsBox) {
    this.setState({ detailsBox });
  }

/**
 *
 * @param {events} a list of event objects from query
 * @returns Sets the state eventlist to the array of events
 */
  setEventList(eventList) {
    this.setState({ eventList });
  }
/**
 *
 * @param {location} will be a set of coordinates
 * @returns Sets the state coordinates, for each event list member
 * allowing for the map to be updated
 */
  setCoordinates(location) {
    this.setState({ location });
  }
  render() {
    return (<Profile
      coordinates={this.state.location}
      setCoordinates={this.setCoordinates}
      setDetBox={this.setDetailsBox}
      setEveList={this.setEventList}
      data={this.state}
    />);
  }

}

export default ProfilePage;
