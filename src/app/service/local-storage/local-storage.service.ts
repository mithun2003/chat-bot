import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
// import { AES, enc } from 'crypto-js';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  ignoreClear: Array<string> = ['tempBaseRootUrl', 'user-theme'];

  ignoreEncryption: Array<string> = [];
  environment = environment;
  isBrowser: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  set appToken(token: string) {
    if (this.isBrowser) {
      localStorage.setItem('appToken', token);
    }
  }

  get appToken(): string {
    if (this.isBrowser) {
      return localStorage.getItem('appToken') ?? '';
    }
    return '';
  }

  setItem(key: string, value: unknown) {
    try {
      const stringifiedValue = JSON.stringify(value);

      if (this.ignoreEncryption.includes(key)) {
        if (this.isBrowser) {
          localStorage.setItem(key, stringifiedValue);
        }
        return;
      }

      // if (!environment.isItDev) {
      //   stringifiedValue = AES.encrypt(
      //     stringifiedValue,
      //     'c729e96179ee4d453f5c9b6d00c31da7'
      //   ).toString();
      // }
      if (this.isBrowser) {
        localStorage.setItem(key, stringifiedValue);
      }
    } catch {
      //
    }
  }

  getItem(key: string) {
    let value = '';
    if (this.isBrowser) {
      value = localStorage.getItem(key) ?? '';
    }
    if (!value) return null;
    try {
      if (this.ignoreEncryption.includes(key))
        return JSON.parse(localStorage.getItem(key) ?? '');

      // if (!environment.isItDev)
      //   return JSON.parse(
      //     AES.decrypt(value, 'c729e96179ee4d453f5c9b6d00c31da7').toString(
      //       enc.Utf8
      //     )
      //   );

      return JSON.parse(value);
    } catch (_) {
      return null;
    }
  }

  removeItem(key: string) {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }

  clearSessionStorage(): void {
    if (this.isBrowser) {
      sessionStorage.clear();
    }
  }

  clearLocalStorage(): void {
    if (this.isBrowser) {
      const keys = Object.keys(localStorage);

      keys?.forEach((k) => {
        if (!this.ignoreClear.includes(k)) localStorage.removeItem(k);
      });
    }
    /*  */
  }
}
