import { User } from './user.model';
import { UtilService } from '../services/util.service';
export class StayHost {
  constructor(
    public _id: string,
    public fullname: string,
    public location: string,
    public responseTime: string,
    public thumbnailUrl: string,
    public pictureUrl: string,
    public isSuperhost: boolean,
    public description: string
  ) {}
  public static newHostFromUser(user: User): StayHost {
    return new StayHost(
      user._id,
      user.fullname,
      '',
      '',
      user.imgUrl,
      user.imgUrl,
      false,
      ''
    );
  }
}
