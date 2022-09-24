export function stripHtmlFromString(html: string) {
    return html.replace(/(<([^>]+)>)/gi, "")
}