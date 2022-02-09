export interface Creative {
  id:	number,
  nft_ref: string,
  url: string,
  name: string,
  description: string
}

export interface CreativeBE {
  data: Creative[]
}
