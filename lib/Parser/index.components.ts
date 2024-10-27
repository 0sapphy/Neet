import parser from "qs";

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
    return parser.parse(id) as { I: string; S?: string; A?: object }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CompileArguments(A: any) {
    const args = {};
    for (const ARG of Object.keys(A)) {
        Object.assign(args, { [ARG]: A[ARG] })
    }

    return args;
}