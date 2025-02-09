export const isValidTextField = text => !(!text || String(text).trim().length === 0);
export const isTokenExpired = token => token * 1000 <= Date.now();
