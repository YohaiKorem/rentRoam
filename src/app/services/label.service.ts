import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import _labels from '../../data/labels.json';
import { Label } from '../models/label.model';
const ENTITY = 'labels';
@Injectable({
  providedIn: 'root',
})
export class LabelService {
  private _labels$ = new BehaviorSubject<Label[]>([]);
  public labels$ = this._labels$.asObservable();
  constructor() {
    let labels = JSON.parse(localStorage.getItem(ENTITY) || 'null');

    if (!labels || !labels.length) labels = _labels;
    localStorage.setItem(ENTITY, JSON.stringify(labels));
    this._labels$.next(labels);
  }
}
