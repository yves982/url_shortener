import {IOriginalLinkRetriever} from "../adapters/secondary/iOriginalLinkRetriever";
import {ILinkIdentifier} from "../adapters/secondary/ILinkIdentifier";

export class Link {
    
    constructor(
        public readonly originalUrl: string,
        private readonly linkIdentifier?: ILinkIdentifier,
        public readonly id: number = -1,
        public readonly clicksCnt: number = 0
    ) {
    }
    
    async shorten(): Promise<string> {
        if(this.linkIdentifier === undefined) {
            throw Error("must provide a repository")
        }
        return this.linkIdentifier.identify(this)
    }
    
    click(): Link {
        return new Link(
            this.originalUrl,
            this.linkIdentifier,
            this.id,
            this.clicksCnt+1
        )
    }
}
