export interface Creative {
  id:	number,
  nft_ref: string,
  url: string,
  name: string,
  description: string,
  blockchain_ref?: number;
}

export interface CreativeBE {
  data: Creative[]
}

export interface NftCreativeList {
  [id: number]: NftCreative
}

export interface NftCreative {
  record_id: number,
  creative_ref: number,
  name: string,
  content: string,
  nft_cid: string,
  owner_account_id: string
}
