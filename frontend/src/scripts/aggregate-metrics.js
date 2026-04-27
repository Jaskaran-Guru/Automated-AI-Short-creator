const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

/**
 * Aggregates raw EventLog data into DailyMetric snapshots.
 * This powers the Moat Engine's recommendation and benchmark systems.
 */
async function aggregateDailyMetrics() {
  console.log('📊 Starting Intelligence Aggregation...')
  
  const targetDate = new Date();
  targetDate.setHours(0, 0, 0, 0); // Today's start

  try {
    // 1. Total Clips Generated Today
    const clipCount = await db.eventLog.count({
      where: {
        eventName: 'clips_generated',
        timestamp: { gte: targetDate }
      }
    });

    await db.dailyMetric.upsert({
      where: {
        key_date_workspaceId_clientId_platform: {
          key: 'total_clips_generated',
          date: targetDate,
          workspaceId: null,
          clientId: null,
          platform: null
        }
      },
      update: { value: clipCount },
      create: {
        key: 'total_clips_generated',
        date: targetDate,
        value: clipCount
      }
    });

    // 2. Publish Rate Analysis
    const totalSchedules = await db.eventLog.count({
        where: {
          eventName: 'clip_scheduled',
          timestamp: { gte: targetDate }
        }
    });

    await db.dailyMetric.upsert({
        where: {
          key_date_workspaceId_clientId_platform: {
            key: 'total_schedules',
            date: targetDate,
            workspaceId: null,
            clientId: null,
            platform: null
          }
        },
        update: { value: totalSchedules },
        create: {
          key: 'total_schedules',
          date: targetDate,
          value: totalSchedules
        }
    });

    // 3. User Active Minutes (Usage Intensity)
    // Mocking this for the demo, but in production, we would sum the metadata.minutes from 'project_created'
    console.log(`✅ Aggregated ${clipCount} clips and ${totalSchedules} schedules for ${targetDate.toLocaleDateString()}`);

  } catch (error) {
    console.error('❌ Aggregation failed:', error)
  } finally {
    await db.$disconnect()
  }
}

aggregateDailyMetrics()
