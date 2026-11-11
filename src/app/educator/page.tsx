"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { AgentBadge } from "@/components/brand/AgentBadge";
import { LearningGroup, GroupAssignment } from "@/types/institution";
import {
  Users,
  GraduationCap,
  PlusCircle,
  BookOpen,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  Send,
  FileCheck,
} from "lucide-react";

export default function EducatorWorkspacePage() {
  const [data, setData] = useState<any>(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Group creation form state
  const [groupName, setGroupName] = useState("");
  const [groupSubject, setGroupSubject] = useState("Distributed Systems");
  const [groupDesc, setGroupDesc] = useState("");

  // Assignment creation form state
  const [selectedGroupId, setSelectedGroupId] = useState("grp_cs401");
  const [asgTitle, setAsgTitle] = useState("");
  const [asgType, setAsgType] = useState<"quiz" | "task" | "reading">("quiz");
  const [asgDueDate, setAsgDueDate] = useState("2026-11-20");

  const fetchEducatorData = async () => {
    try {
      const res = await fetch("/api/educator");
      const json = await res.json();
      if (json.success) setData(json);
    } catch (err) {
      console.error("Educator fetch error:", err);
    }
  };

  useEffect(() => {
    fetchEducatorData();
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    try {
      const res = await fetch("/api/educator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: groupName,
          subject: groupSubject,
          description: groupDesc,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowCreateGroupModal(false);
        setGroupName("");
        setGroupDesc("");
        fetchEducatorData();
      }
    } catch (err) {
      console.error("Group creation error:", err);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgTitle.trim()) return;

    try {
      const res = await fetch("/api/educator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "assignment",
          groupId: selectedGroupId,
          title: asgTitle,
          assignmentType: asgType,
          dueDate: asgDueDate,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowAssignModal(false);
        setAsgTitle("");
        fetchEducatorData();
      }
    } catch (err) {
      console.error("Assignment creation error:", err);
    }
  };

  const groups: LearningGroup[] = data?.groups || [];
  const assignments: GroupAssignment[] = data?.assignments || [];

  return (
    <AppShell>
      <div className="space-y-8 max-w-6xl mx-auto py-2">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/40">
                Faculty Educator Workspace
              </span>
              <span className="text-xs text-gray-400 font-mono">
                Cohort Curricula & Group Distribution
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white font-display">
              {data?.educator?.name || "Dr. Marcus Vance"} – Educator Portal
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {data?.educator?.title} • {data?.educator?.department}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setShowCreateGroupModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Cohort Group</span>
            </button>
            <button
              onClick={() => setShowAssignModal(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-sky-500 hover:opacity-90 text-white text-xs font-semibold shadow-glow transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Assign to Cohort</span>
            </button>
          </div>
        </div>

        {/* Active Cohorts Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white font-display">
              Active Cohort Groups ({groups.length})
            </h3>
            <span className="text-xs text-gray-400 font-mono">
              Synchronized Student Access
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-sky-400 font-mono bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
                      {group.subject}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1.5 font-mono">
                      <Users className="w-3.5 h-3.5 text-gray-500" />
                      <span>{group.studentCount} Students</span>
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mt-1">
                    {group.name}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {group.description || "Active curriculum cohort on CITADEL."}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-violet-300 font-mono">
                    {group.activeAssignmentsCount} Active Assignment{group.activeAssignmentsCount === 1 ? "" : "s"}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedGroupId(group.id);
                      setShowAssignModal(true);
                    }}
                    className="text-xs text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <span>Assign Material</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cohort Assignments & Submissions Tracking */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Distributed Assignments & Submission Velocity</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Real-time tracking of student completion rates across cohorts.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {assignments.map((asg) => {
              const completionPercent = Math.round((asg.submissionCount / asg.totalStudents) * 100);

              return (
                <div
                  key={asg.id}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase font-bold text-violet-400 bg-violet-950/80 px-2 py-0.5 rounded border border-violet-800/40">
                          {asg.assignmentType}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                          Due: {asg.dueDate}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white">{asg.title}</h4>
                    </div>

                    <div className="text-right sm:text-right font-mono text-xs">
                      <span className="font-bold text-emerald-400">
                        {asg.submissionCount} / {asg.totalStudents} Submitted
                      </span>
                      <span className="text-gray-400 block text-[10px]">({completionPercent}% Completed)</span>
                    </div>
                  </div>

                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-sky-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal: Create Cohort Group */}
        {showCreateGroupModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full glass-panel-glow p-6 rounded-2xl border border-sky-500/40 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-400" />
                  <h3 className="font-bold text-base text-white">Create Faculty Cohort</h3>
                </div>
                <button
                  onClick={() => setShowCreateGroupModal(false)}
                  className="text-gray-400 hover:text-white text-xs font-semibold"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Cohort Name / Course Code
                  </label>
                  <input
                    type="text"
                    required
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g. CS401: Distributed Systems (Fall 2026)"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Subject Discipline
                  </label>
                  <input
                    type="text"
                    value={groupSubject}
                    onChange={(e) => setGroupSubject(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Cohort Description
                  </label>
                  <textarea
                    rows={2}
                    value={groupDesc}
                    onChange={(e) => setGroupDesc(e.target.value)}
                    placeholder="Syllabus focus, topics covered, and active semester objectives..."
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-sky-500 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowCreateGroupModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:opacity-90 text-white text-xs font-semibold shadow-glow transition-all"
                  >
                    Create Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Assign Material */}
        {showAssignModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full glass-panel-glow p-6 rounded-2xl border border-violet-500/40 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-violet-400" />
                  <h3 className="font-bold text-base text-white">Distribute Cohort Assignment</h3>
                </div>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="text-gray-400 hover:text-white text-xs font-semibold"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Assignment Title
                  </label>
                  <input
                    type="text"
                    required
                    value={asgTitle}
                    onChange={(e) => setAsgTitle(e.target.value)}
                    placeholder="e.g. Midterm Diagnostic: Raft Consensus & Quorums"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Type
                    </label>
                    <select
                      value={asgType}
                      onChange={(e) => setAsgType(e.target.value as any)}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                    >
                      <option value="quiz">Diagnostic Quiz</option>
                      <option value="task">Programming Task</option>
                      <option value="reading">RAG Document Reading</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={asgDueDate}
                      onChange={(e) => setAsgDueDate(e.target.value)}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-sky-500 hover:opacity-90 text-white text-xs font-semibold shadow-glow transition-all"
                  >
                    Distribute to Students
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
