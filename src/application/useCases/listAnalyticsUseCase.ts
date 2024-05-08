import {ILinkRepository} from "../adapters/secondary/repositories/iLinkRepository";
import {Link} from "../models/link";
import {LinkStatistic} from "../models/linkStatistic";
import {IEncoder} from "../adapters/secondary/iEncoder";

export class ListAnalyticsUseCase {
    constructor(
        private readonly linksRepository: ILinkRepository,
        private readonly encoder: IEncoder
    ) {
    }
    
    async listAnalytics() : Promise<LinkStatistic[]> {
        const links: Link[] = await this.linksRepository.getAll()
        return links.map((link) => LinkStatistic.fromLink(link, this.encoder))
    }
}
