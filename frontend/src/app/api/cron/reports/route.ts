import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key");

export async function GET(req: Request) {
  // Simple auth to ensure only authorized callers (like Vercel Cron) can trigger this
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const users = await db.user.findMany({
      include: {
        memberships: {
          include: {
            workspace: {
              include: {
                clients: {
                  include: {
                    projects: {
                      include: { clips: true }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    for (const user of users) {
      // Aggregate stats across all user workspaces
      let weeklyClipsCount = 0;
      let topScore = 0;
      let totalMinutesUsed = 0;
      let totalMinutesLimit = 0;

      for (const membership of user.memberships) {
        const workspace = membership.workspace;
        totalMinutesUsed += workspace.minutesUsed;
        totalMinutesLimit += workspace.minutesLimit;

        for (const client of workspace.clients) {
          for (const project of client.projects) {
            if (project.createdAt >= oneWeekAgo) {
              for (const clip of project.clips) {
                weeklyClipsCount++;
                if (clip.score && clip.score > topScore) {
                  topScore = clip.score;
                }
              }
            }
          }
        }
      }

      if (weeklyClipsCount > 0) {
        let upsellText = "";
        if (totalMinutesUsed >= totalMinutesLimit * 0.8) {
          upsellText = `You've used ${totalMinutesUsed}/${totalMinutesLimit} minutes this month. Upgrade to Pro for 5x more output and keep your audience growing!`;
        } else {
          upsellText = `Keep up the great work! If you need to process more long-form content, check out our higher tiers for huge volume discounts.`;
        }

        const htmlContent = `
          <h2>Your Virail Weekly Summary</h2>
          <p>Here's how your content performed this week:</p>
          <ul>
            <li><strong>Clips Generated:</strong> ${weeklyClipsCount}</li>
            <li><strong>Top Virality Score:</strong> ${topScore}%</li>
          </ul>
          <p>${upsellText}</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/billing">Manage Plan</a>
        `;

        try {
          await resend.emails.send({
            from: "Virail <reports@virail.ai>",
            to: user.email,
            subject: "Your Weekly Viral Clips Report ðŸš€",
            html: htmlContent,
          });
          
          await db.user.update({
            where: { id: user.id },
            data: { lastWeeklyReportSent: new Date() }
          });
        } catch (emailError) {
          console.error(`Failed to send email to ${user.email}`, emailError);
        }
      }
    }

    return NextResponse.json({ success: true, processedUsers: users.length });
  } catch (error) {
    console.error("[CRON_REPORTS_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
