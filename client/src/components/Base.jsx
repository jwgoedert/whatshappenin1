import React from 'react';
import { Link, IndexLink } from 'react-router';
import Auth from '../modules/Auth';


const Base = ({ children }) => (
  <div>
    <div className="top-bar">
      <div className="top-bar-left col-lg-4">
        <IndexLink to="/">What&apos;s Happenin&apos;</IndexLink>
      </div>
      {Auth.isUserAuthenticated() ? (
        <div className="top-bar-right col-s-12 col-lg-8">
          <Link to="/profile">Profile</Link>&nbsp;
          <IndexLink
            activeClassName="active"
            to="/"
          ><strong>Events</strong></IndexLink>&nbsp;
          <Link to="/logout">Log out</Link>
        </div>
      ) : (
        <div className="top-bar-right">
          <Link to="/login">Log in</Link>
          <Link to="/signup">Sign up</Link>
        </div>
      )}

    </div>

    { /* child component will be rendered here */ }
    {children}

  </div>
);

Base.propTypes = {
  children: React.PropTypes.object.isRequired,
};

export default Base;
