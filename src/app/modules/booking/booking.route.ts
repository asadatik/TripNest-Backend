import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserRole } from "../user/user.interface";
import { BookingController } from "./booking.controller";
import { createBookingZodSchema,updateBookingStatusZodSchema } from "./booking.validation";

const router = express.Router();

//list packages/bookings by queries (admin will use getAll)


router.get("/", checkAuth(UserRole.ADMIN) ,  BookingController.getAllBookings);


// Member endpoints
router.post("/create", checkAuth(UserRole.USER), validateRequest(createBookingZodSchema), BookingController.createBooking);
router.get("/me", checkAuth(UserRole.USER), BookingController.getMemberBookings);
router.patch("/me/:id/cancel", checkAuth(UserRole.USER), BookingController.cancelBookingByUser);




// Admin: single booking fetch
router.get("/admin/:id", checkAuth(UserRole.ADMIN), BookingController.getSingleBooking);

// Admin update status
router.patch("/status/:id/", checkAuth(UserRole.ADMIN), validateRequest(updateBookingStatusZodSchema), BookingController.updateBookingStatus);


export const BookingRoutes = router;
