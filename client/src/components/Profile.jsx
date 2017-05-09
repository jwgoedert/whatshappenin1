import React, { PropTypes } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import EventDetail from './subcomponents/EventDetail.jsx';
import Map from './subcomponents/Map.jsx';
import EventList from './subcomponents/eventList.jsx';

const ProfilePage = ({ data, setEveList, setDetBox, setCoordinates, coordinates }) => (
  <Card className="container" style={{ fontSize: '16px', backgroundColor: 'transparent' }}>
    <div>
      <section id="eventpagebody">
        <section id="map" className="col-lg-4">
          <section >
            <Map geoCode={setCoordinates} coordinates={coordinates} />
            <article id="EventDetail">
              <EventDetail setCoordinates={setCoordinates} event={data.detailsBox} />
            </article>
          </section>
        </section>
        <sidebar className="col-lg-4">
          <EventList
            setCoordinates={setCoordinates}
            eventlist={data.eventList}
            setDetailsBox={setDetBox}
          />
        </sidebar>
      </section>
    </div>
  </Card>
);
    // {data && <CardText style={{ fontSize: '16px', color: 'green' }}>{data.secretData}</CardText>}

ProfilePage.propTypes = {
  setEveList: PropTypes.func.isRequired,
  setDetBox: PropTypes.func.isRequired,
  setCoordinates: PropTypes.func.isRequired,
};

export default ProfilePage;
