import {Injectable} from '@angular/core';
import {PlaceAdStorageModel} from '../model';
import {PayDataStorageModel} from '../model/pay-data.storage.model';

const placeAdStorageKey = 'MetaAds-PlaceAd';
const payDataStorageKey = 'MetaAds-PayData';
const newCreativeStorageKey = 'MetaAds-NewCreative';

@Injectable({providedIn: 'root'})
export class StorageService {
  /** используется для восстановления состояния после редиректа на кошелек и возврата обратно**/
  /** для креативов **/
  savePlaceAdToStorage(placeAdStorage: PlaceAdStorageModel) {
    localStorage.setItem(placeAdStorageKey, JSON.stringify(placeAdStorage));
  }

  getPlaceAdFromStorage(): PlaceAdStorageModel | null{
    const storageData = localStorage.getItem(placeAdStorageKey);
    if (storageData) {
      return JSON.parse(storageData);
    }
    return null;
  }

  clearPlaceAdInStorage() {
    localStorage.removeItem(placeAdStorageKey);
  }

  /** для оплаты **/
  savePayDataToStorage(payDataStorageModel: PayDataStorageModel) {
    localStorage.setItem(payDataStorageKey, JSON.stringify(payDataStorageModel));
  }

  getPayDataFromStorage(): PayDataStorageModel | null{
    const storageData = localStorage.getItem(payDataStorageKey);
    if (storageData) {
      return JSON.parse(storageData);
    }
    return null;
  }

  clearPayDataInStorage() {
    localStorage.removeItem(payDataStorageKey);
  }

  getNewCreativeFromStorage(): string | null {
    return localStorage.getItem(newCreativeStorageKey)
  }

  saveNewCreativeToStorage(newCreative: number) {
    localStorage.setItem(newCreativeStorageKey, newCreative.toString());
  }

  clearNewCreativeInStorage() {
    localStorage.removeItem(newCreativeStorageKey);
  }
}
