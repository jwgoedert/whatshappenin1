import React from 'react';
import { Card, CardTitle } from 'material-ui/Card';


const NotFound = () => (
  <Card className="container" style={{ fontSize: '16px', backgroundColor: 'transparent', border: 'none' }}>
    <CardTitle title="Whoops!" subtitle="The location you requested doesn't exist!" />
    <img
      className="error_image"
      src="http://www.wenoseo.com/images/404-error.png"
      alt="Shrugsville"
    />
  </Card>
);

export default NotFound;
