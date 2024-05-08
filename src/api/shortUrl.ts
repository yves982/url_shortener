import express from "express";
import {ShortenLinkUseCase} from "../application/useCases/shortenLinkUseCase";
import {LinkIdentifier} from "../adapters/secondary/linkIdentifier";
import {UriJsLinkValidator} from "../adapters/secondary/uriJsLinkValidator";
import {SqliteLinkRepository} from "../adapters/secondary/repositories/sqliteLinkRepository";
import {Base62Encoder} from "../adapters/secondary/base62Encoder";
import container from "../dependencyInjection"
import z from "zod"

export const shortUrlRouter = express.Router()

const shortenUrlSchema = z.object({ url: z.string().min(1).max(255) })
const expandUrlSchema = z.object({ url: z.string().min(1) })

shortUrlRouter.post('/shorturl', async (req, res) => {
    try {
        const { url } = await shortenUrlSchema.parseAsync(req.params)
        const shortenedUrl = await container.ShortLinkUseCase.shortenLink(url)
        return res.json({originalUrl: url, shortUrl: shortenedUrl})
    } catch (e: any) {
        if(e.message.indexOf("invalid")) {
            return res.status(400).json({ error: "invalid URL" })
        }
        return res.status(500).json({ error: e.message ?? "unknown error" })
    }
})

shortUrlRouter.get('/shortUrl/:url', async (req, res) => {
    try {
        const { url } = await expandUrlSchema.parseAsync(req.params)
        const initialUrl = await container.ExpandLinkUseCase.expandLink(url)
        return res.redirect(initialUrl)
    } catch (e: any) {
        if(e.message.indexOf("invalid") >= 0) {
            return res.status(400).json({ error: "invalid short URL" })
        }
        if(e.message.indexOf("cannot find") >= 0) {
            return res.status(404)
        }
        return res.status(500).json({ error: e.message ?? "unknown error" })
    }
})

shortUrlRouter.get('/shortUrl/analytics', async (req, res) => {
    try {
        const analytics = (await container.ListAnalyticsUseCase.listAnalytics())
            .map( stat => Object.assign(stat, {id: undefined}))
        return res.json(analytics)
    } catch (e: any) {
        if(e.message.indexOf("invalid")) {
            return res.status(400).json({ error: "invalid URL" })
        }
        return res.status(500).json({ error: e.message ?? "unknown error" })
    }
})
