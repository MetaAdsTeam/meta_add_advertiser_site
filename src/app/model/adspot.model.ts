export interface Adspot {
  id: number,
  name: string,
  spot_type: string,
  description: string,
  price: number,
  likes?: number,
  publisher_name?: string, // owner
  preview_url: string,
  preview_thumb_url: string,
  spot_metadata?: string // unknown destination
  views_amount?: number,
  average_time?: number,
  max_traffic?: number,
  active: boolean,
  jump_url?: string
}

export interface AdspotList {
  data: Adspot[]
}
