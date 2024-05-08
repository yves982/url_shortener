import express from "express";

export const shortUrlRouter = express.Router()

shortUrlRouter.post('/shorturl', async (req, res) => {
    //
})

shortUrlRouter.get('/shortUrl/:url', async (req, res) => {
    //
})

shortUrlRouter.get('/shortUrl/statistics')
