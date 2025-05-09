const net = require('net');
const { Buffer } = require('buffer');

class ZKTeco {
  constructor(ip, port = 4370) {
    this.ip = ip;
    this.port = port;
    this.socket = null;
    this.sessionId = 0;
    this.replyId = -1;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.socket = net.createConnection(this.port, this.ip, () => {
        resolve();
      });

      this.socket.on('error', (error) => {
        reject(error);
      });

      this.socket.on('data', (data) => {
        this.handleResponse(data);
      });
    });
  }

  async disconnect() {
    if (this.socket) {
      this.socket.end();
      this.socket = null;
    }
  }

  handleResponse(data) {
    // Handle device response
    // This is a simplified version - actual implementation would need to parse the response
    console.log('Received data:', data);
  }

  async getAttendance() {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Not connected to device'));
        return;
      }

      const command = this.buildCommand('CMD_ATTLOG_RRQ');
      this.socket.write(command, (err) => {
        if (err) {
          reject(err);
        }
      });

      // In a real implementation, you would need to handle the response properly
      // This is a simplified version
      setTimeout(() => {
        resolve([]);
      }, 1000);
    });
  }

  buildCommand(command) {
    // Build the command packet according to ZKTeco protocol
    // This is a simplified version
    const buffer = Buffer.alloc(8);
    buffer.writeUInt16LE(0x50, 0); // Command header
    buffer.writeUInt16LE(this.sessionId, 2);
    buffer.writeUInt16LE(this.replyId, 4);
    buffer.writeUInt16LE(command, 6);
    return buffer;
  }
}

module.exports = { ZKTeco }; 