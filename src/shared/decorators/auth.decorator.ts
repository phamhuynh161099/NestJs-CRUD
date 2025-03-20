import { SetMetadata } from "@nestjs/common";
import { AuthTypeType, ConditionGuardType } from "../constants/auth.constant";

/**
 * Đây là key để phân biệt lẫn nhau, nơi khác dùng nó để truy cập biến
 * AuthenticationGuard
 */
export const AUTH_TYPE_KEY = 'authType';
export type AuthTypeDecoratorPayload = { authTypes: AuthTypeType[], options: { condition: ConditionGuardType } }

export const Auth = (authTypes: AuthTypeType[], options: { condition: ConditionGuardType }) => {
    return SetMetadata(AUTH_TYPE_KEY, { authTypes, options });
}