import {ILinkRepository} from "../adapters/secondary/repositories/iLinkRepository";
import {IOriginalLinkRetriever} from "../adapters/secondary/iOriginalLinkRetriever";

export class ExpandLinkUseCase {
    constructor(
        private readonly originalLinkRetriever: IOriginalLinkRetriever
    ) {
    }
    
    async expandLink(shortenedUrl: string): Promise<string> {
        return await this.originalLinkRetriever.retrieve(shortenedUrl)
    }
}
