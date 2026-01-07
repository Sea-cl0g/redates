const prompt = {
    tone: 'more-formal',
    length: 'as-is',
    format: 'as-is',
    sharedContext: ''
}

export async function rewriteText(inputText, onUpdate) {
    if (!('Rewriter' in self)) {
        throw new Error('Rewriter API not supported');
    }
}
