/**
 * small convenience type to shortcut
 * (typeof const)[keyof typeof const]
 */
export type ValueOf<T> = T[keyof T] & {};
