export const bookingSearchableFields = [
  // allow search by user email/name via populate in frontend or by package title via join on server
  // For server-side text search you might implement text indexes later
  "pax",
  "status",
  "paymentStatus",
];

export const bookingFilterableFields = [
  "member",
  "package",
  "status",
  "paymentStatus",
  "startDate",
  "endDate",
];
