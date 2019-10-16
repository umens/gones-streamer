import { Injectable } from '@angular/core';
import * as EventEmitter from 'events';
// import { Subject, Observable, Observer } from 'rxjs';
import * as shajs from 'sha.js';

@Injectable()
export class WebsocketService extends EventEmitter {

  debug: () => void;
  CONNECTING: any;
  ID_COUNTER: number;
  PROMISES: {};
  SOCKET: any;

  constructor() {
    super();

    this.debug = () => { };

    this.CONNECTING = null;
    this.ID_COUNTER = 1;
    this.PROMISES = {};
    this.SOCKET = undefined;
  }

  /**
   * Connect to OBS remote
   *
   * @param host websocket url
   * @param port websocket port
   * @param secure websocket ssl
   *
   * @returns Promise
   */
  connect(host = 'localhost', port = 4444, secure = false) {
    if (this.SOCKET) {
      this.SOCKET.onopen = null;
      this.SOCKET.onmessage = null;
      this.SOCKET.onerror = null;
      this.SOCKET.onclose = null;
      this.SOCKET.close();
    }

    return new Promise((resolve, reject) => {
      this.CONNECTING = { resolve, reject };
      const secureSocket = (secure) ? 'wss://' : 'ws://';
      const url = secureSocket + host + ':' + port;
      this.SOCKET = new WebSocket(url);

      this.SOCKET.onopen = socketOnOpen.bind(this);
      this.SOCKET.onmessage = socketOnMessage.bind(this);
      this.SOCKET.onerror = socketOnError.bind(this);
      this.SOCKET.onclose = socketOnClose.bind(this);
    });
  }

  /**
   * Close socket connection
   */
  close() {
    if (this.SOCKET) {
      this.SOCKET.close();
    }
  }

  /**
   * Sends raw message to OBS remote
   *
   * @param message message to be send to websocket
   * @returns Promise
   */
  send(message) {
    return new Promise((resolve, reject) => {
      if (this.SOCKET) {
        const id = this._nextID();
        this.PROMISES[id] = { resolve, reject };

        message['message-id'] = id;

        // this.debug('send', message);

        this.SOCKET.send(JSON.stringify(message));
      } else {
        throw new Error('Connection isn\'t opened');
      }
    });
  }

  /**
   * Convenience method for logging in
   *
   * @param password password for login to websocket
   *
   * @returns Promise
   */
  async login(password) {
    const { authRequired, salt, challenge }: any = await this.send({ 'request-type': 'GetAuthRequired' });

    if (!authRequired) {
      return true;
    }
    if (!password) {
      throw new Error('Password Required');
    }

    const authHash = shajs('sha256');
    authHash.update(password);
    authHash.update(salt);
    const authResponse = shajs('sha256');
    authResponse.update(authHash.digest('base64'));
    authResponse.update(challenge);
    const auth = authResponse.digest('base64');

    await this.send({
      'request-type': 'Authenticate',
      auth
    });
    this.emit('socket.ready');

    return true;
  }

  /**
   * Get ID for next request
   *
   * @returns string
   */
  _nextID() {
    return String(this.ID_COUNTER++);
  }

}



/**
 * Handle socket opening
 */
function socketOnOpen() {
  if (this.CONNECTING) {
    const { resolve, reject } = this.CONNECTING;

    this.send({ 'request-type': 'GetAuthRequired' }).then(({ authRequired }) => {
      resolve({ authRequired });

      if (authRequired) {
        this.emit('socket.auth');
      } else {
        this.emit('socket.ready');
      }
    }, err => reject(err));

    this.CONNECTING = null;
  }
  this.emit('socket.open');
}

/**
 * Handle socket messages
 *
 * @param message message receive by socket
 */
function socketOnMessage(message) {
  let received;
  try {
    received = JSON.parse(message.data);
  } catch (err) {
    this.emit('error', err);
  }

  if (!received) {
    return;
  }

  this.debug('receive', received);

  const type = received['update-type'];
  if (type) {
    handleUpdate.call(this, type, received);
  } else {
    handleCallback.call(this, received['message-id'], received);
  }
}

/**
 * Handle socket errors
 *
 * @param error socket error
 */
function socketOnError(error) {
  this.emit('socket.error', error);
}

const disconnectReasons = {
  1006: 'Server not reachable'
};

/**
 * Handle socket close events
 *
 * @param event close event socket handler
 */
function socketOnClose(event) {
  if (this.CONNECTING) {
    let message = 'Unknown Error';
    if (event.code in disconnectReasons) {
      message = disconnectReasons[event.code];
    } else if (event.message) {
      message = event.message;
    }

    const error = new Error(message);
    // error.event = event;

    this.CONNECTING.reject(error);
    this.CONNECTING = null;
  }

  this.emit('socket.close');
}

/**
 * Handle responses from server
 *
 * @param id message id
 * @param message message from socket
 */
function handleCallback(id, message) {
  const promise = this.PROMISES[id];
  if (promise) {
    if (message.status === 'error') {
      promise.reject(new Error(message.error));
    } else {
      promise.resolve(message);
    }
    delete this.PROMISES[id];
  } else if (message.status === 'error') {
    this.emit('error', message.error, message);
  }
}

/**
 * Handle general updates
 *
 * @param type event type
 * @param message socket message
 */
function handleUpdate(type, message) {
  this.emit('event', message);
  this.emit(type, message);
}
