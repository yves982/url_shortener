export interface IStatisticUpdater{
    updateClick(shortenedUrl: string): Promise<void>
}
