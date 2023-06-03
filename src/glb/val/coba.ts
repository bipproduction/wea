import { atom } from 'jotai'
import { atomWithDefault, atomWithObservable, atomWithReducer, atomWithReset, atomWithStorage } from 'jotai/utils'

export const val_coba = atomWithStorage<string>('coba', "coba")