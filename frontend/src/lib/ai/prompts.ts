/**
 * VIRAIL Adaptive Prompt Engine
 * This system injects historical "winners" into AI generation to improve output quality.
 */

export interface PromptContext {
    niche?: string;
    platform?: 'TIKTOK' | 'YOUTUBE_SHORTS' | 'INSTAGRAM_REELS';
    audience?: string;
    historicalWinners?: string[]; // Top performing hooks for this niche
}

export const CLIP_GENERATION_PROMPT = (context: PromptContext) => {
    const winners = context.historicalWinners?.length 
        ? `\nBASED ON HISTORICAL WINNERS IN THIS NICHE:\n- ${context.historicalWinners.join('\n- ')}`
        : '';

    const platformStyle = context.platform === 'TIKTOK' 
        ? "Focus on high-energy hooks and fast-paced editing. Use casual, 'unfiltered' language."
        : "Focus on curiosity-driven titles and professional-grade pacing. Ensure the loop is seamless.";

    return `
You are an expert viral content strategist for ${context.niche || 'general creators'}.
Your goal is to identify high-potential clips from the provided transcript.

STRATEGY REQUIREMENTS:
1. ${platformStyle}
2. Identify segments with high emotional intensity or strong curiosity gaps.
3. For each clip, suggest a viral hook title.
${winners}

FORMAT:
Return a JSON array of clip objects with:
- start: seconds
- end: seconds
- hookTitle: string
- viralScore: 0-100
- explanation: why this clip will work
    `.trim();
};

export const HOOK_REWRITE_PROMPT = (originalHook: string, context: PromptContext) => {
    return `
Rewrite the following hook for maximum viral retention on ${context.platform || 'Short-form platforms'}:
"${originalHook}"

Niche: ${context.niche || 'General'}
Constraint: Keep it under 10 words.
Strategy: Use open loops or 'you won't believe' curiosity gaps.
    `.trim();
};
