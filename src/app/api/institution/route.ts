import { NextRequest, NextResponse } from "next/server";
import { MOCK_INSTITUTIONS, MOCK_INSTITUTION_MEMBERS } from "@/lib/billing/mock-billing-store";
import { InstitutionMember } from "@/types/institution";

let members = [...MOCK_INSTITUTION_MEMBERS];

export async function GET(req: NextRequest) {
  try {
    const institution = MOCK_INSTITUTIONS[0]; // Active tenant: Apex Institute of Technology
    const tenantMembers = members.filter((m) => m.institutionId === institution.id);

    const campusAnalytics = {
      totalEnrolledStudents: 124,
      totalFacultyEducators: 18,
      campusAverageMastery: 89.4,
      totalCampusStudyHours: 4280,
      activeDepartments: [
        { name: "Computer Science & Engineering", students: 78, avgMastery: 91.2 },
        { name: "Artificial Intelligence & Data Systems", students: 46, avgMastery: 88.5 },
      ],
    };

    return NextResponse.json({
      success: true,
      institution,
      members: tenantMembers,
      campusAnalytics,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load institution" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, displayName, role, department } = await req.json();

    if (!email || !displayName) {
      return NextResponse.json({ error: "Email and display name are required" }, { status: 400 });
    }

    const newMember: InstitutionMember = {
      id: `mem_${Date.now()}`,
      institutionId: MOCK_INSTITUTIONS[0].id,
      userId: `usr_${Date.now()}`,
      displayName,
      email,
      role: role || "student",
      status: "invited",
      department: department || "Computer Science",
      joinedAt: new Date().toISOString(),
    };

    members.push(newMember);

    return NextResponse.json({
      success: true,
      message: `Invitation successfully dispatched to ${email}`,
      member: newMember,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to invite member" }, { status: 500 });
  }
}
