export class WindowUtils {
    static setBodyOverflow(value: 'visible' | 'hidden'): void {
        if (typeof document !== 'undefined') {
            document.body.style.overflow = value;
        }
    }

    static scrollTop(): void {
        window.scrollTo(0, 0);
    }
} 