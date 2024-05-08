import {Link} from "../models/link";
import {ILinkIdentifier} from "../adapters/secondary/ILinkIdentifier";
import {ILinkValidator} from "../adapters/secondary/iLinkValidator";

export class ShortenLinkUseCase {
    constructor(
        private readonly linkIdentifier: ILinkIdentifier,
        private readonly linkValidator: ILinkValidator
    ) {
    }
    async shortenLink(url: string) : Promise<string> {
        if(!this.linkValidator.validate(url)) {
            throw new Error("invalid url")
        }
        const link = new Link(url, this.linkIdentifier)
        return await link.shorten()
    }
}
