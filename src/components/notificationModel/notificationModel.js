import React, { Component } from 'react';
import './notificationModel.scss';

 class NotificationModel extends Component {
    render() {
        return (
           <div>
               <p className={this.props.class ? 'metamask-error' : 'metamask-error fadeOut'}>{this.props.msg}</p>
           </div>
        );
    }
}
export default (NotificationModel);