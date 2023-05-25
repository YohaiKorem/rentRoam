export class Host {
  constructor(
    public _id: string,
    public fullname: string,
    public location: string,
    public responseTime: string,
    public thumbnailUrl: string,
    public pictureUrl: string,
    public isSuperhost: boolean,
    public id: string,
    public description: string
  ) {}
}
