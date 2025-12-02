import { Types } from "mongoose";

export interface IPackageType {
  name: string;
  description?: string;
}

export interface IPackage {
  _id?: Types.ObjectId;
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  images?: string[];          // urls
  destination?: string;
  costFrom?: number;          // base price
  currency?: string;
  durationDays?: number;
  capacity?: number;          // max guests
  availableSeats?: number;    // dynamic seat tracking
  startDate?: Date;
  endDate?: Date;
  departureLocation?: string;
  arrivalLocation?: string;
  included?: string[];
  excluded?: string[];
  amenities?: string[];
  itinerary?: string[];       // day-wise
  minAge?: number;
  maxAge?: number;
  division?: Types.ObjectId;  // ref to Division (if exists)
  packageType?: Types.ObjectId; // ref to PackageType
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
   deleteImages?: string[];   // ADD THIS LINE
}
