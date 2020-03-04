// you need to fire 'response' event on dialog close!
export function openDialog({ dialog, dialogData, readonly }) {
    return new Promise((resolve, reject) => {
        const dialogElement = document.createElement(dialog);
        const body = document.querySelector('body');
        if (body) {
            body.appendChild(dialogElement);
        }
        else {
            reject(new Error('Body not exist'));
        }
        dialogElement.dialogData = dialogData;
        if (readonly) {
            dialogElement.readonly = readonly;
        }
        dialogElement.addEventListener('response', (e) => {
            const event = e;
            resolve(event.detail);
            dialogElement.remove();
        });
    });
}
