import { hookstate, State, useHookstate } from '@hookstate/core'

export const wrapState = <T>(s: State<T>) => ({
    get: () => s.value,
    set: (v: T) => s.set(v)
})

export const gIsWaConnected = hookstate<boolean | undefined>(undefined)
export const gIsSocketConnected = hookstate<boolean | undefined>(undefined)
export const gSetIsWaConnected = () => wrapState(gIsWaConnected)

export const gIsweaConnectLoading = hookstate<boolean>(false)
export const gSetIsWeaConnectLoading = () => wrapState(gIsweaConnectLoading)

export const gIsWeaInit = hookstate<boolean>(false)
export const gSetIsWeaInit = wrapState(gIsWeaInit)

export const gUserId = hookstate<string | undefined>(undefined)

export const gIsWeaDisconnected = hookstate<boolean>(false)
export const gListResult = hookstate<any[]>([])
export const gUserListNumber = hookstate<number[]>([])