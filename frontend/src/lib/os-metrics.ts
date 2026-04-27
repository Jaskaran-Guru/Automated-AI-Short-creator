import { db } from "./prisma";
import { Plan } from "@prisma/client";

export interface OSMetrics {
  revenueToday: number;
  revenueTrend: number;
  leadsContacted: number;
  demosBooked: number;
  dealsClosed: number;
  activeTrials: number;
  activatedUsers: number;
  contentPublished: number;
  ticketsResolved: number;
  mrr: number;
  mrrTrend: number;
  churnToday: number;
  expansionToday: number;
}

export async function getOSMetrics(): Promise<OSMetrics> {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // 1. Leads and Demos
  const [
    leadsContacted,
    demosBooked,
    dealsClosed,
    activeTrials,
  ] = await Promise.all([
    db.lead.count({ 
      where: { 
        updatedAt: { gte: todayStart },
        stage: { in: ["CONTACTED", "QUALIFIED", "DEMO", "PROPOSAL"] } 
      } 
    }),
    db.lead.count({ 
      where: { 
        updatedAt: { gte: todayStart },
        stage: "DEMO" 
      } 
    }),
    db.lead.count({ 
      where: { 
        updatedAt: { gte: todayStart },
        stage: "WON" 
      } 
    }),
    db.workspace.count({
      where: {
        plan: "FREE",
        createdAt: { gte: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000) } // Active trials = new free users in last 14d
      }
    })
  ]);

  // 2. Activated Users (Users who created at least 1 clip)
  const activatedUsers = await db.user.count({
    where: {
      eventLogs: {
        some: {
          eventName: "clip_generated",
          timestamp: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
        }
      }
    }
  });

  // 3. Content Published
  const contentPublished = await db.socialPost.count({
    where: {
      status: "PUBLISHED",
      updatedAt: { gte: todayStart }
    }
  });

  // 4. Tickets Resolved
  const ticketsResolved = await db.ticket.count({
    where: {
      status: "CLOSED",
      updatedAt: { gte: todayStart }
    }
  });

  // 5. MRR Calculation (Estimated from plans)
  const planValues: Record<Plan, number> = {
    FREE: 0,
    STARTER: 49,
    PRO: 99,
    AGENCY_STARTER: 299,
    AGENCY_GROWTH: 599,
    AGENCY_PRO: 999
  };

  const currentWorkspaces = await db.workspace.findMany({
    select: { plan: true }
  });

  const mrr = currentWorkspaces.reduce((acc, ws) => acc + (planValues[ws.plan] || 0), 0);

  // 6. Churn and Expansion (Simplified for now)
  const churnToday = await db.eventLog.count({
    where: {
      eventName: "subscription_cancelled",
      timestamp: { gte: todayStart }
    }
  });

  const expansionToday = await db.eventLog.count({
    where: {
      eventName: "subscription_upgraded",
      timestamp: { gte: todayStart }
    }
  });

  // 7. Revenue Today (Directly from WON leads today)
  const wonLeadsToday = await db.lead.findMany({
    where: {
      stage: "WON",
      updatedAt: { gte: todayStart }
    },
    select: { dealValue: true }
  });
  const revenueToday = wonLeadsToday.reduce((acc, l) => acc + (l.dealValue || 0), 0);

  // Trend calculation (Mocked for now as we don't have enough history in SystemMetric yet)
  const revenueTrend = 12.4;
  const mrrTrend = 8.2;

  return {
    revenueToday,
    revenueTrend,
    leadsContacted,
    demosBooked,
    dealsClosed,
    activeTrials,
    activatedUsers,
    contentPublished,
    ticketsResolved,
    mrr,
    mrrTrend,
    churnToday,
    expansionToday,
  };
}
