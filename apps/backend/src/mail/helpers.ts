export function renderDate(date: string | Date, locale = 'sv-SE', timeZone?: string) {
    return new Date(date).toLocaleString(locale, {
        timeZone,
    });
}
