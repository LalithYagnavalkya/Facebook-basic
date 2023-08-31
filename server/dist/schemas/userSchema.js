"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        username: (0, zod_1.string)({
            required_error: "username is required",
        }),
        password: (0, zod_1.string)({
            required_error: "password is required",
        }).min(6, "password too short - should be 6 chars minimum"),
        passwordConfirmation: (0, zod_1.string)({
            required_error: "passwordConfirmation is required",
        }),
        email: (0, zod_1.string)({
            required_error: "email is required",
        }).email("Not a valid email"),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: "passwords do not match",
        path: ["passwordConfirmation"],
    }),
});
exports.userLoginSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: "email is required",
        }),
        password: (0, zod_1.string)({
            required_error: "password is required"
        })
    })
});
