export enum CardType {
  Auction = 'auction',
  Common = 'common',
}

export interface CommonCardType {
  id: string;
  imageUrl: string;
  title: string;
  price: string;
  marketPrice: string;
  marketType: string;
  indicator: string;
  boosted?: boolean;
}

export interface AuctionCardType {
  id: string;
  imageUrl: string;
  title: string;
  price: string;
  boosted?: boolean;
}
