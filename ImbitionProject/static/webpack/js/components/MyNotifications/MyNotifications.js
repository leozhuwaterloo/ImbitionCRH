import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Notifications from 'react-notification-system-redux';

class MyNotificationsDumb extends React.Component {
  constructor(props) {
    super(props);
    this.style = {
      NotificationItem: {
        DefaultStyle: {
          margin: '10px 5px 2px 1px',
        },
      },
    };
  }

  render() {
    const {notifications} = this.props;

    return (
      <Notifications
        notifications={notifications}
        style={style}
      />
    );
  }
}

MyNotificationsDumb.propTypes = {
  notifications: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    notifications: state.notifications,
  }),
  MyNotifications = connect(mapStateToProps)(MyNotificationsDumb)

export default MyNotifications;
