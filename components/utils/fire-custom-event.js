export function fireEvent(el, eventName, detail) {
    el.dispatchEvent(new CustomEvent(eventName, {
        detail,
        bubbles: true,
        composed: true
    }));
}
