import {Link} from "../../models/link";

export interface ILinkIdentifier {
    identify(link: Link): Promise<string>
}
