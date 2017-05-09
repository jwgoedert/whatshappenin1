import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import TimePicker from 'material-ui/TimePicker';
import DatePicker from 'material-ui/DatePicker';

const style = {
  marginLeft: 20,
};

const EventForm = ({
  eventDetails,
  eveChange,
  processForm,
  handleTime,
  handleDate,
  location,
  errors,
  }) =>
    <form action="/" onSubmit={processForm}>
      <div>
        <TextField
          name="title"
          type="title"
          hintText="What's the party called?"
          style={style}
          value={eventDetails.title}
          onChange={eveChange}
          errorText={errors.title}
        />
      </div>
      <div>
        <TextField
          multiLine
          id="locationslot"
          name="location"
          type="location"
          hintText="Where Is Your Event Located?"
          style={style}
          onChange={eveChange}
          errorText={errors.location}
        />
      </div>
      <div>
        <TimePicker
          name="eventTime"
          type="eventTime"
          hintText="What Time Is Your Event?"
          style={style}
          onChange={handleTime}
          value={eventDetails.eventTimeObj}
          errorText={errors.eventTime}
        />
      </div>
      <div>
        <DatePicker
          type="eventDate"
          hintText="Enter Your Date"
          name="eventDate"
          style={style}
          onChange={handleDate}
          value={eventDetails.eventDateObj}
          errorText={errors.eventDate}
        />
      </div>
      <div>
        <TextField
          name="picLink"
          type="picLink"
          hintText="Got an image link to share?"
          style={style}
          value={eventDetails.picLink}
          onChange={eveChange}
          errorText={errors.picLink}
        />
      </div>
      <div>
        <TextField
          name="businessName"
          type="businessName"
          hintText="Are you a business? What's your name?"
          style={style}
          value={eventDetails.businessName}
          onChange={eveChange}
        />
      </div>
      <div>
        <TextField
          name="busLink"
          type="busLink"
          hintText="Promote your business' website here!"
          style={style}
          value={eventDetails.busLink}
          onChange={eveChange}
          errorText={errors.busLink}
        />
      </div>
      <div>
        <TextField
          multiLine
          name="tags"
          type="tags"
          hintText="#HASHTAG"
          style={style}
          value={eventDetails.tags}
          onChange={eveChange}
        />
      </div>
      <div>
        <TextField
          multiLine
          name="description"
          type="description"
          hintText="What's Your Event About?"
          style={style}
          value={eventDetails.description}
          onChange={eveChange}
        />
      </div>
      <div>
        <RaisedButton type="submit" label="Post Event" />
      </div>
    </form>;

EventForm.propTypes = {
  // eventDetails: PropTypes.obj.isRequired,
  eveChange: PropTypes.func.isRequired,
  processForm: PropTypes.func.isRequired,
  handleTime: PropTypes.func.isRequired,
  handleDate: PropTypes.func.isRequired,
  // closeDrawer: PropTypes.func.isRequired,
  // location: PropTypes.obj.isRequired,
  // errors: PropTypes.obj.isRequired,
};

export default EventForm;
          // i go on line 41!!!!!!
          // value={`${location.address}`}
