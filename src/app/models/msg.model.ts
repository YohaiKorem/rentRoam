export class Msg {
  constructor(
    public id: string,
    public txt: string,
    public fromId: string,
    public toId: string,
    public sentTimeStamp: number
  ) {}
}
