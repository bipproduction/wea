import { hookstate } from '@hookstate/core';
export const gSelectedTab = hookstate<string>("1")
export const gListNumber = hookstate<number[] | undefined>(undefined)
export const gLastNumber = hookstate<string | undefined>(undefined)
export const gListResult = hookstate<number[] | undefined>(undefined)
export const gNumberCount = hookstate<number>(0)