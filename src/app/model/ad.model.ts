export interface Ad {
  id: string,
  url: string,
  name: string,
  desc?: string,
  price?: string,
  likes?: number,
  usersPerWeek?: number,
  totalUsers?: number,
  owner?: string
}
