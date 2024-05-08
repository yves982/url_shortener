import {initServer, startServer} from "./app";

export const app = await initServer()
startServer(app)
