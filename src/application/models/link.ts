import {ILinkRepository} from "../adapters/secondary/repositories/iLinkRepository";

export class Link {
    
    constructor(
        public readonly originalUrl: string,
        private readonly linkRepository?: ILinkRepository,
        public readonly id: number = -1
    ) {
    }
    
    async shorten(): Promise<string> {
        if(this.linkRepository === undefined) {
            throw Error("must provide a repository")
        }
        const updatedLink = await this.linkRepository!.save(this)
        return updatedLink.id.toString()
    }
    
    static async expand(shortUrl: string, linkRepository: ILinkRepository): Promise<string> {
        const link = await linkRepository!.findById(Number.parseInt(shortUrl))
        return link.originalUrl
    }
}
