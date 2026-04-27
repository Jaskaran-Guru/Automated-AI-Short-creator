/**
 * VIRAIL Revenue Predictability Engine
 * Removes revenue randomness by modeling forward projections
 * from real operational inputs.
 *
 * Run nightly or on-demand from /admin/forecast
 */
import { db } from "./prisma";

export interface RevenueInputs {
  currentMRR: number;
  activeTrials: number;
  trialConversionRate: number;   // 0-1, e.g. 0.22 = 22%
  avgRevenuePerUser: number;     // e.g. $99
  activationRate: number;        // % of new signups that reach "Aha moment" in 7d
  demoToCloseRate: number;       // e.g. 0.32 = 32%
  demosBookedThisWeek: number;
  avgDealValue: number;          // for demos (agencies/enterprise)
  monthlyChurnRate: number;      // e.g. 0.025 = 2.5%
  expansionRate: number;         // monthly expansion MRR as % of MRR
}

export interface RevenueProjection {
  day7NewMRR: number;
  day7TotalMRR: number;
  day30NewMRR: number;
  day30TotalMRR: number;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  riskFlags: RevenueRiskFlag[];
  sensitivity: SensitivityItem[];
}

export interface RevenueRiskFlag {
  severity: "CRITICAL" | "WARNING" | "INFO";
  metric: string;
  message: string;
  action: string;
}

export interface SensitivityItem {
  scenario: string;
  day30MRR: number;
  delta: number;
}

export function projectRevenue(inputs: RevenueInputs): RevenueProjection {
  const {
    currentMRR,
    activeTrials,
    trialConversionRate,
    avgRevenuePerUser,
    activationRate,
    demoToCloseRate,
    demosBookedThisWeek,
    avgDealValue,
    monthlyChurnRate,
    expansionRate,
  } = inputs;

  // â”€â”€ 7-Day Projection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Trials converting within 7 days (trials typically convert in first 7d)
  const trialConversions7d = Math.round(activeTrials * trialConversionRate * 0.6);
  const demoCloses7d = Math.round(demosBookedThisWeek * demoToCloseRate * 0.4);
  const day7NewMRR = (trialConversions7d * avgRevenuePerUser) +
                     (demoCloses7d * avgDealValue);
  const churnLoss7d = currentMRR * (monthlyChurnRate / 4);
  const expansion7d = currentMRR * (expansionRate / 4);
  const day7TotalMRR = currentMRR + day7NewMRR - churnLoss7d + expansion7d;

  // â”€â”€ 30-Day Projection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Assumes weekly demo rate continues, trial pipeline refills
  const weeksInMonth = 4.33;
  const trialConversions30d = Math.round(activeTrials * trialConversionRate);
  const demoCloses30d = Math.round(demosBookedThisWeek * weeksInMonth * demoToCloseRate);
  const day30NewMRR = (trialConversions30d * avgRevenuePerUser) +
                      (demoCloses30d * avgDealValue);
  const churnLoss30d = currentMRR * monthlyChurnRate;
  const expansion30d = currentMRR * expansionRate;
  const day30TotalMRR = currentMRR + day30NewMRR - churnLoss30d + expansion30d;

  // â”€â”€ Risk Flags â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const riskFlags: RevenueRiskFlag[] = [];

  if (monthlyChurnRate > 0.05) {
    riskFlags.push({
      severity: "CRITICAL",
      metric: "Churn Rate",
      message: `Monthly churn at ${(monthlyChurnRate * 100).toFixed(1)}% exceeds 5% threshold. Payback period will break above 6 months.`,
      action: "Activate win-back sequence. Audit last 10 churned accounts immediately."
    });
  }

  if (trialConversionRate < 0.15) {
    riskFlags.push({
      severity: "WARNING",
      metric: "Trial Conversion",
      message: `${(trialConversionRate * 100).toFixed(0)}% trial conversion is below 15% benchmark. Activation may be failing.`,
      action: "Review onboarding completion rate. Check where users drop off in trial flow."
    });
  }

  if (demoToCloseRate < 0.20) {
    riskFlags.push({
      severity: "WARNING",
      metric: "Demo-to-Close",
      message: `Demo close rate at ${(demoToCloseRate * 100).toFixed(0)}%. Industry benchmark for SaaS is 25-35%.`,
      action: "Review demo script. Add case study to demo deck. Introduce risk-reversal offer."
    });
  }

  if (activationRate < 0.40) {
    riskFlags.push({
      severity: "WARNING",
      metric: "Activation Rate",
      message: `Only ${(activationRate * 100).toFixed(0)}% of new users reach key activation milestone within 7 days.`,
      action: "Trigger onboarding nudge sequence. Reduce steps to first clip generation."
    });
  }

  if (activeTrials < 20) {
    riskFlags.push({
      severity: "INFO",
      metric: "Trial Pipeline",
      message: `Trial pipeline at ${activeTrials} users. Below 20 creates revenue gap risk in 14-21 days.`,
      action: "Increase top-of-funnel: publish benchmarks, run comparison page ads."
    });
  }

  // â”€â”€ Confidence Score â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const criticalFlags = riskFlags.filter(f => f.severity === "CRITICAL").length;
  const warningFlags = riskFlags.filter(f => f.severity === "WARNING").length;
  const confidence: "HIGH" | "MEDIUM" | "LOW" =
    criticalFlags > 0 ? "LOW" :
    warningFlags > 1 ? "MEDIUM" : "HIGH";

  // â”€â”€ Sensitivity Analysis â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const sensitivity: SensitivityItem[] = [
    {
      scenario: "Base Case",
      day30MRR: Math.round(day30TotalMRR),
      delta: Math.round(day30TotalMRR - currentMRR)
    },
    {
      scenario: "+5% Conversion Lift",
      day30MRR: Math.round(day30TotalMRR + (activeTrials * 0.05 * avgRevenuePerUser)),
      delta: Math.round(activeTrials * 0.05 * avgRevenuePerUser)
    },
    {
      scenario: "-1% Churn Reduction",
      day30MRR: Math.round(day30TotalMRR + (currentMRR * 0.01)),
      delta: Math.round(currentMRR * 0.01)
    },
    {
      scenario: "2x Demo Volume",
      day30MRR: Math.round(day30TotalMRR + (demoCloses30d * avgDealValue)),
      delta: Math.round(demoCloses30d * avgDealValue)
    },
    {
      scenario: "Churn Doubles",
      day30MRR: Math.round(day30TotalMRR - (currentMRR * monthlyChurnRate)),
      delta: -Math.round(currentMRR * monthlyChurnRate)
    }
  ];

  return {
    day7NewMRR: Math.round(day7NewMRR),
    day7TotalMRR: Math.round(day7TotalMRR),
    day30NewMRR: Math.round(day30NewMRR),
    day30TotalMRR: Math.round(day30TotalMRR),
    confidence,
    riskFlags,
    sensitivity,
  };
}

/**
 * Default inputs for VIRAIL's current operating stage.
 * Update these weekly from Stripe + EventLog data.
 */
export const CURRENT_INPUTS: RevenueInputs = {
  currentMRR: 84500,
  activeTrials: 28,
  trialConversionRate: 0.22,
  avgRevenuePerUser: 99,
  activationRate: 0.48,
  demoToCloseRate: 0.32,
  demosBookedThisWeek: 3,
  avgDealValue: 599,
  monthlyChurnRate: 0.025,
  expansionRate: 0.04,
};

/**
 * Aggregates real data from Prisma to populate the RevenueInputs model.
 */
export async function getLiveRevenueInputs(): Promise<RevenueInputs> {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const planValues: any = {
    FREE: 0, STARTER: 49, PRO: 99, 
    AGENCY_STARTER: 299, AGENCY_GROWTH: 599, AGENCY_PRO: 999
  };

  const [
    workspaces,
    activeTrials,
    wonLeadsMonth,
    totalLeadsMonth,
    demosBookedWeek,
    churnEventsMonth,
  ] = await Promise.all([
    db.workspace.findMany({ select: { plan: true } }),
    db.workspace.count({ where: { plan: "FREE", createdAt: { gte: monthAgo } } }),
    db.lead.findMany({ where: { stage: "WON", updatedAt: { gte: monthAgo } } }),
    db.lead.count({ where: { createdAt: { gte: monthAgo } } }),
    db.lead.count({ where: { stage: "DEMO", updatedAt: { gte: weekAgo } } }),
    db.eventLog.count({ where: { eventName: "subscription_cancelled", timestamp: { gte: monthAgo } } }),
  ]);

  const currentMRR = workspaces.reduce((acc, ws) => acc + (planValues[ws.plan] || 0), 0);
  
  // Trial conversion rate = Won leads / Total leads (simplified)
  const trialConversionRate = totalLeadsMonth > 0 ? wonLeadsMonth.length / totalLeadsMonth : 0.2;
  
  const avgRevenuePerUser = wonLeadsMonth.length > 0 
    ? wonLeadsMonth.reduce((acc, l) => acc + (l.dealValue || 0), 0) / wonLeadsMonth.length 
    : 99;

  const monthlyChurnRate = currentMRR > 0 ? (churnEventsMonth * 49) / currentMRR : 0.02;

  return {
    currentMRR,
    activeTrials,
    trialConversionRate: Math.max(0.05, trialConversionRate),
    avgRevenuePerUser,
    activationRate: 0.45, // Hard to compute without specific event tagging logic
    demoToCloseRate: 0.3,
    demosBookedThisWeek: demosBookedWeek,
    avgDealValue: 599,
    monthlyChurnRate: Math.max(0.01, monthlyChurnRate),
    expansionRate: 0.03,
  };
}

