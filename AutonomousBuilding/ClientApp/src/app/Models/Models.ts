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
  outputType: string;
  outputIP: string;
  outputPort: number;
  inputType: string;
  inputIP: string;
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
  temp: boolean;
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
  status: string;
}

export class TestData {
  personId: number;
  name: string;
  email: string;
  number: number;
  password: string;
  clear: boolean;
  temp: boolean;
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
  temp: boolean;
  keyID: number;
}

export class LockKeyName {
  lockKeyID: number;
  keyID: number;
  name: string;
}

export class QR {
  personID: number;
  keyID: number;
  content: string;
}

export class Locks {
  keyID: number;
  name: string;
  lockTypeID: number;
  lockID: number;
}

export class Calss {
  keyID: number;
  name: string;
  lockTypeID: number;
  lockID: number;
  scheduleID: number;
  times: string;
  days: string;
}

export class OneTime {
  userID: number;
  lockID: string;
  time: string;
  date: string;
  personID: number;
  keyID: number;
}
