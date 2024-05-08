import {Router} from "express";
import {shortUrlRouter} from "./api/shortUrl";

export function loadRoutes(appRouter: Router) {
    appRouter.use(shortUrlRouter)
}
