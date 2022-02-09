export interface Creative {
  id:	number,
  type:	string,
  nft_ref: string,
  url: string,
  name: string,
  description: string
}

export interface CreativeBE {
  data: Creative[]
}
