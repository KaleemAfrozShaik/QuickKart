const rateLimit = require('express-rate-limit');

// General API Access: 100 requests per minute for standard requests
const generalApiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { message: 'Too many requests from this IP, please try again after a minute' },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Login / Auth: 5 attempts per 15 minutes per IP to block brute-force attacks
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { message: 'Too many login attempts from this IP, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Checkout / Payment (POST): 10 requests per minute to prevent fraudulent carding attacks
const checkoutLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per windowMs
    message: { message: 'Too many checkout attempts from this IP, please try again after a minute' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Search / Catalog Browsing: 60 requests per minute to stop scrapers
const searchCatalogLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // Limit each IP to 60 requests per windowMs
    message: { message: 'Too many search/catalog requests from this IP, please try again after a minute' },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    generalApiLimiter,
    authLimiter,
    checkoutLimiter,
    searchCatalogLimiter
};
