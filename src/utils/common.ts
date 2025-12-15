export function parseSpacing(spacing: string | { top: number, right: number, bottom: number, left: number; } | undefined) {
    if (!spacing) {
        return '';
    }
    if (typeof spacing === 'string') {
        return spacing;
    }
    return `${spacing.top}px ${spacing.right}px ${spacing.bottom}px ${spacing.left}px`;
}