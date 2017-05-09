import React from 'react';
import { Well } from 'react-bootstrap';

/**
*
* @param {coordinate string} will be a set of coordinates
* @returns parsed string, allows the map to be updated with new
* coordinates when the event location is clicked;
*/
const parseCoordinates = function parseCoordinates(coordString) {
  let coordinates = coordString.split('longitude');
  const coordinateObj = {
    address: coordinates[0]
  };
  coordinates = coordinates[1].split(' ');
  coordinateObj.latitude = +coordinates[coordinates.length - 1];
  coordinateObj.longitude = +coordinates[1];
  return coordinateObj;
};


const EventDetail = ({ event: { name,
  eventTime,
  eventDate,
  picLink,
  title,
  location,
  description,
  tags,
  businessName,
  busLink,
  eventTimeObj,
  eventDateObj,
  },
  setCoordinates }) => {
  /* setMap passed down from event page, from the map page
   * @param {event location} an event item's location
   * @returns sets the coordinates on profile/dashboard, and changes map coordinates
   */
  function setMap() {
    const coordinates = parseCoordinates(location);
    setCoordinates(coordinates);
  }

  /**
   * Constructs a url link to the google calender 'add event' page for the clicked event
   * and opens the link in a new tab in the browser
   *
   */
  function linkToCalender() {
    const dateTime = `${eventDateObj.slice(0, 10)}T${eventTimeObj.slice(11)}`
      .replace(/-|:|\.\d\d\d/g, '');
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title.replace(' ', '+')}&dates=${dateTime}/${dateTime}&details=${description.replace(' ', '+')}&location=${location.split('longitude')[0].replace(' ', '+').replace(',', '')}&sf=true&output=xml`;

    window.open(url);
  }

  return (
    <div>

      <div className="event-detail">
        <article className="eventdetail">
          <img alt="" id="image" className="col-sm-2" />
          <section className="eventdescription">
            <div className="col-md-12">
              <img className="image" alt="" src={picLink} />
              <br />
              <Well>
                <a>{title}</a>
                <div>Event Time: {eventTime}</div>
                <div>Event Date: {eventDate}</div>

                <button type="button" onClick={setMap}>Show Location on Map</button>

                {businessName !== '' && <div>Business: {businessName}</div>}
                {busLink !== '' && <a target="_blank" rel="noreferrer noopener" href={busLink}>Website</a>}
                <br />

                <p>{description}</p>
                <div>{tags}</div>
                <button type="button" onClick={linkToCalender} >Add to Your Calender</button>
              </Well>
            </div>

          </section>
        </article>
      </div>

    </div>
  );
};

// EventDetail.propTypes = {
//   event: React.Proptypes.object.isRequired,
// };

export default EventDetail;
