import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_LEARNING_GROUPS,
  MOCK_GROUP_ASSIGNMENTS,
  MOCK_INSTITUTION_MEMBERS,
} from "@/lib/billing/mock-billing-store";
import { LearningGroup, GroupAssignment } from "@/types/institution";

let groups = [...MOCK_LEARNING_GROUPS];
let assignments = [...MOCK_GROUP_ASSIGNMENTS];

export async function GET(req: NextRequest) {
  try {
    const students = MOCK_INSTITUTION_MEMBERS.filter((m) => m.role === "student");

    return NextResponse.json({
      success: true,
      educator: {
        name: "Dr. Marcus Vance",
        title: "Associate Professor of Computer Science",
        department: "Distributed Systems & Systems Architecture",
      },
      groups,
      assignments,
      enrolledStudents: students,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load educator workspace" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.type === "assignment") {
      const { groupId, title, assignmentType, dueDate } = body;
      const newAssignment: GroupAssignment = {
        id: `asg_${Date.now()}`,
        groupId,
        title,
        assignmentType: assignmentType || "quiz",
        dueDate: dueDate || "2026-11-20",
        submissionCount: 0,
        totalStudents: 28,
        createdAt: new Date().toISOString(),
      };
      assignments.unshift(newAssignment);
      return NextResponse.json({ success: true, assignment: newAssignment });
    }

    // Default: Create group
    const { name, subject, description } = body;
    const newGroup: LearningGroup = {
      id: `grp_${Date.now()}`,
      institutionId: "inst_apex_01",
      educatorId: "user_prof_marcus",
      name,
      description,
      subject: subject || "Computer Science",
      studentCount: 0,
      activeAssignmentsCount: 0,
      createdAt: new Date().toISOString(),
    };
    groups.push(newGroup);

    return NextResponse.json({ success: true, group: newGroup });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Action failed" }, { status: 500 });
  }
}
