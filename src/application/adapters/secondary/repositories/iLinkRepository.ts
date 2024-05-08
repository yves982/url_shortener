import {Link} from "../../../models/link";

export interface ILinkRepository {
    init(): Promise<void>
    isInitialized: boolean
    
    // persist a new link and populates its id
    create(link: Link) : Promise<Link>
    
    // updates an existing link
    update(link: Link) : Promise<Link>;
    
    // finds a Link by its identifier
    //
    // returns null of given link does not exists
    findById(id: number): Promise<Link|null>
}
