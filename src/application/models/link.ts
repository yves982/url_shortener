import {ILinkRepository} from "../adapters/secondary/repositories/iLinkRepository";
import {IEncoder} from "../adapters/secondary/iEncoder";

export class Link {
    
    constructor(
        public readonly originalUrl: string,
        private readonly linkRepository?: ILinkRepository,
        private readonly encoder?: IEncoder,
        public readonly id: number = -1
    ) {
    }
    
    async shorten(): Promise<string> {
        if(this.linkRepository === undefined) {
            throw Error("must provide a repository")
        }
        const updatedLink = await this.linkRepository!.save(this)
        return this.encoder!.encode(updatedLink.id)
    }
    
    static async expand(shortUrl: string, linkRepository: ILinkRepository, encoder: IEncoder): Promise<string> {
        const link = await linkRepository!.findById(encoder.decode(shortUrl))
        return link.originalUrl
    }
}
