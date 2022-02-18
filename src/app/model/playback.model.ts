import {DateTime} from 'luxon';

export interface PlaybackBody {
  from_time: string,
  to_time: string,
  adspot_id: number,
  creative_id: number,
  status?: string,
  smart_contract?: number,
  play_price: number
}

export interface Playback {
  id: number,
  example: number,
  adspot_name: string,
  from_time: DateTime,
  to_time: DateTime,
  advert_id: number,
  creative_name: string,
  creative_description: string,
  creative_url: string,
  creative_path: string,
  status: string,
  smart_contract: string,
  spot_price: number,
  locked: boolean,
  adspot_type_name: string,
  publish_url: string,
  processed_at: string,
  preview_thumb_url: string,
  adspot_likes?: number,
  jump_url?: string,
  adspot_id: number
}

export interface PlaybackBE {
  id: number,
  example: number,
  adspot_name: string,
  from_time: string,
  to_time: string,
  advert_id: number,
  creative_name: string,
  creative_description: string,
  creative_url: string,
  creative_path: string,
  status: string,
  smart_contract: string,
  spot_price: number,
  locked: boolean,
  adspot_type_name: string,
  publish_url: string,
  processed_at: string,
  preview_thumb_url: string,
  adspot_likes?: number,
  jump_url?: string,
  adspot_id: number
}

export interface PlaybackList {
  data: PlaybackBE[]
}

export interface NftPlaybackList {
  [id: number]: NftPlayback
}

export interface NftPlayback {
  playback_id: number,
  adspace_id: number,
  creative_id: number,
  advertiser_cost: number,
  start_time: number,
  end_time: number,
  transfered: boolean,
  advertiser_account_id: string,
  publisher_account_id: string,
  ad_space_name: string,
  publisher_earn: any,
  creative_ref: number,
  show_kind: any,
  entertainment: string,
  entertainment_fee: number,
  status: string
}
