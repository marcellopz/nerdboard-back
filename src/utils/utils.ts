export function parseCookieString(
    cookieString: string,
): Record<string, string> {
    return cookieString
        .split(';')
        .reduce((acc: Record<string, string>, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key.trim()] = value.trim();
            return acc;
        }, {});
}
