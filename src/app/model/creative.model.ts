export interface Creative {
  id:	number,
  nft_ref: string,
  url: string,
  thumbnail?: string,
  name: string,
  description: string,
  blockchain_ref?: number,
  type?: string
}

export interface CreativeBE {
  data: Creative[]
}

export interface NftCreativeList {
  [id: number]: NftCreative
}

export interface NftCreative {
  creative_id: number,
  name: string,
  content: string,
  nft_cid: string,
  owner_account_id: string
}
