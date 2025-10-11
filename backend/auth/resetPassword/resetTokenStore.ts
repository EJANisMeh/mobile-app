import crypto from 'crypto'

type TokenEntry = {
    token: string
    userId: number
    email: string
    expiresAt: number
}

const tokenMap: Map<string, TokenEntry> = new Map()

// Cleanup interval to remove expired tokens periodically
setInterval(() => {
    const now = Date.now()
    for (const [k, v] of tokenMap) {
        if (v.expiresAt <= now) tokenMap.delete(k)
    }
}, 60_000).unref()

export const createResetToken = (userId: number, email: string, ttlMinutes = 15): string => {
    const token = crypto.randomBytes(16).toString('hex')
    const expiresAt = Date.now() + ttlMinutes * 60_000
    tokenMap.set(token, { token, userId, email, expiresAt })
    return token
}

export const verifyAndConsumeResetToken = (token: string, opts: { userId?: number; email?: string }): boolean => {
    const entry = tokenMap.get(token)
    if (!entry) return false

    // check expiry
    if (entry.expiresAt <= Date.now()) {
        tokenMap.delete(token)
        return false
    }

    // match by userId or email if provided
    if (opts.userId && entry.userId !== opts.userId) return false
    if (opts.email && entry.email.toLowerCase() !== opts.email.toLowerCase()) return false

    // consume token
    tokenMap.delete(token)
    return true
}

export const debugListTokens = () => Array.from(tokenMap.values())
