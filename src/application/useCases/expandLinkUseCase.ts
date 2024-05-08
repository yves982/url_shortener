import {ILinkRepository} from "../adapters/secondary/repositories/iLinkRepository";
import {IOriginalLinkRetriever} from "../adapters/secondary/iOriginalLinkRetriever";
import {IEncoder} from "../adapters/secondary/iEncoder";
import {IStatisticUpdater} from "../adapters/secondary/iStatisticUpdater";

export class ExpandLinkUseCase {
    constructor(
        private readonly originalLinkRetriever: IOriginalLinkRetriever,
        private readonly linkStatisticsUpdater: IStatisticUpdater
    ) {
    }
    
    async expandLink(shortenedUrl: string): Promise<string> {
        const originalLink = await this.originalLinkRetriever.retrieve(shortenedUrl)
        if(originalLink === null) {
            throw Error("cannot find link")
        }
        await this.linkStatisticsUpdater.updateClick(shortenedUrl)
        return originalLink
    }
}
