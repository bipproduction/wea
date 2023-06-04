export interface ModelTrueCallerDataUser {
    id: number
    otp: ModelOtp
    user: any
}

export interface ModelOtp {
    domain: string
    method: string
    status: number
    message: string
    tokenTtl: number
    requestId: string
    parsedCountryCode: string
    parsedPhoneNumber: number
}