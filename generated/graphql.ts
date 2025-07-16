/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/array-type */
// @ts-nocheck
// This file is generated. Do not edit directly.
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  BigFloat: { input: any; output: any };
  BigInt: { input: any; output: any };
  Cursor: { input: any; output: any };
  Date: { input: any; output: any };
  Datetime: { input: any; output: any };
  JSON: { input: any; output: any };
  Opaque: { input: any; output: any };
  Time: { input: any; output: any };
  UUID: { input: any; output: any };
};

/** Boolean expression comparing fields on type "BigFloat" */
export type BigFloatFilter = {
  eq?: InputMaybe<Scalars['BigFloat']['input']>;
  gt?: InputMaybe<Scalars['BigFloat']['input']>;
  gte?: InputMaybe<Scalars['BigFloat']['input']>;
  in?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['BigFloat']['input']>;
  lte?: InputMaybe<Scalars['BigFloat']['input']>;
  neq?: InputMaybe<Scalars['BigFloat']['input']>;
};

/** Boolean expression comparing fields on type "BigFloatList" */
export type BigFloatListFilter = {
  containedBy?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
  contains?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
  eq?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
};

/** Boolean expression comparing fields on type "BigInt" */
export type BigIntFilter = {
  eq?: InputMaybe<Scalars['BigInt']['input']>;
  gt?: InputMaybe<Scalars['BigInt']['input']>;
  gte?: InputMaybe<Scalars['BigInt']['input']>;
  in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['BigInt']['input']>;
  lte?: InputMaybe<Scalars['BigInt']['input']>;
  neq?: InputMaybe<Scalars['BigInt']['input']>;
};

/** Boolean expression comparing fields on type "BigIntList" */
export type BigIntListFilter = {
  containedBy?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  eq?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

/** Boolean expression comparing fields on type "Boolean" */
export type BooleanFilter = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  is?: InputMaybe<FilterIs>;
};

/** Boolean expression comparing fields on type "BooleanList" */
export type BooleanListFilter = {
  containedBy?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  contains?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  eq?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

/** Boolean expression comparing fields on type "Date" */
export type DateFilter = {
  eq?: InputMaybe<Scalars['Date']['input']>;
  gt?: InputMaybe<Scalars['Date']['input']>;
  gte?: InputMaybe<Scalars['Date']['input']>;
  in?: InputMaybe<Array<Scalars['Date']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Date']['input']>;
  lte?: InputMaybe<Scalars['Date']['input']>;
  neq?: InputMaybe<Scalars['Date']['input']>;
};

/** Boolean expression comparing fields on type "DateList" */
export type DateListFilter = {
  containedBy?: InputMaybe<Array<Scalars['Date']['input']>>;
  contains?: InputMaybe<Array<Scalars['Date']['input']>>;
  eq?: InputMaybe<Array<Scalars['Date']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['Date']['input']>>;
};

/** Boolean expression comparing fields on type "Datetime" */
export type DatetimeFilter = {
  eq?: InputMaybe<Scalars['Datetime']['input']>;
  gt?: InputMaybe<Scalars['Datetime']['input']>;
  gte?: InputMaybe<Scalars['Datetime']['input']>;
  in?: InputMaybe<Array<Scalars['Datetime']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Datetime']['input']>;
  lte?: InputMaybe<Scalars['Datetime']['input']>;
  neq?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Boolean expression comparing fields on type "DatetimeList" */
export type DatetimeListFilter = {
  containedBy?: InputMaybe<Array<Scalars['Datetime']['input']>>;
  contains?: InputMaybe<Array<Scalars['Datetime']['input']>>;
  eq?: InputMaybe<Array<Scalars['Datetime']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['Datetime']['input']>>;
};

export enum FilterIs {
  NOT_NULL = 'NOT_NULL',
  NULL = 'NULL',
}

/** Boolean expression comparing fields on type "Float" */
export type FloatFilter = {
  eq?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<Scalars['Float']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  neq?: InputMaybe<Scalars['Float']['input']>;
};

/** Boolean expression comparing fields on type "FloatList" */
export type FloatListFilter = {
  containedBy?: InputMaybe<Array<Scalars['Float']['input']>>;
  contains?: InputMaybe<Array<Scalars['Float']['input']>>;
  eq?: InputMaybe<Array<Scalars['Float']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['Float']['input']>>;
};

/** Boolean expression comparing fields on type "ID" */
export type IdFilter = {
  eq?: InputMaybe<Scalars['ID']['input']>;
};

/** Boolean expression comparing fields on type "Int" */
export type IntFilter = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  neq?: InputMaybe<Scalars['Int']['input']>;
};

/** Boolean expression comparing fields on type "IntList" */
export type IntListFilter = {
  containedBy?: InputMaybe<Array<Scalars['Int']['input']>>;
  contains?: InputMaybe<Array<Scalars['Int']['input']>>;
  eq?: InputMaybe<Array<Scalars['Int']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** The root type for creating and mutating data */
export type Mutation = {
  __typename?: 'Mutation';
  /** Deletes zero or more records from the `addresses` collection */
  deleteFromaddressesCollection: AddressesDeleteResponse;
  /** Deletes zero or more records from the `auctions` collection */
  deleteFromauctionsCollection: AuctionsDeleteResponse;
  /** Deletes zero or more records from the `bids` collection */
  deleteFrombidsCollection: BidsDeleteResponse;
  /** Deletes zero or more records from the `card_sets` collection */
  deleteFromcard_setsCollection: CardSetsDeleteResponse;
  /** Deletes zero or more records from the `cards` collection */
  deleteFromcardsCollection: CardsDeleteResponse;
  /** Deletes zero or more records from the `categories` collection */
  deleteFromcategoriesCollection: CategoriesDeleteResponse;
  /** Deletes zero or more records from the `listing_images` collection */
  deleteFromlisting_imagesCollection: ListingImagesDeleteResponse;
  /** Deletes zero or more records from the `listings` collection */
  deleteFromlistingsCollection: ListingsDeleteResponse;
  /** Deletes zero or more records from the `old_table_scraping_cards` collection */
  deleteFromold_table_scraping_cardsCollection: OldTableScrapingCardsDeleteResponse;
  /** Deletes zero or more records from the `orders` collection */
  deleteFromordersCollection: OrdersDeleteResponse;
  /** Deletes zero or more records from the `reviews` collection */
  deleteFromreviewsCollection: ReviewsDeleteResponse;
  /** Deletes zero or more records from the `users` collection */
  deleteFromusersCollection: UsersDeleteResponse;
  /** Adds one or more `addresses` records to the collection */
  insertIntoaddressesCollection?: Maybe<AddressesInsertResponse>;
  /** Adds one or more `auctions` records to the collection */
  insertIntoauctionsCollection?: Maybe<AuctionsInsertResponse>;
  /** Adds one or more `bids` records to the collection */
  insertIntobidsCollection?: Maybe<BidsInsertResponse>;
  /** Adds one or more `card_sets` records to the collection */
  insertIntocard_setsCollection?: Maybe<CardSetsInsertResponse>;
  /** Adds one or more `cards` records to the collection */
  insertIntocardsCollection?: Maybe<CardsInsertResponse>;
  /** Adds one or more `categories` records to the collection */
  insertIntocategoriesCollection?: Maybe<CategoriesInsertResponse>;
  /** Adds one or more `listing_images` records to the collection */
  insertIntolisting_imagesCollection?: Maybe<ListingImagesInsertResponse>;
  /** Adds one or more `listings` records to the collection */
  insertIntolistingsCollection?: Maybe<ListingsInsertResponse>;
  /** Adds one or more `old_table_scraping_cards` records to the collection */
  insertIntoold_table_scraping_cardsCollection?: Maybe<OldTableScrapingCardsInsertResponse>;
  /** Adds one or more `orders` records to the collection */
  insertIntoordersCollection?: Maybe<OrdersInsertResponse>;
  /** Adds one or more `reviews` records to the collection */
  insertIntoreviewsCollection?: Maybe<ReviewsInsertResponse>;
  /** Adds one or more `users` records to the collection */
  insertIntousersCollection?: Maybe<UsersInsertResponse>;
  /** Updates zero or more records in the `addresses` collection */
  updateaddressesCollection: AddressesUpdateResponse;
  /** Updates zero or more records in the `auctions` collection */
  updateauctionsCollection: AuctionsUpdateResponse;
  /** Updates zero or more records in the `bids` collection */
  updatebidsCollection: BidsUpdateResponse;
  /** Updates zero or more records in the `card_sets` collection */
  updatecard_setsCollection: CardSetsUpdateResponse;
  /** Updates zero or more records in the `cards` collection */
  updatecardsCollection: CardsUpdateResponse;
  /** Updates zero or more records in the `categories` collection */
  updatecategoriesCollection: CategoriesUpdateResponse;
  /** Updates zero or more records in the `listing_images` collection */
  updatelisting_imagesCollection: ListingImagesUpdateResponse;
  /** Updates zero or more records in the `listings` collection */
  updatelistingsCollection: ListingsUpdateResponse;
  /** Updates zero or more records in the `old_table_scraping_cards` collection */
  updateold_table_scraping_cardsCollection: OldTableScrapingCardsUpdateResponse;
  /** Updates zero or more records in the `orders` collection */
  updateordersCollection: OrdersUpdateResponse;
  /** Updates zero or more records in the `reviews` collection */
  updatereviewsCollection: ReviewsUpdateResponse;
  /** Updates zero or more records in the `users` collection */
  updateusersCollection: UsersUpdateResponse;
};

/** The root type for creating and mutating data */
export type MutationDeleteFromaddressesCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<AddressesFilter>;
};

/** The root type for creating and mutating data */
export type MutationDeleteFromauctionsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<AuctionsFilter>;
};

/** The root type for creating and mutating data */
export type MutationDeleteFrombidsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<BidsFilter>;
};

/** The root type for creating and mutating data */
export type MutationDeleteFromcardSetsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<CardSetsFilter>;
};

/** The root type for creating and mutating data */
export type MutationDeleteFromcardsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<CardsFilter>;
};

/** The root type for creating and mutating data */
export type MutationDeleteFromcategoriesCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<CategoriesFilter>;
};

/** The root type for creating and mutating data */
export type MutationDeleteFromlistingImagesCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<ListingImagesFilter>;
};

/** The root type for creating and mutating data */
export type MutationDeleteFromlistingsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<ListingsFilter>;
};

/** The root type for creating and mutating data */
export type MutationDeleteFromoldTableScrapingCardsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<OldTableScrapingCardsFilter>;
};

/** The root type for creating and mutating data */
export type MutationDeleteFromordersCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<OrdersFilter>;
};

/** The root type for creating and mutating data */
export type MutationDeleteFromreviewsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<ReviewsFilter>;
};

/** The root type for creating and mutating data */
export type MutationDeleteFromusersCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<UsersFilter>;
};

/** The root type for creating and mutating data */
export type MutationInsertIntoaddressesCollectionArgs = {
  objects: Array<AddressesInsertInput>;
};

/** The root type for creating and mutating data */
export type MutationInsertIntoauctionsCollectionArgs = {
  objects: Array<AuctionsInsertInput>;
};

/** The root type for creating and mutating data */
export type MutationInsertIntobidsCollectionArgs = {
  objects: Array<BidsInsertInput>;
};

/** The root type for creating and mutating data */
export type MutationInsertIntocardSetsCollectionArgs = {
  objects: Array<CardSetsInsertInput>;
};

/** The root type for creating and mutating data */
export type MutationInsertIntocardsCollectionArgs = {
  objects: Array<CardsInsertInput>;
};

/** The root type for creating and mutating data */
export type MutationInsertIntocategoriesCollectionArgs = {
  objects: Array<CategoriesInsertInput>;
};

/** The root type for creating and mutating data */
export type MutationInsertIntolistingImagesCollectionArgs = {
  objects: Array<ListingImagesInsertInput>;
};

/** The root type for creating and mutating data */
export type MutationInsertIntolistingsCollectionArgs = {
  objects: Array<ListingsInsertInput>;
};

/** The root type for creating and mutating data */
export type MutationInsertIntooldTableScrapingCardsCollectionArgs = {
  objects: Array<OldTableScrapingCardsInsertInput>;
};

/** The root type for creating and mutating data */
export type MutationInsertIntoordersCollectionArgs = {
  objects: Array<OrdersInsertInput>;
};

/** The root type for creating and mutating data */
export type MutationInsertIntoreviewsCollectionArgs = {
  objects: Array<ReviewsInsertInput>;
};

/** The root type for creating and mutating data */
export type MutationInsertIntousersCollectionArgs = {
  objects: Array<UsersInsertInput>;
};

/** The root type for creating and mutating data */
export type MutationUpdateaddressesCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<AddressesFilter>;
  set: AddressesUpdateInput;
};

/** The root type for creating and mutating data */
export type MutationUpdateauctionsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<AuctionsFilter>;
  set: AuctionsUpdateInput;
};

/** The root type for creating and mutating data */
export type MutationUpdatebidsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<BidsFilter>;
  set: BidsUpdateInput;
};

/** The root type for creating and mutating data */
export type MutationUpdatecardSetsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<CardSetsFilter>;
  set: CardSetsUpdateInput;
};

/** The root type for creating and mutating data */
export type MutationUpdatecardsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<CardsFilter>;
  set: CardsUpdateInput;
};

/** The root type for creating and mutating data */
export type MutationUpdatecategoriesCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<CategoriesFilter>;
  set: CategoriesUpdateInput;
};

/** The root type for creating and mutating data */
export type MutationUpdatelistingImagesCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<ListingImagesFilter>;
  set: ListingImagesUpdateInput;
};

/** The root type for creating and mutating data */
export type MutationUpdatelistingsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<ListingsFilter>;
  set: ListingsUpdateInput;
};

/** The root type for creating and mutating data */
export type MutationUpdateoldTableScrapingCardsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<OldTableScrapingCardsFilter>;
  set: OldTableScrapingCardsUpdateInput;
};

/** The root type for creating and mutating data */
export type MutationUpdateordersCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<OrdersFilter>;
  set: OrdersUpdateInput;
};

/** The root type for creating and mutating data */
export type MutationUpdatereviewsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<ReviewsFilter>;
  set: ReviewsUpdateInput;
};

/** The root type for creating and mutating data */
export type MutationUpdateusersCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<UsersFilter>;
  set: UsersUpdateInput;
};

export type Node = {
  /** Retrieves a record by `ID` */
  nodeId: Scalars['ID']['output'];
};

/** Boolean expression comparing fields on type "Opaque" */
export type OpaqueFilter = {
  eq?: InputMaybe<Scalars['Opaque']['input']>;
  is?: InputMaybe<FilterIs>;
};

/** Defines a per-field sorting order */
export enum OrderByDirection {
  /** Ascending order, nulls first */
  ASCNULLSFIRST = 'AscNullsFirst',
  /** Ascending order, nulls last */
  ASCNULLSLAST = 'AscNullsLast',
  /** Descending order, nulls first */
  DESCNULLSFIRST = 'DescNullsFirst',
  /** Descending order, nulls last */
  DESCNULLSLAST = 'DescNullsLast',
}

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

/** The root type for querying data */
export type Query = {
  __typename?: 'Query';
  /** A pagable collection of type `addresses` */
  addressesCollection?: Maybe<AddressesConnection>;
  /** A pagable collection of type `auctions` */
  auctionsCollection?: Maybe<AuctionsConnection>;
  /** A pagable collection of type `bids` */
  bidsCollection?: Maybe<BidsConnection>;
  /** A pagable collection of type `card_sets` */
  card_setsCollection?: Maybe<CardSetsConnection>;
  /** A pagable collection of type `cards` */
  cardsCollection?: Maybe<CardsConnection>;
  /** A pagable collection of type `categories` */
  categoriesCollection?: Maybe<CategoriesConnection>;
  /** A pagable collection of type `listing_images` */
  listing_imagesCollection?: Maybe<ListingImagesConnection>;
  /** A pagable collection of type `listings` */
  listingsCollection?: Maybe<ListingsConnection>;
  /** Retrieve a record by its `ID` */
  node?: Maybe<Node>;
  /** A pagable collection of type `old_table_scraping_cards` */
  old_table_scraping_cardsCollection?: Maybe<OldTableScrapingCardsConnection>;
  /** A pagable collection of type `orders` */
  ordersCollection?: Maybe<OrdersConnection>;
  /** A pagable collection of type `reviews` */
  reviewsCollection?: Maybe<ReviewsConnection>;
  /** A pagable collection of type `users` */
  usersCollection?: Maybe<UsersConnection>;
};

/** The root type for querying data */
export type QueryAddressesCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<AddressesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AddressesOrderBy>>;
};

/** The root type for querying data */
export type QueryAuctionsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<AuctionsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuctionsOrderBy>>;
};

/** The root type for querying data */
export type QueryBidsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<BidsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BidsOrderBy>>;
};

/** The root type for querying data */
export type QueryCardSetsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<CardSetsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CardSetsOrderBy>>;
};

/** The root type for querying data */
export type QueryCardsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<CardsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CardsOrderBy>>;
};

/** The root type for querying data */
export type QueryCategoriesCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<CategoriesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CategoriesOrderBy>>;
};

/** The root type for querying data */
export type QueryListingImagesCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<ListingImagesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ListingImagesOrderBy>>;
};

/** The root type for querying data */
export type QueryListingsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<ListingsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ListingsOrderBy>>;
};

/** The root type for querying data */
export type QueryNodeArgs = {
  nodeId: Scalars['ID']['input'];
};

/** The root type for querying data */
export type QueryOldTableScrapingCardsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<OldTableScrapingCardsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<OldTableScrapingCardsOrderBy>>;
};

/** The root type for querying data */
export type QueryOrdersCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<OrdersFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<OrdersOrderBy>>;
};

/** The root type for querying data */
export type QueryReviewsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<ReviewsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ReviewsOrderBy>>;
};

/** The root type for querying data */
export type QueryUsersCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<UsersFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
};

/** Boolean expression comparing fields on type "String" */
export type StringFilter = {
  eq?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  iregex?: InputMaybe<Scalars['String']['input']>;
  is?: InputMaybe<FilterIs>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  neq?: InputMaybe<Scalars['String']['input']>;
  regex?: InputMaybe<Scalars['String']['input']>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression comparing fields on type "StringList" */
export type StringListFilter = {
  containedBy?: InputMaybe<Array<Scalars['String']['input']>>;
  contains?: InputMaybe<Array<Scalars['String']['input']>>;
  eq?: InputMaybe<Array<Scalars['String']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Boolean expression comparing fields on type "Time" */
export type TimeFilter = {
  eq?: InputMaybe<Scalars['Time']['input']>;
  gt?: InputMaybe<Scalars['Time']['input']>;
  gte?: InputMaybe<Scalars['Time']['input']>;
  in?: InputMaybe<Array<Scalars['Time']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Time']['input']>;
  lte?: InputMaybe<Scalars['Time']['input']>;
  neq?: InputMaybe<Scalars['Time']['input']>;
};

/** Boolean expression comparing fields on type "TimeList" */
export type TimeListFilter = {
  containedBy?: InputMaybe<Array<Scalars['Time']['input']>>;
  contains?: InputMaybe<Array<Scalars['Time']['input']>>;
  eq?: InputMaybe<Array<Scalars['Time']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['Time']['input']>>;
};

/** Boolean expression comparing fields on type "UUID" */
export type UuidFilter = {
  eq?: InputMaybe<Scalars['UUID']['input']>;
  in?: InputMaybe<Array<Scalars['UUID']['input']>>;
  is?: InputMaybe<FilterIs>;
  neq?: InputMaybe<Scalars['UUID']['input']>;
};

/** Boolean expression comparing fields on type "UUIDList" */
export type UuidListFilter = {
  containedBy?: InputMaybe<Array<Scalars['UUID']['input']>>;
  contains?: InputMaybe<Array<Scalars['UUID']['input']>>;
  eq?: InputMaybe<Array<Scalars['UUID']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['UUID']['input']>>;
};

export type Addresses = Node & {
  __typename?: 'addresses';
  country: Scalars['String']['output'];
  created_at: Scalars['Datetime']['output'];
  full_address: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  is_primary?: Maybe<Scalars['Boolean']['output']>;
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  user_id: Scalars['UUID']['output'];
  users?: Maybe<Users>;
};

export type AddressesConnection = {
  __typename?: 'addressesConnection';
  edges: Array<AddressesEdge>;
  pageInfo: PageInfo;
};

export type AddressesDeleteResponse = {
  __typename?: 'addressesDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Addresses>;
};

export type AddressesEdge = {
  __typename?: 'addressesEdge';
  cursor: Scalars['String']['output'];
  node: Addresses;
};

export type AddressesFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<AddressesFilter>>;
  country?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  full_address?: InputMaybe<StringFilter>;
  id?: InputMaybe<UuidFilter>;
  is_primary?: InputMaybe<BooleanFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<AddressesFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<AddressesFilter>>;
  user_id?: InputMaybe<UuidFilter>;
};

export type AddressesInsertInput = {
  country?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  full_address?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  is_primary?: InputMaybe<Scalars['Boolean']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type AddressesInsertResponse = {
  __typename?: 'addressesInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Addresses>;
};

export type AddressesOrderBy = {
  country?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  full_address?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  is_primary?: InputMaybe<OrderByDirection>;
  user_id?: InputMaybe<OrderByDirection>;
};

export type AddressesUpdateInput = {
  country?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  full_address?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  is_primary?: InputMaybe<Scalars['Boolean']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type AddressesUpdateResponse = {
  __typename?: 'addressesUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Addresses>;
};

export type Auctions = Node & {
  __typename?: 'auctions';
  bid_increment: Scalars['BigFloat']['output'];
  bids?: Maybe<Bids>;
  bidsCollection?: Maybe<BidsConnection>;
  current_bid?: Maybe<Scalars['BigFloat']['output']>;
  listing_id: Scalars['UUID']['output'];
  listings?: Maybe<Listings>;
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  start_price: Scalars['BigFloat']['output'];
  winning_bid_id?: Maybe<Scalars['UUID']['output']>;
};

export type AuctionsBidsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<BidsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BidsOrderBy>>;
};

export type AuctionsConnection = {
  __typename?: 'auctionsConnection';
  edges: Array<AuctionsEdge>;
  pageInfo: PageInfo;
};

export type AuctionsDeleteResponse = {
  __typename?: 'auctionsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Auctions>;
};

export type AuctionsEdge = {
  __typename?: 'auctionsEdge';
  cursor: Scalars['String']['output'];
  node: Auctions;
};

export type AuctionsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<AuctionsFilter>>;
  bid_increment?: InputMaybe<BigFloatFilter>;
  current_bid?: InputMaybe<BigFloatFilter>;
  listing_id?: InputMaybe<UuidFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<AuctionsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<AuctionsFilter>>;
  start_price?: InputMaybe<BigFloatFilter>;
  winning_bid_id?: InputMaybe<UuidFilter>;
};

export type AuctionsInsertInput = {
  bid_increment?: InputMaybe<Scalars['BigFloat']['input']>;
  current_bid?: InputMaybe<Scalars['BigFloat']['input']>;
  listing_id?: InputMaybe<Scalars['UUID']['input']>;
  start_price?: InputMaybe<Scalars['BigFloat']['input']>;
  winning_bid_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type AuctionsInsertResponse = {
  __typename?: 'auctionsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Auctions>;
};

export type AuctionsOrderBy = {
  bid_increment?: InputMaybe<OrderByDirection>;
  current_bid?: InputMaybe<OrderByDirection>;
  listing_id?: InputMaybe<OrderByDirection>;
  start_price?: InputMaybe<OrderByDirection>;
  winning_bid_id?: InputMaybe<OrderByDirection>;
};

export type AuctionsUpdateInput = {
  bid_increment?: InputMaybe<Scalars['BigFloat']['input']>;
  current_bid?: InputMaybe<Scalars['BigFloat']['input']>;
  listing_id?: InputMaybe<Scalars['UUID']['input']>;
  start_price?: InputMaybe<Scalars['BigFloat']['input']>;
  winning_bid_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type AuctionsUpdateResponse = {
  __typename?: 'auctionsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Auctions>;
};

export type Bids = Node & {
  __typename?: 'bids';
  amount: Scalars['BigFloat']['output'];
  auction_listing_id: Scalars['UUID']['output'];
  auctions?: Maybe<Auctions>;
  auctionsCollection?: Maybe<AuctionsConnection>;
  bidder_id: Scalars['UUID']['output'];
  created_at: Scalars['Datetime']['output'];
  id: Scalars['UUID']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  users?: Maybe<Users>;
};

export type BidsAuctionsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<AuctionsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuctionsOrderBy>>;
};

export type BidsConnection = {
  __typename?: 'bidsConnection';
  edges: Array<BidsEdge>;
  pageInfo: PageInfo;
};

export type BidsDeleteResponse = {
  __typename?: 'bidsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Bids>;
};

export type BidsEdge = {
  __typename?: 'bidsEdge';
  cursor: Scalars['String']['output'];
  node: Bids;
};

export type BidsFilter = {
  amount?: InputMaybe<BigFloatFilter>;
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<BidsFilter>>;
  auction_listing_id?: InputMaybe<UuidFilter>;
  bidder_id?: InputMaybe<UuidFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<UuidFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<BidsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<BidsFilter>>;
};

export type BidsInsertInput = {
  amount?: InputMaybe<Scalars['BigFloat']['input']>;
  auction_listing_id?: InputMaybe<Scalars['UUID']['input']>;
  bidder_id?: InputMaybe<Scalars['UUID']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};

export type BidsInsertResponse = {
  __typename?: 'bidsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Bids>;
};

export type BidsOrderBy = {
  amount?: InputMaybe<OrderByDirection>;
  auction_listing_id?: InputMaybe<OrderByDirection>;
  bidder_id?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
};

export type BidsUpdateInput = {
  amount?: InputMaybe<Scalars['BigFloat']['input']>;
  auction_listing_id?: InputMaybe<Scalars['UUID']['input']>;
  bidder_id?: InputMaybe<Scalars['UUID']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};

export type BidsUpdateResponse = {
  __typename?: 'bidsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Bids>;
};

export type CardSets = Node & {
  __typename?: 'card_sets';
  cardsCollection?: Maybe<CardsConnection>;
  categories: Categories;
  category_id: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  year?: Maybe<Scalars['Int']['output']>;
};

export type CardSetsCardsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<CardsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CardsOrderBy>>;
};

export type CardSetsConnection = {
  __typename?: 'card_setsConnection';
  edges: Array<CardSetsEdge>;
  pageInfo: PageInfo;
};

export type CardSetsDeleteResponse = {
  __typename?: 'card_setsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<CardSets>;
};

export type CardSetsEdge = {
  __typename?: 'card_setsEdge';
  cursor: Scalars['String']['output'];
  node: CardSets;
};

export type CardSetsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<CardSetsFilter>>;
  category_id?: InputMaybe<IntFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<CardSetsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<CardSetsFilter>>;
  year?: InputMaybe<IntFilter>;
};

export type CardSetsInsertInput = {
  category_id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type CardSetsInsertResponse = {
  __typename?: 'card_setsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<CardSets>;
};

export type CardSetsOrderBy = {
  category_id?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  name?: InputMaybe<OrderByDirection>;
  year?: InputMaybe<OrderByDirection>;
};

export type CardSetsUpdateInput = {
  category_id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type CardSetsUpdateResponse = {
  __typename?: 'card_setsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<CardSets>;
};

export enum CardSource {
  SCRAPED_EBAY = 'scraped_ebay',
  USER_POSTED = 'user_posted',
}

/** Boolean expression comparing fields on type "card_source" */
export type CardSourceFilter = {
  eq?: InputMaybe<CardSource>;
  in?: InputMaybe<Array<CardSource>>;
  is?: InputMaybe<FilterIs>;
  neq?: InputMaybe<CardSource>;
};

export type Cards = Node & {
  __typename?: 'cards';
  card_number?: Maybe<Scalars['String']['output']>;
  card_sets?: Maybe<CardSets>;
  categories: Categories;
  category_id: Scalars['Int']['output'];
  grade?: Maybe<Scalars['String']['output']>;
  grading_company?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  is_graded: Scalars['Boolean']['output'];
  listingsCollection?: Maybe<ListingsConnection>;
  name: Scalars['String']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  player_name?: Maybe<Scalars['String']['output']>;
  rarity?: Maybe<Scalars['String']['output']>;
  set_id?: Maybe<Scalars['Int']['output']>;
  source: CardSource;
  team_name?: Maybe<Scalars['String']['output']>;
};

export type CardsListingsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<ListingsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ListingsOrderBy>>;
};

export type CardsConnection = {
  __typename?: 'cardsConnection';
  edges: Array<CardsEdge>;
  pageInfo: PageInfo;
};

export type CardsDeleteResponse = {
  __typename?: 'cardsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Cards>;
};

export type CardsEdge = {
  __typename?: 'cardsEdge';
  cursor: Scalars['String']['output'];
  node: Cards;
};

export type CardsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<CardsFilter>>;
  card_number?: InputMaybe<StringFilter>;
  category_id?: InputMaybe<IntFilter>;
  grade?: InputMaybe<StringFilter>;
  grading_company?: InputMaybe<StringFilter>;
  id?: InputMaybe<UuidFilter>;
  is_graded?: InputMaybe<BooleanFilter>;
  name?: InputMaybe<StringFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<CardsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<CardsFilter>>;
  player_name?: InputMaybe<StringFilter>;
  rarity?: InputMaybe<StringFilter>;
  set_id?: InputMaybe<IntFilter>;
  source?: InputMaybe<CardSourceFilter>;
  team_name?: InputMaybe<StringFilter>;
};

export type CardsInsertInput = {
  card_number?: InputMaybe<Scalars['String']['input']>;
  category_id?: InputMaybe<Scalars['Int']['input']>;
  grade?: InputMaybe<Scalars['String']['input']>;
  grading_company?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  is_graded?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  player_name?: InputMaybe<Scalars['String']['input']>;
  rarity?: InputMaybe<Scalars['String']['input']>;
  set_id?: InputMaybe<Scalars['Int']['input']>;
  source?: InputMaybe<CardSource>;
  team_name?: InputMaybe<Scalars['String']['input']>;
};

export type CardsInsertResponse = {
  __typename?: 'cardsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Cards>;
};

export type CardsOrderBy = {
  card_number?: InputMaybe<OrderByDirection>;
  category_id?: InputMaybe<OrderByDirection>;
  grade?: InputMaybe<OrderByDirection>;
  grading_company?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  is_graded?: InputMaybe<OrderByDirection>;
  name?: InputMaybe<OrderByDirection>;
  player_name?: InputMaybe<OrderByDirection>;
  rarity?: InputMaybe<OrderByDirection>;
  set_id?: InputMaybe<OrderByDirection>;
  source?: InputMaybe<OrderByDirection>;
  team_name?: InputMaybe<OrderByDirection>;
};

export type CardsUpdateInput = {
  card_number?: InputMaybe<Scalars['String']['input']>;
  category_id?: InputMaybe<Scalars['Int']['input']>;
  grade?: InputMaybe<Scalars['String']['input']>;
  grading_company?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  is_graded?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  player_name?: InputMaybe<Scalars['String']['input']>;
  rarity?: InputMaybe<Scalars['String']['input']>;
  set_id?: InputMaybe<Scalars['Int']['input']>;
  source?: InputMaybe<CardSource>;
  team_name?: InputMaybe<Scalars['String']['input']>;
};

export type CardsUpdateResponse = {
  __typename?: 'cardsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Cards>;
};

export type Categories = Node & {
  __typename?: 'categories';
  card_setsCollection?: Maybe<CardSetsConnection>;
  cardsCollection?: Maybe<CardsConnection>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  type: CategoryType;
};

export type CategoriesCardSetsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<CardSetsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CardSetsOrderBy>>;
};

export type CategoriesCardsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<CardsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CardsOrderBy>>;
};

export type CategoriesConnection = {
  __typename?: 'categoriesConnection';
  edges: Array<CategoriesEdge>;
  pageInfo: PageInfo;
};

export type CategoriesDeleteResponse = {
  __typename?: 'categoriesDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Categories>;
};

export type CategoriesEdge = {
  __typename?: 'categoriesEdge';
  cursor: Scalars['String']['output'];
  node: Categories;
};

export type CategoriesFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<CategoriesFilter>>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<CategoriesFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<CategoriesFilter>>;
  type?: InputMaybe<CategoryTypeFilter>;
};

export type CategoriesInsertInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<CategoryType>;
};

export type CategoriesInsertResponse = {
  __typename?: 'categoriesInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Categories>;
};

export type CategoriesOrderBy = {
  id?: InputMaybe<OrderByDirection>;
  name?: InputMaybe<OrderByDirection>;
  type?: InputMaybe<OrderByDirection>;
};

export type CategoriesUpdateInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<CategoryType>;
};

export type CategoriesUpdateResponse = {
  __typename?: 'categoriesUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Categories>;
};

export enum CategoryType {
  OTHER = 'other',
  POPULAR = 'popular',
}

/** Boolean expression comparing fields on type "category_type" */
export type CategoryTypeFilter = {
  eq?: InputMaybe<CategoryType>;
  in?: InputMaybe<Array<CategoryType>>;
  is?: InputMaybe<FilterIs>;
  neq?: InputMaybe<CategoryType>;
};

export enum IdVerificationStatus {
  APPROVED = 'approved',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

/** Boolean expression comparing fields on type "id_verification_status" */
export type IdVerificationStatusFilter = {
  eq?: InputMaybe<IdVerificationStatus>;
  in?: InputMaybe<Array<IdVerificationStatus>>;
  is?: InputMaybe<FilterIs>;
  neq?: InputMaybe<IdVerificationStatus>;
};

export type ListingImages = Node & {
  __typename?: 'listing_images';
  id: Scalars['UUID']['output'];
  image_url: Scalars['String']['output'];
  listing_id: Scalars['UUID']['output'];
  listings?: Maybe<Listings>;
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  sort_order?: Maybe<Scalars['Int']['output']>;
};

export type ListingImagesConnection = {
  __typename?: 'listing_imagesConnection';
  edges: Array<ListingImagesEdge>;
  pageInfo: PageInfo;
};

export type ListingImagesDeleteResponse = {
  __typename?: 'listing_imagesDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<ListingImages>;
};

export type ListingImagesEdge = {
  __typename?: 'listing_imagesEdge';
  cursor: Scalars['String']['output'];
  node: ListingImages;
};

export type ListingImagesFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<ListingImagesFilter>>;
  id?: InputMaybe<UuidFilter>;
  image_url?: InputMaybe<StringFilter>;
  listing_id?: InputMaybe<UuidFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<ListingImagesFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<ListingImagesFilter>>;
  sort_order?: InputMaybe<IntFilter>;
};

export type ListingImagesInsertInput = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  listing_id?: InputMaybe<Scalars['UUID']['input']>;
  sort_order?: InputMaybe<Scalars['Int']['input']>;
};

export type ListingImagesInsertResponse = {
  __typename?: 'listing_imagesInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<ListingImages>;
};

export type ListingImagesOrderBy = {
  id?: InputMaybe<OrderByDirection>;
  image_url?: InputMaybe<OrderByDirection>;
  listing_id?: InputMaybe<OrderByDirection>;
  sort_order?: InputMaybe<OrderByDirection>;
};

export type ListingImagesUpdateInput = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  listing_id?: InputMaybe<Scalars['UUID']['input']>;
  sort_order?: InputMaybe<Scalars['Int']['input']>;
};

export type ListingImagesUpdateResponse = {
  __typename?: 'listing_imagesUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<ListingImages>;
};

export enum ListingStatus {
  ACTIVE = 'active',
  DELISTED = 'delisted',
  EXPIRED = 'expired',
  SOLD = 'sold',
}

/** Boolean expression comparing fields on type "listing_status" */
export type ListingStatusFilter = {
  eq?: InputMaybe<ListingStatus>;
  in?: InputMaybe<Array<ListingStatus>>;
  is?: InputMaybe<FilterIs>;
  neq?: InputMaybe<ListingStatus>;
};

export enum ListingType {
  AUCTION = 'auction',
  FIXED_PRICE = 'fixed_price',
}

/** Boolean expression comparing fields on type "listing_type" */
export type ListingTypeFilter = {
  eq?: InputMaybe<ListingType>;
  in?: InputMaybe<Array<ListingType>>;
  is?: InputMaybe<FilterIs>;
  neq?: InputMaybe<ListingType>;
};

export type Listings = Node & {
  __typename?: 'listings';
  auctions?: Maybe<Auctions>;
  card_id: Scalars['UUID']['output'];
  cards?: Maybe<Cards>;
  created_at: Scalars['Datetime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  ends_at?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['UUID']['output'];
  is_boosted?: Maybe<Scalars['Boolean']['output']>;
  listing_imagesCollection?: Maybe<ListingImagesConnection>;
  listing_type: ListingType;
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  orders?: Maybe<Orders>;
  price?: Maybe<Scalars['BigFloat']['output']>;
  seller_id: Scalars['UUID']['output'];
  status: ListingStatus;
  updated_at: Scalars['Datetime']['output'];
  users?: Maybe<Users>;
};

export type ListingsListingImagesCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<ListingImagesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ListingImagesOrderBy>>;
};

export type ListingsConnection = {
  __typename?: 'listingsConnection';
  edges: Array<ListingsEdge>;
  pageInfo: PageInfo;
};

export type ListingsDeleteResponse = {
  __typename?: 'listingsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Listings>;
};

export type ListingsEdge = {
  __typename?: 'listingsEdge';
  cursor: Scalars['String']['output'];
  node: Listings;
};

export type ListingsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<ListingsFilter>>;
  card_id?: InputMaybe<UuidFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  description?: InputMaybe<StringFilter>;
  ends_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<UuidFilter>;
  is_boosted?: InputMaybe<BooleanFilter>;
  listing_type?: InputMaybe<ListingTypeFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<ListingsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<ListingsFilter>>;
  price?: InputMaybe<BigFloatFilter>;
  seller_id?: InputMaybe<UuidFilter>;
  status?: InputMaybe<ListingStatusFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
};

export type ListingsInsertInput = {
  card_id?: InputMaybe<Scalars['UUID']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  ends_at?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  is_boosted?: InputMaybe<Scalars['Boolean']['input']>;
  listing_type?: InputMaybe<ListingType>;
  price?: InputMaybe<Scalars['BigFloat']['input']>;
  seller_id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<ListingStatus>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
};

export type ListingsInsertResponse = {
  __typename?: 'listingsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Listings>;
};

export type ListingsOrderBy = {
  card_id?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  description?: InputMaybe<OrderByDirection>;
  ends_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  is_boosted?: InputMaybe<OrderByDirection>;
  listing_type?: InputMaybe<OrderByDirection>;
  price?: InputMaybe<OrderByDirection>;
  seller_id?: InputMaybe<OrderByDirection>;
  status?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
};

export type ListingsUpdateInput = {
  card_id?: InputMaybe<Scalars['UUID']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  ends_at?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  is_boosted?: InputMaybe<Scalars['Boolean']['input']>;
  listing_type?: InputMaybe<ListingType>;
  price?: InputMaybe<Scalars['BigFloat']['input']>;
  seller_id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<ListingStatus>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
};

export type ListingsUpdateResponse = {
  __typename?: 'listingsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Listings>;
};

export type OldTableScrapingCards = Node & {
  __typename?: 'old_table_scraping_cards';
  created_at: Scalars['Datetime']['output'];
  id: Scalars['UUID']['output'];
  image_url?: Maybe<Scalars['String']['output']>;
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  sold_cards?: Maybe<Scalars['JSON']['output']>;
  title: Scalars['String']['output'];
  updated_at: Scalars['Datetime']['output'];
};

export type OldTableScrapingCardsConnection = {
  __typename?: 'old_table_scraping_cardsConnection';
  edges: Array<OldTableScrapingCardsEdge>;
  pageInfo: PageInfo;
};

export type OldTableScrapingCardsDeleteResponse = {
  __typename?: 'old_table_scraping_cardsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<OldTableScrapingCards>;
};

export type OldTableScrapingCardsEdge = {
  __typename?: 'old_table_scraping_cardsEdge';
  cursor: Scalars['String']['output'];
  node: OldTableScrapingCards;
};

export type OldTableScrapingCardsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<OldTableScrapingCardsFilter>>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<UuidFilter>;
  image_url?: InputMaybe<StringFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<OldTableScrapingCardsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<OldTableScrapingCardsFilter>>;
  title?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
};

export type OldTableScrapingCardsInsertInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  sold_cards?: InputMaybe<Scalars['JSON']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
};

export type OldTableScrapingCardsInsertResponse = {
  __typename?: 'old_table_scraping_cardsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<OldTableScrapingCards>;
};

export type OldTableScrapingCardsOrderBy = {
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  image_url?: InputMaybe<OrderByDirection>;
  title?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
};

export type OldTableScrapingCardsUpdateInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  sold_cards?: InputMaybe<Scalars['JSON']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
};

export type OldTableScrapingCardsUpdateResponse = {
  __typename?: 'old_table_scraping_cardsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<OldTableScrapingCards>;
};

export enum OrderStatus {
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  DELIVERED = 'delivered',
  PAYMENT_SECURED = 'payment_secured',
  PENDING_PAYMENT = 'pending_payment',
  REFUND_REQUESTED = 'refund_requested',
  REFUNDED = 'refunded',
  SHIPPED = 'shipped',
}

/** Boolean expression comparing fields on type "order_status" */
export type OrderStatusFilter = {
  eq?: InputMaybe<OrderStatus>;
  in?: InputMaybe<Array<OrderStatus>>;
  is?: InputMaybe<FilterIs>;
  neq?: InputMaybe<OrderStatus>;
};

export type Orders = Node & {
  __typename?: 'orders';
  buyer_id: Scalars['UUID']['output'];
  completed_at?: Maybe<Scalars['Datetime']['output']>;
  created_at: Scalars['Datetime']['output'];
  delivered_at?: Maybe<Scalars['Datetime']['output']>;
  final_price: Scalars['BigFloat']['output'];
  id: Scalars['UUID']['output'];
  listing_id: Scalars['UUID']['output'];
  listings?: Maybe<Listings>;
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  paid_at?: Maybe<Scalars['Datetime']['output']>;
  payment_provider_txn_id?: Maybe<Scalars['String']['output']>;
  platform_fee: Scalars['BigFloat']['output'];
  reviews?: Maybe<Reviews>;
  seller_id: Scalars['UUID']['output'];
  shipped_at?: Maybe<Scalars['Datetime']['output']>;
  shipping_address: Scalars['String']['output'];
  shipping_cost?: Maybe<Scalars['BigFloat']['output']>;
  status: OrderStatus;
  total_amount: Scalars['BigFloat']['output'];
  tracking_number?: Maybe<Scalars['String']['output']>;
  users?: Maybe<Users>;
};

export type OrdersConnection = {
  __typename?: 'ordersConnection';
  edges: Array<OrdersEdge>;
  pageInfo: PageInfo;
};

export type OrdersDeleteResponse = {
  __typename?: 'ordersDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Orders>;
};

export type OrdersEdge = {
  __typename?: 'ordersEdge';
  cursor: Scalars['String']['output'];
  node: Orders;
};

export type OrdersFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<OrdersFilter>>;
  buyer_id?: InputMaybe<UuidFilter>;
  completed_at?: InputMaybe<DatetimeFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  delivered_at?: InputMaybe<DatetimeFilter>;
  final_price?: InputMaybe<BigFloatFilter>;
  id?: InputMaybe<UuidFilter>;
  listing_id?: InputMaybe<UuidFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<OrdersFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<OrdersFilter>>;
  paid_at?: InputMaybe<DatetimeFilter>;
  payment_provider_txn_id?: InputMaybe<StringFilter>;
  platform_fee?: InputMaybe<BigFloatFilter>;
  seller_id?: InputMaybe<UuidFilter>;
  shipped_at?: InputMaybe<DatetimeFilter>;
  shipping_address?: InputMaybe<StringFilter>;
  shipping_cost?: InputMaybe<BigFloatFilter>;
  status?: InputMaybe<OrderStatusFilter>;
  total_amount?: InputMaybe<BigFloatFilter>;
  tracking_number?: InputMaybe<StringFilter>;
};

export type OrdersInsertInput = {
  buyer_id?: InputMaybe<Scalars['UUID']['input']>;
  completed_at?: InputMaybe<Scalars['Datetime']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  delivered_at?: InputMaybe<Scalars['Datetime']['input']>;
  final_price?: InputMaybe<Scalars['BigFloat']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  listing_id?: InputMaybe<Scalars['UUID']['input']>;
  paid_at?: InputMaybe<Scalars['Datetime']['input']>;
  payment_provider_txn_id?: InputMaybe<Scalars['String']['input']>;
  platform_fee?: InputMaybe<Scalars['BigFloat']['input']>;
  seller_id?: InputMaybe<Scalars['UUID']['input']>;
  shipped_at?: InputMaybe<Scalars['Datetime']['input']>;
  shipping_address?: InputMaybe<Scalars['String']['input']>;
  shipping_cost?: InputMaybe<Scalars['BigFloat']['input']>;
  status?: InputMaybe<OrderStatus>;
  total_amount?: InputMaybe<Scalars['BigFloat']['input']>;
  tracking_number?: InputMaybe<Scalars['String']['input']>;
};

export type OrdersInsertResponse = {
  __typename?: 'ordersInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Orders>;
};

export type OrdersOrderBy = {
  buyer_id?: InputMaybe<OrderByDirection>;
  completed_at?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  delivered_at?: InputMaybe<OrderByDirection>;
  final_price?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  listing_id?: InputMaybe<OrderByDirection>;
  paid_at?: InputMaybe<OrderByDirection>;
  payment_provider_txn_id?: InputMaybe<OrderByDirection>;
  platform_fee?: InputMaybe<OrderByDirection>;
  seller_id?: InputMaybe<OrderByDirection>;
  shipped_at?: InputMaybe<OrderByDirection>;
  shipping_address?: InputMaybe<OrderByDirection>;
  shipping_cost?: InputMaybe<OrderByDirection>;
  status?: InputMaybe<OrderByDirection>;
  total_amount?: InputMaybe<OrderByDirection>;
  tracking_number?: InputMaybe<OrderByDirection>;
};

export type OrdersUpdateInput = {
  buyer_id?: InputMaybe<Scalars['UUID']['input']>;
  completed_at?: InputMaybe<Scalars['Datetime']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  delivered_at?: InputMaybe<Scalars['Datetime']['input']>;
  final_price?: InputMaybe<Scalars['BigFloat']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  listing_id?: InputMaybe<Scalars['UUID']['input']>;
  paid_at?: InputMaybe<Scalars['Datetime']['input']>;
  payment_provider_txn_id?: InputMaybe<Scalars['String']['input']>;
  platform_fee?: InputMaybe<Scalars['BigFloat']['input']>;
  seller_id?: InputMaybe<Scalars['UUID']['input']>;
  shipped_at?: InputMaybe<Scalars['Datetime']['input']>;
  shipping_address?: InputMaybe<Scalars['String']['input']>;
  shipping_cost?: InputMaybe<Scalars['BigFloat']['input']>;
  status?: InputMaybe<OrderStatus>;
  total_amount?: InputMaybe<Scalars['BigFloat']['input']>;
  tracking_number?: InputMaybe<Scalars['String']['input']>;
};

export type OrdersUpdateResponse = {
  __typename?: 'ordersUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Orders>;
};

export type Reviews = Node & {
  __typename?: 'reviews';
  comment?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['Datetime']['output'];
  id: Scalars['UUID']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  order_id: Scalars['UUID']['output'];
  orders?: Maybe<Orders>;
  rating: Scalars['Int']['output'];
  reviewee_id: Scalars['UUID']['output'];
  reviewer_id: Scalars['UUID']['output'];
  users?: Maybe<Users>;
};

export type ReviewsConnection = {
  __typename?: 'reviewsConnection';
  edges: Array<ReviewsEdge>;
  pageInfo: PageInfo;
};

export type ReviewsDeleteResponse = {
  __typename?: 'reviewsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Reviews>;
};

export type ReviewsEdge = {
  __typename?: 'reviewsEdge';
  cursor: Scalars['String']['output'];
  node: Reviews;
};

export type ReviewsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<ReviewsFilter>>;
  comment?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<UuidFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<ReviewsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<ReviewsFilter>>;
  order_id?: InputMaybe<UuidFilter>;
  rating?: InputMaybe<IntFilter>;
  reviewee_id?: InputMaybe<UuidFilter>;
  reviewer_id?: InputMaybe<UuidFilter>;
};

export type ReviewsInsertInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  order_id?: InputMaybe<Scalars['UUID']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
  reviewee_id?: InputMaybe<Scalars['UUID']['input']>;
  reviewer_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type ReviewsInsertResponse = {
  __typename?: 'reviewsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Reviews>;
};

export type ReviewsOrderBy = {
  comment?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  order_id?: InputMaybe<OrderByDirection>;
  rating?: InputMaybe<OrderByDirection>;
  reviewee_id?: InputMaybe<OrderByDirection>;
  reviewer_id?: InputMaybe<OrderByDirection>;
};

export type ReviewsUpdateInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  order_id?: InputMaybe<Scalars['UUID']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
  reviewee_id?: InputMaybe<Scalars['UUID']['input']>;
  reviewer_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type ReviewsUpdateResponse = {
  __typename?: 'reviewsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Reviews>;
};

export enum UserTier {
  FREE = 'free',
  GOLD = 'gold',
}

/** Boolean expression comparing fields on type "user_tier" */
export type UserTierFilter = {
  eq?: InputMaybe<UserTier>;
  in?: InputMaybe<Array<UserTier>>;
  is?: InputMaybe<FilterIs>;
  neq?: InputMaybe<UserTier>;
};

export type Users = Node & {
  __typename?: 'users';
  addressesCollection?: Maybe<AddressesConnection>;
  bidsCollection?: Maybe<BidsConnection>;
  created_at: Scalars['Datetime']['output'];
  id: Scalars['UUID']['output'];
  id_document_url?: Maybe<Scalars['String']['output']>;
  id_verification_status: IdVerificationStatus;
  listingsCollection?: Maybe<ListingsConnection>;
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  ordersCollection?: Maybe<OrdersConnection>;
  phone_number?: Maybe<Scalars['String']['output']>;
  reviewsCollection?: Maybe<ReviewsConnection>;
  tier: UserTier;
  updated_at: Scalars['Datetime']['output'];
  username: Scalars['String']['output'];
};

export type UsersAddressesCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<AddressesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AddressesOrderBy>>;
};

export type UsersBidsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<BidsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BidsOrderBy>>;
};

export type UsersListingsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<ListingsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ListingsOrderBy>>;
};

export type UsersOrdersCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<OrdersFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<OrdersOrderBy>>;
};

export type UsersReviewsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<ReviewsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ReviewsOrderBy>>;
};

export type UsersConnection = {
  __typename?: 'usersConnection';
  edges: Array<UsersEdge>;
  pageInfo: PageInfo;
};

export type UsersDeleteResponse = {
  __typename?: 'usersDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Users>;
};

export type UsersEdge = {
  __typename?: 'usersEdge';
  cursor: Scalars['String']['output'];
  node: Users;
};

export type UsersFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<UsersFilter>>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<UuidFilter>;
  id_document_url?: InputMaybe<StringFilter>;
  id_verification_status?: InputMaybe<IdVerificationStatusFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<UsersFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<UsersFilter>>;
  phone_number?: InputMaybe<StringFilter>;
  tier?: InputMaybe<UserTierFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
  username?: InputMaybe<StringFilter>;
};

export type UsersInsertInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  id_document_url?: InputMaybe<Scalars['String']['input']>;
  id_verification_status?: InputMaybe<IdVerificationStatus>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
  tier?: InputMaybe<UserTier>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UsersInsertResponse = {
  __typename?: 'usersInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Users>;
};

export type UsersOrderBy = {
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  id_document_url?: InputMaybe<OrderByDirection>;
  id_verification_status?: InputMaybe<OrderByDirection>;
  phone_number?: InputMaybe<OrderByDirection>;
  tier?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
  username?: InputMaybe<OrderByDirection>;
};

export type UsersUpdateInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  id_document_url?: InputMaybe<Scalars['String']['input']>;
  id_verification_status?: InputMaybe<IdVerificationStatus>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
  tier?: InputMaybe<UserTier>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UsersUpdateResponse = {
  __typename?: 'usersUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Users>;
};

export type GetCategoriesQueryVariables = Exact<{ [key: string]: never }>;

export type GetCategoriesQuery = {
  __typename?: 'Query';
  categoriesCollection?: {
    __typename?: 'categoriesConnection';
    edges: Array<{
      __typename?: 'categoriesEdge';
      node: {
        __typename?: 'categories';
        id: number;
        name: string;
        type: CategoryType;
      };
    }>;
  } | null;
};

export const GetCategoriesDocument = gql`
  query GetCategories {
    categoriesCollection {
      edges {
        node {
          id
          name
          type
        }
      }
    }
  }
`;

/**
 * __useGetCategoriesQuery__
 *
 * To run a query within a React component, call `useGetCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCategoriesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetCategoriesQuery,
    GetCategoriesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(
    GetCategoriesDocument,
    options,
  );
}
export function useGetCategoriesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetCategoriesQuery,
    GetCategoriesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(
    GetCategoriesDocument,
    options,
  );
}
export function useGetCategoriesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetCategoriesQuery,
        GetCategoriesQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetCategoriesQuery,
    GetCategoriesQueryVariables
  >(GetCategoriesDocument, options);
}
export type GetCategoriesQueryHookResult = ReturnType<
  typeof useGetCategoriesQuery
>;
export type GetCategoriesLazyQueryHookResult = ReturnType<
  typeof useGetCategoriesLazyQuery
>;
export type GetCategoriesSuspenseQueryHookResult = ReturnType<
  typeof useGetCategoriesSuspenseQuery
>;
export type GetCategoriesQueryResult = Apollo.QueryResult<
  GetCategoriesQuery,
  GetCategoriesQueryVariables
>;
