import { Injectable } from '@angular/core';
import { ConfigConstants } from '../../constant/config.constant';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor() {
  }

  getConstValue(key: string): any {
    return ConfigConstants.CONFIGS[key];
  }
}
