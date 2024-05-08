import {IStatisticUpdater} from "../../application/adapters/secondary/iStatisticUpdater";
import {undefined} from "zod";
import {IEncoder} from "../../application/adapters/secondary/iEncoder";
import {ILinkRepository} from "../../application/adapters/secondary/repositories/iLinkRepository";

export class StatisticUpdater implements IStatisticUpdater {
    constructor(
        private readonly linkRepository: ILinkRepository,
        private readonly encoder: IEncoder,
    ) {
    }
    
    async updateClick(shortenedUrl: string): Promise<void> {
        const linkId = this.encoder.decode(shortenedUrl)
        const link = await this.linkRepository.findById(linkId)
        if(link === null) {
            throw new Error(`cannot find link ${linkId}`)
        }
        const updatedLink = link.click()
        await this.linkRepository.update(updatedLink)
    }
    
}
