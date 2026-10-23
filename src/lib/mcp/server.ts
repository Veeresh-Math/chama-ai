import { MCPServer } from './protocol';
import { registerAllTools } from './tools';

export function createMCPServer(): MCPServer {
  const server = new MCPServer();
  registerAllTools(server);
  return server;
}

export { MCPServer } from './protocol';