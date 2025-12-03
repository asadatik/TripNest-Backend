import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { BookingService } from "./booking.service";
import { IBooking } from "./booking.interface";

//
const createBooking = catchAsync(async (req: Request, res: Response) => {
  const memberId = req.user._id; // assuming checkAuth attached user
  const payload: IBooking = {
    ...req.body,
    member: memberId,
  } as unknown as IBooking;

  const result = await BookingService.createBooking(payload);
  sendResponse(res, { statusCode: 201, success: true, message: "Booking created", data: result });
});
//
const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.getAllBookings(req.query as Record<string, string>);
  sendResponse(res, { statusCode: 200, success: true, message: "Bookings retrieved", data: result.data, meta: result.meta });
});
//
const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BookingService.getSingleBooking(id);
  sendResponse(res, { statusCode: 200, success: true, message: "Booking retrieved", data: result });
});
//
const getMemberBookings = catchAsync(async (req: Request, res: Response) => {
  const memberId = req.user._id;
  const result = await BookingService.getMemberBookings(memberId, req.query as Record<string, string>);
  sendResponse(res, { statusCode: 200, success: true, message: "Member bookings retrieved", data: result.data, meta: result.meta });
});
//
const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await BookingService.updateBookingStatus(id, payload);
  sendResponse(res, { statusCode: 200, success: true, message: "Booking status updated", data: result });
});
//
const cancelBookingByUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const memberId = req.user._id;
  const result = await BookingService.cancelBookingByUser(id, memberId);
  sendResponse(res, { statusCode: 200, success: true, message: "Booking cancelled", data: result });
});

export const BookingController = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  getMemberBookings,
  updateBookingStatus,
  cancelBookingByUser,
};
