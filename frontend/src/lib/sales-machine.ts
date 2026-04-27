/**
 * VIRAIL Sales Machine
 * Standardized scripts, scoring, and playbooks for repeatable sales.
 * Goal: Remove rep-to-rep variance. Every deal is handled the same way.
 */

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// DEAL SCORING SYSTEM
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface DealScoringInput {
  companySize: "SOLO" | "SMALL" | "AGENCY" | "ENTERPRISE";
  hasTrialed: boolean;
  demoAttended: boolean;
  openedEmailCount: number;
  repliedToOutreach: boolean;
  budgetConfirmed: boolean;
  decisionMakerReached: boolean;
  daysInPipeline: number;
  inboundLead: boolean; // vs outbound
}

export interface DealScore {
  total: number;           // 0-100
  likelihood: "HOT" | "WARM" | "COLD" | "DEAD";
  urgency: number;         // 0-10
  accountSize: number;     // 0-10
  breakdowns: Record<string, number>;
  nextAction: string;
}

export function scoreDeal(input: DealScoringInput): DealScore {
  const breakdowns: Record<string, number> = {};
  let total = 0;

  // Intent signals
  if (input.inboundLead)          { breakdowns["Inbound Lead"] = 20; total += 20; }
  if (input.hasTrialed)           { breakdowns["Started Trial"] = 15; total += 15; }
  if (input.demoAttended)         { breakdowns["Demo Attended"] = 20; total += 20; }
  if (input.repliedToOutreach)    { breakdowns["Replied Outreach"] = 10; total += 10; }
  if (input.openedEmailCount > 3) { breakdowns["High Email Engagement"] = 5; total += 5; }

  // Qualification signals
  if (input.budgetConfirmed)      { breakdowns["Budget Confirmed"] = 15; total += 15; }
  if (input.decisionMakerReached) { breakdowns["DM Reached"] = 10; total += 10; }

  // Company size weight
  const sizeScore = { SOLO: 1, SMALL: 3, AGENCY: 8, ENTERPRISE: 10 };
  const accountSize = sizeScore[input.companySize];
  breakdowns["Account Size"] = accountSize;

  // Urgency (decays with pipeline age)
  const urgency = Math.max(0, 10 - Math.floor(input.daysInPipeline / 5));
  breakdowns["Urgency (days decay)"] = urgency;

  total = Math.min(100, total);

  const likelihood: DealScore["likelihood"] =
    total >= 70 ? "HOT" :
    total >= 45 ? "WARM" :
    total >= 20 ? "COLD" : "DEAD";

  const nextActionMap: Record<DealScore["likelihood"], string> = {
    HOT: "Send proposal within 24h. Offer concierge onboarding as closer.",
    WARM: "Book a demo or send a case study specific to their niche.",
    COLD: "Send a value-add email (benchmark data / annual report). No pitch.",
    DEAD: "Move to nurture sequence. Remove from active pipeline."
  };

  return { total, likelihood, urgency, accountSize, breakdowns, nextAction: nextActionMap[likelihood] };
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// OUTREACH SCRIPTS LIBRARY
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const SCRIPTS = {

  coldEmail: {
    subject: "Your competitors are posting 5x more than you (here's how)",
    body: `Hi {{firstName}},

Quick data point from VIRAIL's intelligence network:

The top 10% of {{niche}} creators are publishing 4.3 clips per week on average. Most teams in your space are stuck at fewer than 1.

We built VIRAIL to close that gap â€” AI that turns your existing videos into a full week of short-form content in under 15 minutes.

Three companies in your space ({{competitors}}) switched to us in Q1.

Worth a 20-min call? I can share exactly what's working in your niche right now.

â†’ [Book a demo: virail.com/demo]

Best,
{{senderName}}

P.S. I'll send you our "State of {{niche}} Short-Form" benchmark report regardless â€” reply and it's yours.`
  },

  agencyOutreach: {
    subject: "How agencies are managing 50+ clients with 2 editors",
    body: `Hi {{firstName}},

Running a content agency means your growth is capped by your team's editing capacity â€” unless you change the model.

VIRAIL's Agency Mode lets you:
- Manage unlimited client workspaces from one dashboard
- Generate 20+ clips per client per week (automated)
- Deliver white-label growth reports automatically
- Schedule across all platforms without switching tools

One agency on our platform grew from 18 to 50+ clients without a new hire.

I'd love to show you the exact workflow. 15 minutes on Thursday or Friday?

{{senderName}}`
  },

  demoScript: {
    opening: "Before I show you anything â€” tell me: what's your current process for short-form content? And what's the biggest bottleneck?",
    sections: [
      "PROBLEM AGITATION: Reflect their pain back. 'So you're spending X hours on something that should take minutes.'",
      "VIRAIL DEMO (10min): Upload â†’ Generate â†’ Show Growth Score â†’ Show Scheduling â†’ Show Analytics",
      "BENCHMARK MOMENT: 'Here's what the top 10% of [their niche] is doing. Here's where you are today.'",
      "ROI CLOSE: 'At $99/mo, if VIRAIL saves you 10 hours and gets you 3 extra posts per week, what's that worth?'",
      "OBJECTION HANDLING: See objection scripts below.",
      "NEXT STEP: 'Let's get you set up on a trial. I'll personally make sure you get your first batch of clips within 24h.'"
    ]
  },

  objectionHandling: {
    "too expensive": "Totally fair. What's your current process costing you in time? Most users find VIRAIL pays for itself in the first week. Want to run the math together?",
    "already use X tool": "What does {{competitor}} do for you that you'd hate to lose? [Listen]. VIRAIL does that and adds scheduling, analytics, and growth benchmarks. Here's a side-by-side comparison.",
    "not the right time": "Understood. The creators who wait 3 months to start are the ones chasing the ones who didn't. What would make the timing better?",
    "need to think about it": "Of course. What's the one thing you'd need to see to make this a clear yes? Let me address that before you go.",
    "we do it in-house": "Makes sense. How many hours a week does that take your team? [Listen]. That's {{hours * hourlyRate}} in labor cost. VIRAIL does it in 15 minutes."
  },

  followUpSequence: {
    day1: {
      subject: "Quick follow-up + something useful",
      body: `Hi {{firstName}},

Following up from our conversation yesterday.

Attaching the {{niche}} benchmark report I mentioned â€” your competitors are averaging {{benchmarkData}}.

Let me know if you'd like to see how you compare.

{{senderName}}`
    },
    day3: {
      subject: "One thing I forgot to mention",
      body: `Hi {{firstName}},

One thing I didn't show in our demo: VIRAIL's Growth Score predicts viral performance before you post.

Users who use it see 34% higher average reach in the first 30 days.

Happy to do a quick 10-min screen share to show you just that feature. {{calendarLink}}`
    },
    day7: {
      subject: "Last check-in",
      body: `Hi {{firstName}},

I don't want to be annoying, so this is my last follow-up.

If you're still interested but the timing isn't right, no problem â€” just say the word and I'll check back in next quarter.

If you're ready to move forward, reply with "let's go" and I'll get your trial started today.

Either way, no pressure.

{{senderName}}`
    }
  }
};
