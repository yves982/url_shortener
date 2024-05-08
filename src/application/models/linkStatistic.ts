import {IEncoder} from "../adapters/secondary/iEncoder";
import {LinkIdentifier} from "../../adapters/secondary/linkIdentifier";
import {Link} from "./link";

export class LinkStatistic {
    private constructor(
        public readonly originalUrl: string,
        public readonly id: number,
        public readonly shortUrl: string,
        public readonly clicksCnt: number
    ) {}

    static fromLink(link: Link, encoder: IEncoder): LinkStatistic {
        return new LinkStatistic(link.originalUrl, link.id, encoder.encode(link.id), link.clicksCnt)
    }
}
