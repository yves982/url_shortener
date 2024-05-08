import {ILinkRepository} from "../adapters/secondary/repositories/iLinkRepository";
import {IEncoder} from "../adapters/secondary/iEncoder";
import {IOriginalLinkRetriever} from "../adapters/secondary/iOriginalLinkRetriever";
import {ILinkIdentifier} from "../adapters/secondary/ILinkIdentifier";

export class Link {
    
    constructor(
        public readonly originalUrl: string,
        private readonly linkIdentifier?: ILinkIdentifier,
        public readonly id: number = -1
    ) {
    }
    
    async shorten(): Promise<string> {
        if(this.linkIdentifier === undefined) {
            throw Error("must provide a repository")
        }
        return this.linkIdentifier.identify(this)
    }
    
    static async expand(shortUrl: string, originalLinkRetriever: IOriginalLinkRetriever): Promise<string> {
        return await originalLinkRetriever.retrieve(shortUrl)
    }
}
