export interface ModelHasil {
    data: Daum[]
    provider: string
    stats: Stats
}

export interface Daum {
    id: string
    name: string
    score: number
    access: string
    enhanced: boolean
    phones: Phone[]
    addresses: Address[]
    internetAddresses: any[]
    badges: any[]
    tags: any[]
    nameFeedback: NameFeedback
    cacheTtl: number
    sources: any[]
    searchWarnings: any[]
    surveys: Survey[]
    commentsStats: CommentsStats
    ns: number
}

export interface Phone {
    e164Format: string
    numberType: string
    nationalFormat: string
    dialingCode: number
    countryCode: string
    carrier: string
    type: string
}

export interface Address {
    countryCode: string
    timeZone: string
    type: string
}

export interface NameFeedback {
    nameSource: number
    nameElectionAlgo: string
}

export interface Survey {
    id: string
    frequency: number
    passthroughData: string
    perNumberCooldown: number
}

export interface CommentsStats {
    showComments: boolean
}

export interface Stats {
    sourceStats: any[]
}
