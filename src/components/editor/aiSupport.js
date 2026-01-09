const options = {
    tone: 'more-formal',
    length: 'as-is',
    format: 'as-is',
    sharedContext: ''
}

async function checkRewriterAPI() {
    if (!self.Rewriter) {
        statusDescription.textContent = "Rewriter APIが見つかりませんでした";
        return;
    }

    try {
        const availability = await self.Rewriter.availability();

        if (availability === 'no') {
            statusDescription.textContent = "Rewriter APIが使用できません";
            return;
        }

        statusDescription.textContent = "Rewriter APIが使用可能です";

    } catch (error) {
        console.error(error);
        statusDescription.textContent = "Rewriter APIの使用可否チェックで問題が発生しました";
    }
}

export async function rewriteText(inputText, onUpdate) {
    const check = await isRewriterAvailable();
    if (!check.available) {
        throw new Error(check.message);
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
