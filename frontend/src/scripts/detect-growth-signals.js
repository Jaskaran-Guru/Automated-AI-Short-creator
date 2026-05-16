const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()


async function detectGrowthSignals() {
  console.log('🔍 Scanning for Growth & Retention Signals...')
  
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  try {

    const inactiveUsers = await db.user.findMany({
      where: {
        lastLogin: { lt: fourteenDaysAgo },
        memberships: {
          some: {
            workspace: {
              plan: { not: 'FREE' }
            }
          }
        }
      },
      include: { memberships: { include: { workspace: true } } }
    });

    for (const user of inactiveUsers) {
      console.log(`⚠️ CHURN RISK: ${user.email} (Inactive 14d+)`);
      await db.riskFlag.upsert({
        where: { id: `churn_${user.id}` },
        update: { severity: 'HIGH' },
        create: {
          userId: user.id,
          reason: "User inactive for 14+ days (Paid Plan)",
          severity: "HIGH"
        }
      });
    }

    const nearLimitWorkspaces = await db.workspace.findMany({
      where: {
        minutesUsed: { gte: 80 }, // In production: db.workspace.minutesLimit * 0.8
        plan: { not: 'AGENCY_PRO' }
      },
      include: { members: { include: { user: true } } }
    });

    for (const ws of nearLimitWorkspaces) {
        const owner = ws.members.find(m => m.role === 'OWNER');
        if (owner) {
            console.log(`🚀 UPSELL OPPORTUNITY: ${owner.user.email} (Usage > 80%)`);
            await db.lead.upsert({
                where: { id: `upsell_${ws.id}` },
                update: { stage: 'PROSPECT' },
                create: {
                    company: ws.name,
                    contact: owner.user.name || "Owner",
                    email: owner.user.email,
                    stage: "PROSPECT",
                    notes: "Approaching minute limit. Upgrade to higher tier recommended."
                }
            });
        }
    }



    console.log(`✅ Growth Scan Complete.`);
  } catch (error) {
    console.error('❌ Growth Scan failed:', error)
  } finally {
    await db.$disconnect()
  }
}

detectGrowthSignals()
