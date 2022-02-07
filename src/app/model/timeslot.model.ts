export interface Timeslot {
  id: number,
  from_time: string,
  to_time: string,
  locked: boolean,
  price: number
}

export interface TimeslotList {
  data: Timeslot[]
}
