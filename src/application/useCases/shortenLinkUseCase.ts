import {ILinkRepository} from "../adapters/secondary/repositories/iLinkRepository";
import {Link} from "../models/link";
import {ILinkIdentifier} from "../adapters/secondary/ILinkIdentifier";
import {IOriginalLinkRetriever} from "../adapters/secondary/iOriginalLinkRetriever";

export class ShortenLinkUseCase {
    constructor(
        private readonly linkIdentifier: ILinkIdentifier) {
    }
    async shortenLink(url: string) : Promise<string> {
        const link = new Link(url, this.linkIdentifier)
        return await link.shorten()
    }
}
