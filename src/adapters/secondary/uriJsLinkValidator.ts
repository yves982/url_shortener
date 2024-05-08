import {ILinkValidator} from "../../application/adapters/secondary/iLinkValidator";
import {parse} from "uri-js"

export class UriJsLinkValidator implements ILinkValidator {
    validate(link: string): boolean {
        return parse(link).error === undefined;
    }
    
}
