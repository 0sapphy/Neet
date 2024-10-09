import { IParameter } from "./NeetButton";

export class NeetButtonParameters {
    param: IParameter[];

    public constructor(parameters: IParameter[]) {
        this.param = parameters;
    }

    public get(name: string) {
        const param = this.param.find(v => v.name === name);
        if (!param) return null;
        return param.value
    }
}