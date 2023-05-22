export class Btn {
  className: string;
  txt: string;

  constructor(className: string, txt: string) {
    this.className = className;
    this.txt = txt;
  }
  static createArray(length: number, className: string, txt: string): Btn[] {
    const btnsArray: Btn[] = [];

    for (let i = 0; i < length; i++) {
      btnsArray.push(new Btn(className, txt));
    }

    return btnsArray;
  }
}
