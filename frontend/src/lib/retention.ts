/**
 * VIRAIL Retention Hard Systems
 * Retention is infrastructure, not a campaign.
 * This engine runs nightly and ensures no user silently churns.
 */

export type RetentionSignal =
  | "INACTIVE_7D"
  | "INACTIVE_14D"
  | "INACTIVE_30D"
  | "APPROACHING_LIMIT"
  | "LIMIT_REACHED"
  | "DOWNGRADE_RISK"
  | "FEATURE_NOT_ADOPTED"
  | "MILESTONE_REACHED"
  | "POWER_USER";

export interface UserHealthInput {
  userId: string;
  plan: "FREE" | "STARTER" | "PRO" | "AGENCY" | "ENTERPRISE";
  daysSinceLastLogin: number;
  daysSinceLastClip: number;
  minutesUsed: number;
  minutesLimit: number;
  hasUsedScheduler: boolean;
  hasUsedAnalytics: boolean;
  hasInvitedTeamMember: boolean;
  totalClipsAllTime: number;
  clipsThisMonth: number;
  referralsCount: number;
}

export interface UserHealthReport {
  userId: string;
  healthScore: number;        // 0-100
  tier: "CHAMPION" | "HEALTHY" | "AT_RISK" | "CRITICAL";
  signals: RetentionSignal[];
  triggers: RetentionTrigger[];
}

export interface RetentionTrigger {
  type: "EMAIL" | "IN_APP" | "SALES_ALERT" | "WEBHOOK";
  template: string;
  urgency: "IMMEDIATE" | "DAILY" | "WEEKLY";
  message: string;
}

export function analyzeUserHealth(input: UserHealthInput): UserHealthReport {
  let score = 100;
  const signals: RetentionSignal[] = [];
  const triggers: RetentionTrigger[] = [];

  // â”€â”€ INACTIVITY DECAY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (input.daysSinceLastLogin >= 30) {
    score -= 40; signals.push("INACTIVE_30D");
    triggers.push({
      type: "EMAIL",
      template: "winback_30d",
      urgency: "IMMEDIATE",
      message: `We miss you! Here's what changed in VIRAIL while you were away â€” plus a free 7-day credit extension.`
    });
    if (input.plan !== "FREE") {
      triggers.push({
        type: "SALES_ALERT",
        template: "churn_risk_alert",
        urgency: "IMMEDIATE",
        message: `PAID user ${input.userId} inactive 30d. High churn risk. Call within 24h.`
      });
    }
  } else if (input.daysSinceLastLogin >= 14) {
    score -= 25; signals.push("INACTIVE_14D");
    triggers.push({
      type: "EMAIL",
      template: "winback_14d",
      urgency: "DAILY",
      message: `You haven't posted in 2 weeks. Your niche's top creators posted 28 clips. Here's how to catch up.`
    });
  } else if (input.daysSinceLastLogin >= 7) {
    score -= 12; signals.push("INACTIVE_7D");
    triggers.push({
      type: "IN_APP",
      template: "nudge_return",
      urgency: "DAILY",
      message: `Welcome back! Your Growth Score dropped 4 points this week. Let's fix that.`
    });
  }

  // â”€â”€ USAGE LIMIT PROXIMITY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const usagePct = input.minutesLimit > 0 ? input.minutesUsed / input.minutesLimit : 0;
  if (usagePct >= 1) {
    score -= 15; signals.push("LIMIT_REACHED");
    triggers.push({
      type: "IN_APP",
      template: "limit_reached_upsell",
      urgency: "IMMEDIATE",
      message: `You've used 100% of your monthly minutes. Upgrade now to keep your content pipeline running.`
    });
  } else if (usagePct >= 0.8) {
    signals.push("APPROACHING_LIMIT");
    triggers.push({
      type: "IN_APP",
      template: "limit_warning_upsell",
      urgency: "DAILY",
      message: `You're at ${Math.round(usagePct * 100)}% of your monthly limit. At your current pace, you'll run out in ${Math.round((1 - usagePct) / (usagePct / 30))} days.`
    });
  }

  // â”€â”€ FEATURE ADOPTION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (!input.hasUsedScheduler && input.plan !== "FREE") {
    score -= 8; signals.push("FEATURE_NOT_ADOPTED");
    triggers.push({
      type: "IN_APP",
      template: "feature_discovery_scheduler",
      urgency: "WEEKLY",
      message: `Did you know? VIRAIL can automatically schedule your clips to TikTok, Shorts, and Reels. Users who schedule see 2.4x more consistent growth.`
    });
  }

  if (!input.hasUsedAnalytics && input.totalClipsAllTime >= 5) {
    score -= 5; signals.push("FEATURE_NOT_ADOPTED");
    triggers.push({
      type: "IN_APP",
      template: "feature_discovery_analytics",
      urgency: "WEEKLY",
      message: `Your Growth Intelligence report is ready. See exactly why your top clip outperformed the others.`
    });
  }

  // â”€â”€ MILESTONE REWARDS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (input.totalClipsAllTime >= 100) {
    signals.push("MILESTONE_REACHED");
    triggers.push({
      type: "EMAIL",
      template: "milestone_100_clips",
      urgency: "IMMEDIATE",
      message: `ðŸŽ‰ You've created your 100th clip on VIRAIL. That's an estimated 83 hours of editing time saved. Here's your Growth Certificate.`
    });
  }

  // â”€â”€ POWER USER RECOGNITION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (input.clipsThisMonth >= 20 && input.hasInvitedTeamMember) {
    score = Math.min(100, score + 5);
    signals.push("POWER_USER");
    triggers.push({
      type: "EMAIL",
      template: "power_user_reward",
      urgency: "WEEKLY",
      message: `You're in the top 8% of VIRAIL creators this month. Here's an exclusive agency feature unlock as a thank you.`
    });
  }

  // â”€â”€ DOWNGRADE RISK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (input.plan !== "FREE" && usagePct < 0.1 && input.daysSinceLastClip > 14) {
    score -= 20; signals.push("DOWNGRADE_RISK");
    triggers.push({
      type: "SALES_ALERT",
      template: "downgrade_prevention",
      urgency: "IMMEDIATE",
      message: `${input.userId} on ${input.plan} plan using <10% of quota + 14d no clips. High downgrade risk. Reach out with success coaching offer.`
    });
  }

  score = Math.max(0, Math.min(100, score));
  const tier: UserHealthReport["tier"] =
    score >= 80 ? "CHAMPION" :
    score >= 55 ? "HEALTHY" :
    score >= 30 ? "AT_RISK" : "CRITICAL";

  return { userId: input.userId, healthScore: score, tier, signals, triggers };
}

/**
 * Batch process health reports for a cohort of users.
 * Returns prioritized list â€” CRITICAL first.
 */
export function batchHealthCheck(users: UserHealthInput[]): UserHealthReport[] {
  return users
    .map(analyzeUserHealth)
    .sort((a, b) => a.healthScore - b.healthScore);
}
