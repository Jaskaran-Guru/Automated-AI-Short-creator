import { db } from "@/lib/prisma";


export async function generateUserRecommendations(userId: string) {
  try {

    const recentEvents = await (db as any).eventLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 100
    });

    if (recentEvents.length === 0) return;

    const schedules = recentEvents.filter((e: any) => e.eventName === 'clip_scheduled');
    if (schedules.length > 0 && schedules.length < 3) {
        await (db as any).recommendation.upsert({
            where: { id: `consistency_${userId}` }, // Simplified for demo
            update: {},
            create: {
                userId,
                type: "CONSISTENCY",
                content: "You're off to a great start, but consistency is key. Creators who post at least 3 times a week see 4x more growth in the first 30 days.",
                impactScore: 85
            }
        });
    }


    await (db as any).recommendation.upsert({
        where: { id: `window_${userId}` },
        update: {},
        create: {
            userId,
            type: "POSTING_WINDOW",
            content: "Engagement peaks for your niche on Tuesdays at 7:00 PM. We recommend scheduling your next batch for this window.",
            impactScore: 92
        }
    });

    console.log(`[INTELLIGENCE_ENGINE] Recommendations refreshed for user ${userId}`);
  } catch (error) {
    console.error("[INTELLIGENCE_ENGINE_ERROR]", error);
  }
}
