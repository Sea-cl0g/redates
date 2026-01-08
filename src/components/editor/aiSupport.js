const options = {
    tone: 'more-formal',
    length: 'as-is',
    format: 'as-is',
    sharedContext: ''
}

export async function rewriteText(inputText, onUpdate) {
    if (!('Rewriter' in self)) {
        throw new Error('Rewriter API not supported');
    }

    let rewriter;
    let result = '';
    try {
        rewriter = await self.Rewriter.create(options);

        const stream = await rewriter.rewriteStreaming(inputText, {
            context: options.sharedContext,
        });

        for await (const chunk of stream) {
            result += chunk;
            onUpdate?.(result);
        }

        return result;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        rewriter?.destroy();
    }
}
