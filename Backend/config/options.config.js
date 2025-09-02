export const cookiesOption = {
  httpOnly: true, // frontend JS can't access this
  secure: process.env.APP_ENVIRONMENT === "production", // allow over HTTP
  sameSite: "Lax", // allows basic cross-origin from same-site
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};
