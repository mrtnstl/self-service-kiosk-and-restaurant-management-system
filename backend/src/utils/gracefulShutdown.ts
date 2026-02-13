import { Server } from "node:http";

export default async (eventName: string, server: Server) => {
    console.log("Graceful Shutdown called with signal:", eventName);
    server.close();
};
