const { PrismaClient, Role, Plan, Status, SocialPlatform, PostStatus, AdminRole, TicketStatus, TicketPriority } = require('@prisma/client')
const db = new PrismaClient()

async function main() {
  console.log('🚀 Activating VIRAIL Admin Empire: Ultimate Seeding...')

  try {
    await db.$transaction(async (tx) => {
      // 1. Full Cleanup
      console.log('🧹 Clearing legacy data...')
      await tx.systemMetric.deleteMany({})
      await tx.lead.deleteMany({})
      await tx.riskFlag.deleteMany({})
      await tx.ticketResponse.deleteMany({})
      await tx.ticket.deleteMany({})
      await tx.socialPost.deleteMany({})
      await tx.socialAccount.deleteMany({})
      await tx.report.deleteMany({})
      await tx.invite.deleteMany({})
      await tx.brandKit.deleteMany({})
      await tx.clip.deleteMany({})
      await tx.project.deleteMany({})
      await tx.subscription.deleteMany({})
      await tx.workspaceMember.deleteMany({})
      await tx.workspace.deleteMany({})
      await tx.auditLog.deleteMany({})
      await tx.user.deleteMany({})

      // 2. Create the Founder (SuperAdmin)
      console.log('👑 Crowning the Founder...')
      const founder = await tx.user.create({
        data: {
          clerkId: "user_founder_master",
          email: "founder@virail.com",
          name: "Jass Karan (Founder)",
          systemRole: "SUPER_ADMIN"
        }
      })

      // 3. Create Support & Ops Staff
      const support = await tx.user.create({
        data: {
          clerkId: "user_staff_support",
          email: "support@virail.com",
          name: "Emily (Customer Success)",
          systemRole: "SUPPORT"
        }
      })

      // 4. Create Historical Revenue Metrics (Last 12 Months)
      console.log('📈 Generating 12 months of revenue metrics...')
      for (let i = 0; i < 12; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        await tx.systemMetric.create({
          data: {
            key: "mrr",
            value: 8000 + (i * 500) + (Math.random() * 1000),
            date
          }
        });
      }

      // 5. Create Growth CRM Leads
      console.log('💼 Building the B2B pipeline...')
      const leadStages = ["PROSPECT", "DEMO_BOOKED", "PROPOSAL", "CLOSED_WON"];
      const companies = ["HyperGrowth Media", "CreatorDAO", "ShortsKing Agency", "PodBlast Network"];
      
      for (const company of companies) {
        await tx.lead.create({
          data: {
            company,
            contact: "James Wilson",
            email: `contact@${company.toLowerCase().replace(' ', '')}.com`,
            stage: leadStages[Math.floor(Math.random() * leadStages.length)],
            notes: "Interested in Agency Pro plan for 50 clients.",
            nextFollowup: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        })
      }

      // 6. Create Support Tickets
      console.log('🎫 Populating the support queue...')
      const subjects = ["Billing issue", "Render failed at 90%", "Feature request: Subtitles", "Custom Font Upload"];
      for (let i = 0; i < subjects.length; i++) {
        await tx.ticket.create({
          data: {
            subject: subjects[i],
            message: "I need help with my account settings. Please assist.",
            status: i % 2 === 0 ? "OPEN" : "IN_PROGRESS",
            priority: i === 1 ? "URGENT" : "MEDIUM",
            category: i === 0 ? "BILLING" : "RENDERING",
            userId: founder.id,
            assignedId: support.id
          }
        })
      }

      // 7. Create Risk Flags (Fraud Detection)
      console.log('🛡️ Deploying fraud detection...')
      await tx.riskFlag.create({
        data: {
          userId: founder.id,
          reason: "Multi-account IP cluster detected (8 accounts)",
          severity: "HIGH"
        }
      })

      // 8. Create a Demo Agency Workspace & Client (Legacy support)
      const workspace = await tx.workspace.create({
        data: {
          name: "Skyline Media (Demo)",
          slug: "skyline-demo",
          plan: "AGENCY_PRO",
          minutesLimit: 5000,
          minutesUsed: 1420,
          members: {
            create: {
              userId: founder.id,
              role: "OWNER"
            }
          }
        }
      })

      const client = await tx.client.create({
        data: {
          workspaceId: workspace.id,
          name: "TechPulse SaaS",
          niche: "SaaS",
          brandKit: { create: {} }
        }
      })

      // 9. Initial Audit Log
      await tx.auditLog.create({
        data: {
          userId: founder.id,
          action: "INITIAL_ADMIN_SETUP",
          entity: "SYSTEM",
          details: "VIRAIL Admin Empire successfully initialized."
        }
      })

      console.log('✅ Admin Empire Activated. VIRAIL is now Operational.')
    }, { timeout: 30000 })
  } catch (e) {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

main()
