import {DateTime} from 'luxon';

export interface Timeslot {
  id: number,
  from_time: DateTime,
  to_time: DateTime,
  locked: boolean,
  price: number
}

export interface TimeslotBE {
  id: number,
  from_time: string,
  to_time: string,
  locked: boolean,
  price: number
}

export interface TimeslotList {
  data: TimeslotBE[]
}
