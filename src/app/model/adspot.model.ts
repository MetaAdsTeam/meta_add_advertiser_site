export interface Adspot {
  id: number,
  url?: string,
  name: string,
  spot_type: string,
  description: string,
  price: number,
  likes?: number,
  usersPerWeek?: number,
  totalUsers?: number,
  publisher_name?: string, // owner
  preview_url: string,
  preview_thumb_url: string,
  spot_metadata?: string // unknown destination
  views_amount?: number,
  average_time?: number,
  max_traffic?: number
}

export interface AdspotList {
  data: Adspot[]
}
