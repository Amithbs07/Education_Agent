"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AgentBadge } from "@/components/brand/AgentBadge";
import { Institution, InstitutionMember } from "@/types/institution";
import {
  Building,
  Users,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  UserPlus,
  Search,
  BookOpen,
  TrendingUp,
  Clock,
  Layers,
  CheckCircle2,
} from "lucide-react";

export default function InstitutionWorkspacePage() {
  const [data, setData] = useState<any>(null);
  const [roleFilter, setRoleFilter] = useState<"all" | "educator" | "student">("all");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<"educator" | "student">("student");
  const [inviteDept, setInviteDept] = useState("Computer Science & Engineering");
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  const fetchInstitution = async () => {
    try {
      const res = await fetch("/api/institution");
      const json = await res.json();
      if (json.success) setData(json);
    } catch (err) {
      console.error("Institution fetch error:", err);
    }
  };

  useEffect(() => {
    fetchInstitution();
  }, []);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteName.trim()) return;

    setIsInviting(true);
    try {
      const res = await fetch("/api/institution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail,
          displayName: inviteName,
          role: inviteRole,
          department: inviteDept,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setInviteSuccess(json.message);
        setShowInviteModal(false);
        setInviteEmail("");
        setInviteName("");
        fetchInstitution();
        setTimeout(() => setInviteSuccess(null), 3000);
      }
    } catch (err) {
      console.error("Invite error:", err);
    } finally {
      setIsInviting(false);
    }
  };

  const members: InstitutionMember[] = data?.members || [];
  const filteredMembers = members.filter((m) => {
    if (roleFilter === "educator") return m.role === "educator" || m.role === "institution_admin";
    if (roleFilter === "student") return m.role === "student";
    return true;
  });

  return (
    <AppShell>
      <div className="space-y-8 max-w-6xl mx-auto py-2">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/40">
                Multi-Tenant Campus Workspace
              </span>
              <span className="text-xs text-gray-400 font-mono">
                Isolated Institutional Tenant
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white font-display">
              {data?.institution?.name || "Institution Campus Workspace"}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Domain: <span className="text-sky-300 font-mono">{data?.institution?.domain || "apex.edu"}</span> • Campus seat provisioning, faculty cohorts, and centralized analytics.
            </p>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow transition-all shrink-0 self-start md:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Member to Campus</span>
          </button>
        </div>

        {inviteSuccess && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{inviteSuccess}</span>
          </div>
        )}

        {/* Campus Metrics KPI Strip */}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Campus Seats Allocated
                </span>
                <Users className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {data.institution.seatsAllocated} <span className="text-xs text-gray-500">/ {data.institution.seatLimit}</span>
              </div>
              <p className="text-[11px] text-sky-300">
                108 available seats in tier
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Enrolled Students
                </span>
                <GraduationCap className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400 font-mono">
                {data.campusAnalytics.totalEnrolledStudents}
              </div>
              <p className="text-[11px] text-gray-400">
                Across 2 STEM departments
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Campus Mastery Average
                </span>
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-amber-400 font-mono">
                {data.campusAnalytics.campusAverageMastery}%
              </div>
              <p className="text-[11px] text-emerald-400">
                +4.2% higher than state benchmarks
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Total Campus Study Hours
                </span>
                <Clock className="w-4 h-4 text-violet-400" />
              </div>
              <div className="text-2xl font-bold text-violet-300 font-mono">
                {data.campusAnalytics.totalCampusStudyHours}h
              </div>
              <p className="text-[11px] text-gray-400">Cumulative verified sessions</p>
            </div>
          </div>
        )}

        {/* Member Directory & Role Filter */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div>
              <h3 className="font-bold text-sm text-white">
                Institutional Member Directory ({members.length})
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Faculty educators and enrolled students with active tenant access.
              </p>
            </div>

            <div className="flex gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
              {(["all", "educator", "student"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1 rounded-lg capitalize font-medium text-[11px] transition-all ${
                    roleFilter === r
                      ? "bg-sky-600 text-white shadow-sm"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {r === "all" ? "All Members" : `${r}s`}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="border-b border-white/5 text-[10px] uppercase font-bold text-gray-400">
                <tr>
                  <th className="py-2.5 px-3">Member Name</th>
                  <th className="py-2.5 px-3">Academic Role</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredMembers.map((mem) => (
                  <tr key={mem.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{mem.displayName}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{mem.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          mem.role === "institution_admin"
                            ? "bg-purple-950/80 text-purple-300 border border-purple-800/40"
                            : mem.role === "educator"
                            ? "bg-sky-950/80 text-sky-300 border border-sky-800/40"
                            : "bg-emerald-950/80 text-emerald-300 border border-emerald-800/40"
                        }`}
                      >
                        {mem.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-300">{mem.department}</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded font-bold capitalize">
                        {mem.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-500">
                      {new Date(mem.joinedAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Invite Member */}
        {showInviteModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full glass-panel-glow p-6 rounded-2xl border border-sky-500/40 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-sky-400" />
                  <h3 className="font-bold text-base text-white">Invite to Campus Workspace</h3>
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-400 hover:text-white text-xs font-semibold"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleSendInvite} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Dr. Sarah Jenkins"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Institutional Email (.edu)
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="s.jenkins@apex.edu"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Role
                    </label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as any)}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                    >
                      <option value="student">Student</option>
                      <option value="educator">Faculty Educator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={inviteDept}
                      onChange={(e) => setInviteDept(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isInviting}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:opacity-90 text-white text-xs font-semibold shadow-glow disabled:opacity-50 transition-all flex items-center gap-1.5"
                  >
                    {isInviting ? "Sending..." : "Send Campus Invite"}
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
