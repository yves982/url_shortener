import express from "express"
import compression from "compression"
import {loadRoutes} from "./routes";

export async function initServer(): Promise<express.Express> {
    const app = express()
    const appRouter = express.Router()

    app.use(compression())
    app.use(express.json())

    loadRoutes(appRouter)
    
    return app
}

export function startServer(app: express.Express): void {
    const server = app.listen(process.env.API_PORT, () =>
        console.log(`Listening on port ${process.env.API_PORT}`)
    )

    process.on("SIGTERM", () => {
        server.close(() => {
            // Additional cleanup tasks go here, e.g., close database connection
            process.exit(0)
        })
    })

    process.on("SIGINT", () => {
        server.close(() => {
            // Additional cleanup tasks go here, e.g., close database connection
            process.exit(0)
        })
    })
}
