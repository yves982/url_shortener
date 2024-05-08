import {IOriginalLinkRetriever} from "../../application/adapters/secondary/iOriginalLinkRetriever";
import {ILinkRepository} from "../../application/adapters/secondary/repositories/iLinkRepository";
import {IEncoder} from "../../application/adapters/secondary/iEncoder";

export class OriginalLinkRetrieve implements IOriginalLinkRetriever {
    constructor(
        private readonly linkRepository: ILinkRepository,
        private readonly encoder: IEncoder
    ) {
    }
    
    async retrieve(identifier: string): Promise<string> {
        const link = await this.linkRepository.findById(this.encoder.decode(identifier))
        return link.originalUrl
    }
}
