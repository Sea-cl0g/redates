const options = {
    tone: 'as-is',
    length: 'as-is',
    format: 'as-is',
    sharedContext: '日本語で出力してください'
}

export function updateOptions(newOptions) {
    Object.assign(options, newOptions);
}

export function getOptions() {
    return { ...options };
}


export async function checkRewriterAPI() {
    if (!('Rewriter' in self)) {
        throw new Error('Rewriter APIが見つかりませんでした');
    }

    try {
        const availability = await self.Rewriter.availability();

        if (availability === 'no') {
            throw new Error('Rewriter APIが使用できません');
        }

        return { available: true, message: 'Rewriter APIが使用可能です' };

    } catch (error) {
        if (error.message === 'Rewriter APIが使用できません') {
            throw error;
        }
        throw new Error('Rewriter APIの使用可否チェックで問題が発生しました');
    }
}

export async function rewriteText(inputText, onUpdate) {
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
