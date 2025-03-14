// This file is auto-generated by @hey-api/openapi-ts

import type { Options as ClientOptions, TDataShape, Client } from '@hey-api/client-axios';
import type { RegisterUserData, RegisterUserResponse, RegisterUserError, LoginUserData, LoginUserResponse, LoginUserError, LogoutUserData, LogoutUserResponse, LogoutUserError, GetAuthUserData, GetAuthUserResponse, GetAuthUserError, VerifyEmailData, VerifyEmailResponse, VerifyEmailError, ResendVerificationEmailData, ResendVerificationEmailResponse, ResendVerificationEmailError, ForgotPasswordData, ForgotPasswordResponse, ForgotPasswordError, ResetPasswordData, ResetPasswordResponse, ResetPasswordError, GetTagsListData, GetTagsListResponse, GetTagsListError, StoreTagData, StoreTagResponse, StoreTagError, DeleteTagData, DeleteTagResponse, DeleteTagError, GetTagByIdData, GetTagByIdResponse, GetTagByIdError, UpdateTagData, UpdateTagResponse, UpdateTagError, GetTasksListData, GetTasksListResponse, GetTasksListError, StoreTaskData, StoreTaskResponse, StoreTaskError, DeleteTaskData, DeleteTaskResponse, DeleteTaskError, GetTaskByIdData, GetTaskByIdResponse, GetTaskByIdError, UpdateTaskData, UpdateTaskResponse, UpdateTaskError } from './types.gen';
import { zRegisterUserResponse, zLoginUserResponse, zLogoutUserResponse, zGetAuthUserResponse, zVerifyEmailResponse, zResendVerificationEmailResponse, zForgotPasswordResponse, zResetPasswordResponse, zGetTagsListResponse, zStoreTagResponse, zDeleteTagResponse, zGetTagByIdResponse, zUpdateTagResponse, zGetTasksListResponse, zStoreTaskResponse, zDeleteTaskResponse, zGetTaskByIdResponse, zUpdateTaskResponse } from './zod.gen';
import { client as _heyApiClient } from './client.gen';

export type Options<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean> = ClientOptions<TData, ThrowOnError> & {
    /**
     * You can provide a client instance returned by `createClient()` instead of
     * individual options. This might be also useful if you want to implement a
     * custom client.
     */
    client?: Client;
    /**
     * You can pass arbitrary values through the `meta` object. This can be
     * used to access values that aren't defined as part of the SDK function.
     */
    meta?: Record<string, unknown>;
};

/**
 * Register a new user
 * Register a new user and send verification email
 */
export const registerUser = <ThrowOnError extends boolean = false>(options: Options<RegisterUserData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).post<RegisterUserResponse, RegisterUserError, ThrowOnError>({
        responseValidator: async (data) => {
            return await zRegisterUserResponse.parseAsync(data);
        },
        url: '/api/auth/register',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Login user and get token
 * Login user and get access token
 */
export const loginUser = <ThrowOnError extends boolean = false>(options: Options<LoginUserData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).post<LoginUserResponse, LoginUserError, ThrowOnError>({
        responseValidator: async (data) => {
            return await zLoginUserResponse.parseAsync(data);
        },
        url: '/api/auth/login',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Logout user
 * Logout user and invalidate token
 */
export const logoutUser = <ThrowOnError extends boolean = false>(options?: Options<LogoutUserData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<LogoutUserResponse, LogoutUserError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zLogoutUserResponse.parseAsync(data);
        },
        url: '/api/auth/logout',
        ...options
    });
};

/**
 * Get authenticated user information
 * Get current authenticated user information
 */
export const getAuthUser = <ThrowOnError extends boolean = false>(options?: Options<GetAuthUserData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetAuthUserResponse, GetAuthUserError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zGetAuthUserResponse.parseAsync(data);
        },
        url: '/api/auth/user',
        ...options
    });
};

/**
 * Verify email address
 * Verify user email address
 */
export const verifyEmail = <ThrowOnError extends boolean = false>(options: Options<VerifyEmailData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<VerifyEmailResponse, VerifyEmailError, ThrowOnError>({
        responseValidator: async (data) => {
            return await zVerifyEmailResponse.parseAsync(data);
        },
        url: '/api/email/verify/{id}/{hash}',
        ...options
    });
};

/**
 * Resend verification email
 * Resend verification email to the user
 */
export const resendVerificationEmail = <ThrowOnError extends boolean = false>(options?: Options<ResendVerificationEmailData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<ResendVerificationEmailResponse, ResendVerificationEmailError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zResendVerificationEmailResponse.parseAsync(data);
        },
        url: '/api/email/resend',
        ...options
    });
};

/**
 * Send password reset link
 * Send a password reset link to the user's email
 */
export const forgotPassword = <ThrowOnError extends boolean = false>(options: Options<ForgotPasswordData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).post<ForgotPasswordResponse, ForgotPasswordError, ThrowOnError>({
        responseValidator: async (data) => {
            return await zForgotPasswordResponse.parseAsync(data);
        },
        url: '/api/auth/forgot-password',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Reset password
 * Reset the user's password
 */
export const resetPassword = <ThrowOnError extends boolean = false>(options: Options<ResetPasswordData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).post<ResetPasswordResponse, ResetPasswordError, ThrowOnError>({
        responseValidator: async (data) => {
            return await zResetPasswordResponse.parseAsync(data);
        },
        url: '/api/auth/reset-password',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Get list of tags
 * Returns list of tags
 */
export const getTagsList = <ThrowOnError extends boolean = false>(options?: Options<GetTagsListData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetTagsListResponse, GetTagsListError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zGetTagsListResponse.parseAsync(data);
        },
        url: '/api/tags',
        ...options
    });
};

/**
 * Store new tag
 * Creates a new tag
 */
export const storeTag = <ThrowOnError extends boolean = false>(options: Options<StoreTagData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).post<StoreTagResponse, StoreTagError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zStoreTagResponse.parseAsync(data);
        },
        url: '/api/tags',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Delete existing tag
 * Deletes a tag and returns no content
 */
export const deleteTag = <ThrowOnError extends boolean = false>(options: Options<DeleteTagData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).delete<DeleteTagResponse, DeleteTagError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zDeleteTagResponse.parseAsync(data);
        },
        url: '/api/tags/{id}',
        ...options
    });
};

/**
 * Get tag information
 * Returns tag data
 */
export const getTagById = <ThrowOnError extends boolean = false>(options: Options<GetTagByIdData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetTagByIdResponse, GetTagByIdError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zGetTagByIdResponse.parseAsync(data);
        },
        url: '/api/tags/{id}',
        ...options
    });
};

/**
 * Update existing tag
 * Updates a tag and returns it
 */
export const updateTag = <ThrowOnError extends boolean = false>(options: Options<UpdateTagData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).put<UpdateTagResponse, UpdateTagError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zUpdateTagResponse.parseAsync(data);
        },
        url: '/api/tags/{id}',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Get list of tasks
 * Returns list of tasks
 */
export const getTasksList = <ThrowOnError extends boolean = false>(options?: Options<GetTasksListData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetTasksListResponse, GetTasksListError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zGetTasksListResponse.parseAsync(data);
        },
        url: '/api/tasks',
        ...options
    });
};

/**
 * Store new task
 * Creates a new task
 */
export const storeTask = <ThrowOnError extends boolean = false>(options: Options<StoreTaskData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).post<StoreTaskResponse, StoreTaskError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zStoreTaskResponse.parseAsync(data);
        },
        url: '/api/tasks',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Delete existing task
 * Deletes a task and returns no content
 */
export const deleteTask = <ThrowOnError extends boolean = false>(options: Options<DeleteTaskData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).delete<DeleteTaskResponse, DeleteTaskError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zDeleteTaskResponse.parseAsync(data);
        },
        url: '/api/tasks/{id}',
        ...options
    });
};

/**
 * Get task information
 * Returns task data
 */
export const getTaskById = <ThrowOnError extends boolean = false>(options: Options<GetTaskByIdData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetTaskByIdResponse, GetTaskByIdError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zGetTaskByIdResponse.parseAsync(data);
        },
        url: '/api/tasks/{id}',
        ...options
    });
};

/**
 * Update existing task
 * Updates a task and returns it
 */
export const updateTask = <ThrowOnError extends boolean = false>(options: Options<UpdateTaskData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).put<UpdateTaskResponse, UpdateTaskError, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        responseValidator: async (data) => {
            return await zUpdateTaskResponse.parseAsync(data);
        },
        url: '/api/tasks/{id}',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};