import stringify from 'json-stringify-safe';

export default class EventSource {
  private connections: any[];

  constructor() {
    this.connections = [];
  }

  public addConnection(connection: any) {
    this.connections.push(connection);
  }

  public emit(event: string, data: any) {
    this.connections.forEach((connection) => {
      connection.write(`event: ${event}\n`);
      connection.write(`data: ${stringify(data)}\n`);
      connection.write('\n\n');
    });
  }
}
