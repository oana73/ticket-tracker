export function getRoleFromToken(token: string): string {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role || '';
    } catch {
        return '';
    }
}