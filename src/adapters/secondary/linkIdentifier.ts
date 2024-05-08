import {ILinkIdentifier} from "../../application/adapters/secondary/ILinkIdentifier";
import {Link} from "../../application/models/link";
import {ILinkRepository} from "../../application/adapters/secondary/repositories/iLinkRepository";
import {IEncoder} from "../../application/adapters/secondary/iEncoder";

export class LinkIdentifier implements ILinkIdentifier {
    constructor(
        private readonly linkRepository: ILinkRepository,
        private readonly encoder: IEncoder
    ) {
    }
    async identify(link: Link): Promise<string> {
        const updatedLink = await this.linkRepository.save(link)
        return this.encoder.encode(updatedLink.id)
    }
    
}
