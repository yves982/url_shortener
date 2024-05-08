export interface IOriginalLinkRetriever {
    retrieve(identifier: string): Promise<string>
}
