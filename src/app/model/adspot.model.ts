export interface Adspot {
  id: number,
  url?: string,
  name: string,
  spot_type: string,
  description: string,
  price: string,
  likes?: number,
  usersPerWeek?: number,
  totalUsers?: number,
  publisher?: string, // owner
  spot_metadata: string // unknown destination
}
