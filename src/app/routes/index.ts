import { Router } from "express"
import { UserRoutes } from "../modules/user/user.route"
import { AuthRoutes } from "../modules/auth/auth.route"

import { OtpRoutes } from "../modules/otp/otp.route"
import { PackageRoutes } from "../modules/package/package.route"
import { BookingRoutes } from "../modules/booking/booking.route"
export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path : "/auth",
        route: AuthRoutes
    } ,

  {
        path: "/otp",
        route: OtpRoutes
    },

    {
        path: "/package",
        route: PackageRoutes
    } ,
    {
        path: "/booking",
        route : BookingRoutes
    }

    
   
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route) 
})
