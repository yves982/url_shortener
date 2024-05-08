// encodes and decodes a string
//
// for any number n this should remain true decode(encode(str)) === n
export interface IEncoder {
    encode(clearValue: number): string
    decode(encodedValue: string): number
}
