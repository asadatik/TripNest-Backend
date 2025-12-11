"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const booking_service_1 = require("./booking.service");
//
// const createBooking = catchAsync(async (req: Request, res: Response) => {
//   const memberId = req.user._id; // assuming checkAuth attached user
//   const payload: IBooking = {
//     ...req.body,
//     member: memberId,
//   } as unknown as IBooking;
//   const result = await BookingService.createBooking(payload);
//   sendResponse(res, { statusCode: 201, success: true, message: "Booking created", data: result });
// });
const createBooking = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const memberId = req.user.userId; // assuming checkAuth attached user
    console.log("Member ID:", memberId);
    const payload = Object.assign(Object.assign({}, req.body), { member: memberId });
    const result = await booking_service_1.BookingService.createBooking(payload);
    // populate member info
    await result.populate("member", "name email");
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Booking created",
        data: result,
    });
});
//
const getAllBookings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await booking_service_1.BookingService.getAllBookings(req.query);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, success: true, message: "Bookings retrieved", data: result.data, meta: result.meta });
});
//
const getSingleBooking = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await booking_service_1.BookingService.getSingleBooking(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, success: true, message: "Booking retrieved", data: result });
});
// 
const getMemberBookings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const memberId = req.user.userId;
    console.log("Member ID:", memberId);
    const result = await booking_service_1.BookingService.getMemberBookings(memberId, req.query);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, success: true, message: "Member bookings retrieved", data: result.data, meta: result.meta });
});
//
const updateBookingStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    console.log("Updating booking ID:", id, "with payload:", payload);
    const result = await booking_service_1.BookingService.updateBookingStatus(id, payload);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, success: true, message: "Booking status updated", data: result });
});
//
const cancelBookingByUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const memberId = req.user.userId;
    const result = await booking_service_1.BookingService.cancelBookingByUser(id, memberId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, success: true, message: "Booking cancelled", data: result });
});
exports.BookingController = {
    createBooking,
    getAllBookings,
    getSingleBooking,
    getMemberBookings,
    updateBookingStatus,
    cancelBookingByUser,
};
