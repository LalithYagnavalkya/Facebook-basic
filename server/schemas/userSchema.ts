import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
    body: object({
        username: string({
            required_error: "username is required",
        }),
        password: string({
            required_error: "password is required",
        }).min(6, "password too short - should be 6 chars minimum"),
        passwordConfirmation: string({
            required_error: "passwordConfirmation is required",
        }),
        email: string({
            required_error: "email is required",
        }).email("Not a valid email"),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: "passwords do not match",
        path: ["passwordConfirmation"],
    }),
});

export const userLoginSchema = object({
    body:object({
        email: string({
            required_error: "email is required",
        }),
        password: string({
            required_error: "password is required"
        })
    })
})

export type CreateUserInput = TypeOf<typeof createUserSchema>
export type userLoginInput = TypeOf<typeof userLoginSchema>

