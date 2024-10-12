import { IParameter } from "./NeetButton";

export class NeetButtonParameters {
  param: IParameter[];

  public constructor(parameters: IParameter[]) {
    this.param = parameters;
  }

  public get(name: string) {
    const param = this.param.find((v) => v.name === name);
    if (!param) return null;
    return param.value;
  }

  public boolean(name: string, required?: boolean) {
    const value = this.get(name);
    if (!value) {
      if (required)
        throw new Error("NeetButton, option is requirer but got null");

      return null;
    }

    return value === "true" ? true : false;
  }
}
