export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
  extraData?: Record<string, string> | Record<string, string>[] | string[];
  meta?: {
    totalCount: number;
    currentPage: number;
    perPage: number;
    totalPages: number;
    withoutFilterCount?: number;
  };
};

export interface Owner {
  id: string;
  name?: string | null;
  mobile: string;
  houseName?: string | null;

  houseAddressId?: string | null;
  houseAddress?: Address | null;

  bilCopyId?: string | null;
  bilCopy?: ImageAsset | null;

  isVerified: boolean;
  electricityMeter?: string | null;

  createdAt: Date;
  updatedAt: Date;
}
export interface ImageAsset {
  id: string;

  assetId?: string | null;
  publicId?: string | null;
  secureUrl: string;
  format?: string | null;
  width?: number | null;
  height?: number | null;
  resourceType?: string | null;

  createdAt: Date;
  updatedAt: Date;

  Owner?: Owner | null;
}

export interface Address {
  id: string;
  houseNo: string;
  street: string;
  town: string;
  city: string;

  createdAt: Date;
  updatedAt: Date;

  Owner?: Owner | null;
}
