import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable()
export class MobileService {

  constructor(private deviceService: DeviceDetectorService)
  {
    this.tang = false;
    this.epicFunction();
  }

  tang: boolean
  deviceInfo = null;
  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    if (isMobile === true) {
      this.tang = true
    }
  }
}
