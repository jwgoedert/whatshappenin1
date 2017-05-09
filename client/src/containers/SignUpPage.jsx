import React, { PropTypes } from 'react';
import SignUpForm from '../components/SignUpForm.jsx';
/* global localStorage, XMLHttpRequest */

class SignUpPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      user: {
        username: '',
        email: '',
        name: '',
        password: '',
        image: '',
        location: '',
      },
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const username = encodeURIComponent(this.state.user.username);
    const name = encodeURIComponent(this.state.user.name);
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const image = encodeURIComponent(this.state.user.image);
    const location = encodeURIComponent(this.state.user.location);
    const formData = `username=${username}&name=${name}&email=${email}&password=${password}&image=${image}&location=${location}`;

    fetch('/auth/signup', {
      method: 'POST',
      headers: new Headers({
        'Content-type': 'application/x-www-form-urlencoded',
      }),
      body: formData,
    }).then(res => res.json())
    .then((res) => {
      if (res.success === false) {
        this.setState({
          errors: res.errors,
        });
      } else {
        this.setState({
          errors: {},
        });
        localStorage.setItem('successMessage', res.message);
        this.context.router.replace('/login');
      }
    })
    .catch((err) => {
      throw new Error(err);
    });
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user,
    });
  }

  /**
   * Render the component.
   */
  render() {
    return (
      <SignUpForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        user={this.state.user}
      />
    );
  }

}

SignUpPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default SignUpPage;
