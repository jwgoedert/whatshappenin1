import React, { Component } from 'react';
import { CardText } from 'material-ui/Card';
import Auth from '../modules/Auth.js';
import EventList from '../components/subcomponents/eventList.jsx';
import EventForm from '../components/subcomponents/EventForm.jsx';
import EventDetail from '../components/subcomponents/EventDetail.jsx';
import Map from '../components/subcomponents/Map.jsx';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      eventList: [],
      detailsBox: {
        name,
      },
      eventDetails: {
        username: '',
        title: '',
        eventTime: '',
        eventDate: '',
        tags: '',
        businessName: '',
        picLink: '',
        busLink: '',
        description: '',
        eventTimeObj: {},
        eventDateObj: {},
      },
      location: {
        longitude: null,
        latitude: null,
        address: null,
      },
      errors: {},
      successMessage: null,
    };

    this.setDetailsBox = this.setDetailsBox.bind(this);
    this.changeEvent = this.changeEvent.bind(this);
    this.processEventForm = this.processEventForm.bind(this);
    this.handleTime = this.handleTime.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.setCoordinates = this.setCoordinates.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentWillMount() {
    /**
   *
   * @param {events} a list of event objects from query
   * @returns Sets the state eventlist to the array of events
   */
    fetch('/events').then(events => events.json())
    .then((events) => {
      this.setState({ eventList: events });
      this.setState({ detailsBox: events[0] });
    }).catch(err => console.error(err));
  }
  /**
   *
   * @param {event} the event object a user clicks on
   * @return Sets the state detailbox to the clicked event
   */
  setDetailsBox(detailsBox) {
    this.setState({ detailsBox });
  }

  setCoordinates(coordinates) {
    this.setState({ location: coordinates });
  }
  /**
   * Change the eventDetails object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeEvent(event) {
    const field = event.target.name;
    const ev = this.state.eventDetails;
    ev[field] = event.target.value;

    this.setState({
      event: ev,
    });
  }

  /**
   * Handles the TimePicker input from eventForm, converts the date object
   * into a string and transforms the military time into XX:XXpm format.
   *
   * @param {object} event - the JavaScript event object
   * @param {date object} - the time selected through the TimePicker
   */
  handleTime(event, time) {
    let newTime = time.toLocaleString().split(',')[1].trim();
    newTime = `${newTime.slice(0, 4)} ${newTime.slice(newTime.length - 2)}`;

    const ev = this.state.eventDetails;
    ev.eventTimeObj = time;
    ev.eventTime = newTime;
    this.setState({
      eventDetails: ev,
    });
  }

  /**
   * Handles the DatePicker input from eventForm, converts the date object
   * into a string and slices out only the date portion.
   *
   * @param {object} event - the JavaScript event object
   * @param {date object} - the date selected through the DatePicker
   */
  handleDate(event, date) {
    const newDate = date.toString().slice(0, 15);
    const ev = this.state.eventDetails;
    ev.eventDateObj = date;
    ev.eventDate = newDate;
    this.setState({
      eventDetails: ev,
    });
  }

  /**
   * Processes the information submitted through the eventForm and posts to database
   * @param {event} the event object a user clicks on
   * @return Sets the state successMessage to the returned message if successful
   */
  processEventForm(event) {
    event.preventDefault();
    const eveDet = this.state.eventDetails;
    eveDet.location = {
      longitude: this.state.location.longitude,
      latitude: this.state.location.latitude,
      address: this.state.location.address,
    };
    // create a string for an HTTP body message
    const title = encodeURIComponent(eveDet.title);
    const eventTime = eveDet.eventTime;
    const eventDate = eveDet.eventDate;
    const tags = encodeURIComponent(eveDet.tags);
    const businessName = encodeURIComponent(eveDet.businessName);
    const picLink = encodeURIComponent(eveDet.picLink);
    const busLink = encodeURIComponent(eveDet.busLink);
    const description = encodeURIComponent(eveDet.description);
    const eventTimeObj = eveDet.eventTimeObj;
    const eventDateObj = eveDet.eventDateObj;
    const location = encodeURIComponent(`${eveDet.location.address} longitude: ${eveDet.location.longitude} \
  , latitude: ${eveDet.location.latitude}`);
    const formData = `title=${title}&eventTime=${eventTime}&eventDate=${eventDate}\
      &tags=${tags}&businessName=${businessName}&picLink=${picLink}&busLink=${busLink}\
      &description=${description}&location=${location}&eventTimeObj=${eventTimeObj}\
      &eventDateObj=${eventDateObj}`;
    fetch('/api/makeevent', {
      method: 'POST',
      headers: new Headers({
        'Content-type': 'application/x-www-form-urlencoded',
        authorization: `bearer ${(Auth.getToken())}`
      }),
      body: formData,
    }).then(res => res.json())
    .then((res) => {
      if (res.success === false) {
        this.setState({
          errors: res.errors,
          successMessage: null,
        });
      } else {
        this.setState({
          errors: {},
          successMessage: res.message,
        });
        this.handleToggle();
      }
    })
    .catch(err => `Whoops: ${err}`);
  }

  handleToggle() {
    this.setState({ open: !this.state.open });
  }

  render() {
    return (
      <main className="container">
        <div id="userpage">
          <section id="map">
            {this.state.successMessage &&
              <CardText className="success-message">{this.state.successMessage}</CardText>}
            <RaisedButton
              label="makeevent"
              onTouchTap={this.handleToggle}
            />
            <Drawer
              openSecondary
              open={this.state.open}
              width={400}
            >
              <EventForm
                errors={this.state.errors}
                closeDrawer={this.handleToggle}
                eventDetails={this.state.eventDetails}
                eveChange={this.changeEvent}
                processForm={this.processEventForm}
                handleTime={this.handleTime}
                handleDate={this.handleDate}
                location={this.state.location}
              />
            </Drawer>
            <Map coordinates={this.state.location} geoCode={this.setCoordinates} />
            <EventDetail event={this.state.detailsBox} setCoordinates={this.setCoordinates} />
          </section>
          <section id="userprofile" className="col-lg-4" />
          <sidebar className="col-lg-4">
            <EventList
              setCoordinates={this.setCoordinates}
              eventlist={this.state.eventList}
              setDetailsBox={this.setDetailsBox}
            />
          </sidebar>
        </div>
      </main>
    );
  }

}

export default Dashboard;
