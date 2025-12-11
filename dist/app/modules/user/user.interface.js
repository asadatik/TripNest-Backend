"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["USER"] = "USER";
    UserRole["AGENT"] = "AGENT";
})(UserRole || (exports.UserRole = UserRole = {}));
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["ACTIVE"] = "ACTIVE";
    AccountStatus["INACTIVE"] = "INACTIVE";
    AccountStatus["BLOCKED"] = "BLOCKED";
    AccountStatus["DELETED"] = "DELETED";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
