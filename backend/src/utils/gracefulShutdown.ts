import { Server } from "node:http";

// TODO: close database connection
export default async (eventName: string, server: Server) => {
    console.log("Graceful Shutdown called with signal:", eventName);
    server.close();
};
