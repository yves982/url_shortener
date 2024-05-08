import {Link} from "../../../models/link";

export interface ILinkRepository {
    init(): Promise<void>
    isInitialized: boolean
    
    // persist a new link and populates its id
    save(link: Link) : Promise<Link>;
    
    // finds a Link by its identifier
    findById(id: number): Promise<Link>
}
