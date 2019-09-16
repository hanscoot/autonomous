export class KeyData {
  keyID: number;
  typeID: number;
  content: string;
}

export class UserKeys {
  personId: number;
  keyID: number;
}
export class UserLocks {
  keyID: number;
  name: string;
}
export class UserSchedules {
  keyID: number;
  scheduleID: number;
  times: string;
  days: string;
}

export class UserInfo {
  name: string;
  email: string;
  number: number;
}

export class LK {
  lockKeyID: number;
  lockID: number;
  keyID: number;
}
export class LockType {
  lockTypeID: number;
  type: string;
  iP: string;
  outputPort: number;
  inputPort: number;
  delay: number;
}

export class PK {
  personKeyID: number;
  personID: number;
  keyID: number;
}

export class SK {
  scheduleKeyID: number;
  scheduleID: number;
  keyID: number;
}

export class KP {
  name: string;
  keyID: number
}

export class KPD {
  name: string;
  keyID: number;
  content: string;
}

export class LockData {
  lockID: number;
  name: string;
  lockTypeID: number;
}

export class Log {
  logID: number;
  lockName: string;
  name: string;
  time: string;
}

export class TestData {
  personId: number;
  name: string;
  email: string;
  number: number;
  password: string;
  clear: boolean;
  token: string;
}

export class ScheduleData {
  scheduleID: number;
  times: string;
  days: string;
  number: number;
}

export class UserName {
  name: string;
  keyID: number;
}

export class LockKeyName {
  lockKeyID: number;
  keyID: number;
  name: string;
}
