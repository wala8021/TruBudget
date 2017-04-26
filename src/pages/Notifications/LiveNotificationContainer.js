import React, { Component } from 'react';
import { connect } from 'react-redux';

import LiveNotification from './LiveNotification'
import {showSnackBar, storeSnackBarMessage} from './actions.js'


class LiveNotificationContainer extends Component {

  render() {
    return (
      <LiveNotification {...this.props} />
    )
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    openSnackBar: () => dispatch(showSnackBar(true)),
    closeSnackBar: () => dispatch(showSnackBar(false)),
    storeSnackBarMessage:(message) => dispatch(storeSnackBarMessage(message))
  };
}

const mapStateToProps = (state) => {
  return {
      showSnackBar: state.getIn(['notifications', 'showSnackBar']),
      snackBarMessage: state.getIn(['notifications', 'snackBarMessage']),
      notifications: state.getIn(['notifications', 'list']),
      users: state.getIn(['login', 'users']),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveNotificationContainer);
