import parser from "qs";
import { IParsed } from "../Types/neet";

/**
 * ID - The main identifier, this is required. Prefix = I:
 *    [I]=member*
 * 
 * SUBID - This is not required: Prefix = S:
 *    *[S]=0* - No SUBID ; *[S]=whois WITH SUBID
 * 
 * ARGS - This is not required: Prefix = A:
 *    *A[username]=0sapphy&A[command]=whois
 * 
 * How id arguments string should be formatted:
 * 
 * @example
 * new Builder()
 * .setCustomId("[I]=member&[S]=whois&A[userId]=1234") // With ID, SUBID & ARGS
 * .setCustomId("[I]=member&[S]=whois") // With ID & SUBID
 * .setCustomId("[I]=member&A[username]=0sapphy&A[command]=whois") // With ID & MULTI-ARGS
 */
export function Parse(id: string) {
    return parser.parse(id) as IParsed;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CompileArguments(O: IParsed | any) {
    const args = {};
    for (const ARG of Object.keys(O.A ? O.A : O)) {
        Object.assign(args, { [ARG]: O.A ? O.A[ARG] : O[ARG] })
    }

    return args;
}

/**
 * Utility function to generate a id.
 */
export function createId(
    I: string, 
    S?: string, 
    A?: { K: string | boolean | number, V: string | boolean | number }[]
) {
    let id = `[I]=${I}${S ? `&[S]=${S}` : ""}&`;
    let num = 0;

    if (A) {
        for (const KV of A) {
            num++;
            id += `A[${KV.K}]=${KV.V}${num >= A.length ? "" : "&"}`
        }
    }

    return id;
}