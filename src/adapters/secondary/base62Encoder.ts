import {IEncoder} from "../../application/adapters/secondary/iEncoder";

export class Base62Encoder implements IEncoder{
    b62Alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    
    decode(encodedValue: string): number {
        let res = 0
        for(let i = 0; i < encodedValue.length; i++) {
            res += this.b62Alphabet.indexOf(encodedValue[i]) * Math.pow(62, encodedValue.length -i -1)
        }
        return res
    }

    encode(clearValue: number): string {
        let res = []
        let n = clearValue
        while(n > 0) {
            res.push(this.b62Alphabet[n % 62])
            n = Math.floor(n / 62)
        }
        res.reverse()
        return res.join("")
    }
    
}
