export default class BaseController {
  constructor() {
    this.autoBind();
  }

  private autoBind() {
    const prototype = Object.getPrototypeOf(this);
    Object.getOwnPropertyNames(prototype).forEach((key) => {
      const value = (this as any)[key];
      if (key !== "constructor" && typeof value === "function") {
        (this as any)[key] = value.bind(this);
      }
    });
  }
}
