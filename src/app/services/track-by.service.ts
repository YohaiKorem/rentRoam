import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TrackByService {
  constructor() {}

  byId(idx: number, entity: any) {
    if (entity.hasOwnProperty('id')) {
      return entity.id;
    } else if (entity.hasOwnProperty('_id')) {
      return entity._id;
    }
    return idx;
  }

  byIdx(idx: number, entity: any) {
    return idx;
  }
}
