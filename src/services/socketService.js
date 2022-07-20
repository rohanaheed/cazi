import RobustWebSocket from 'robust-websocket';

class Socket {
  getToken() {
    const token = JSON.parse(sessionStorage.getItem("loginUser"))?.AccessToken;
    return token ? token : null;
  }
  
  getSocketConection() {
    const token = this.getToken();
    return token ? new  RobustWebSocket((ws) => {
      return ws.reconnects > 0 ? `${process.env.REACT_APP_SOCKET_URL}?token=${token}` : `${process.env.REACT_APP_SOCKET_URL}?token=${token}`
    }) : null;
  };
};

export default new Socket().getSocketConection();