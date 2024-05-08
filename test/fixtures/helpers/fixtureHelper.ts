import fs from 'node:fs/promises';
import Path from "path";

export class FixtureHelper {
    private static dateTimeReviver(_: string, value: any): string | Date {
        if (typeof value === "string") {
            const parsed = Date.parse(value)
            if (
                !Number.isNaN(parsed) &&
                value.indexOf("T") >= 0 &&
                value.indexOf(".000Z") >= 0
            ) {
                return new Date(parsed)
            }
        }
        return value
    }
    
    static async load<T>(relativePath: string): Promise<T> {
        const filePath = Path.join(
            __dirname,
            "..",
            "fixtures",
            "application",
            "useCases",
            ...relativePath.split("/")
        )
        const content = await fs.readFile(filePath, { encoding: "utf8" })
        return JSON.parse(content, FixtureHelper.dateTimeReviver) as T
    }
}
