
"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import mammoth from "mammoth";

const CATEGORIES = ["ALL", "Physics", "Chemistry", "Botany", "Zoology", "Full Length Mock Tests"] as const;

const MOTIVATIONAL_QUOTES = [
  "“The stethoscope is not just an instrument, it is a pledge to preserve life. Put in the grind today for the white coat tomorrow.”",
  "“Rank is not built in the exam hall; it is carved in every single mock mistake you analyze and correct.”",
  "“Every cell of NCERT you master brings you one step closer to the corridors of AIIMS.”",
  "“Tough times don’t last, tough aspirants do. Keep your focus razor-sharp!”"
];

export default function DrJasmanApp() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  // App Navigation
  const [view, setView] = useState<"DASHBOARD" | "ACTIVE_TEST" | "RESULT_REVIEW">("DASHBOARD");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"TESTS" | "MY_REPORTS">("TESTS");

  // Re-Analysis Filter (All, Incorrect Only, Skipped Only)
  const [reviewFilter, setReviewFilter] = useState<"ALL" | "INCORRECT" | "UNATTEMPTED">("ALL");
  const [cardFlipMode, setCardFlipMode] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  // Data states
  const [tests, setTests] = useState<any[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<any[]>([]);
  const [studentName, setStudentName] = useState<string>("");
  const [currentTest, setCurrentTest] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [dailyQuote, setDailyQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  // Precision Timer & Anti-Cheat
  const [startTime, setStartTime] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [totalTestSeconds, setTotalTestSeconds] = useState<number>(0);
  const [viewingReport, setViewingReport] = useState<any>(null);
  const isSubmittingRef = useRef(false);

  // Admin Form State
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("Physics");
  const [newDuration, setNewDuration] = useState(45);
  const [newChapters, setNewChapters] = useState("");
  const [newIsLive, setNewIsLive] = useState(true);
  const [rawQuestions, setRawQuestions] = useState("");
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);

  const fetchTests = async () => {
    const { data } = await supabase.from("tests").select("*").order("created_at", { ascending: false });
    if (data) setTests(data);
  };

  const fetchSubmissions = async () => {
    const { data } = await supabase.from("test_submissions").select("*").order("created_at", { ascending: false });
    if (data) setAllSubmissions(data);
  };

  useEffect(() => {
    fetchTests();
    fetchSubmissions();
    const storedName = localStorage.getItem("dr_jasman_student_name");
    if (storedName) setStudentName(storedName);
    const randomQ = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setDailyQuote(randomQ);
  }, []);

  // Anti-Cheat: Screen / Tab switch auto-submit
  useEffect(() => {
    if (view !== "ACTIVE_TEST" || !currentTest) return;

    const triggerCheatingSubmit = (reason: string) => {
      if (isSubmittingRef.current) return;
      alert(`⚠️ VIOLATION DETECTED: ${reason}. Test automatically submit kiya ja raha hai!`);
      executeFinalSubmit(true, reason);
    };

    const handleVisibility = () => {
      if (document.hidden) triggerCheatingSubmit("Screen / Tab Switch Detected");
    };

    const handleBlur = () => {
      triggerCheatingSubmit("Window Focus Lost");
    };

    window.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
    };
  }, [view, currentTest, userAnswers, remainingSeconds]);

  // Exact Countdown Timer
  useEffect(() => {
    if (view !== "ACTIVE_TEST" || remainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!isSubmittingRef.current) executeFinalSubmit(false, "Time Expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [view, remainingSeconds]);

  const handleStartTest = (test: any) => {
    let name = studentName.trim();
    if (!name) {
      name = prompt("Enter Student Full Name for Verification:") || "";
      if (!name.trim()) {
        alert("Candidate Name required!");
        return;
      }
      setStudentName(name);
      localStorage.setItem("dr_jasman_student_name", name);
    }

    isSubmittingRef.current = false;
    setCurrentTest(test);
    setUserAnswers({});
    const totalSecs = test.duration_mins * 60;
    setTotalTestSeconds(totalSecs);
    setRemainingSeconds(totalSecs);
    setStartTime(Date.now());
    setView("ACTIVE_TEST");
  };

  const executeFinalSubmit = async (wasCheated: boolean = false, cheatReason: string = "") => {
    if (isSubmittingRef.current || !currentTest) return;
    isSubmittingRef.current = true;

    const timeSpent = Math.min(totalTestSeconds, Math.max(1, Math.round((Date.now() - startTime) / 1000)));

    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    currentTest.questions.forEach((q: any) => {
      const picked = userAnswers[q.id];
      if (!picked) {
        unattempted++;
      } else if (picked.toUpperCase() === q.correct_option.toUpperCase()) {
        score += 4;
        correct++;
      } else {
        score -= 1;
        incorrect++;
      }
    });

    const submissionPayload = {
      test_id: currentTest.id,
      test_title: currentTest.title,
      student_name: studentName || "Candidate",
      obtained_marks: score,
      total_marks: currentTest.questions.length * 4,
      correct_count: correct,
      incorrect_count: incorrect,
      unattempted_count: unattempted,
      time_spent_seconds: timeSpent,
      cheated: wasCheated,
      cheat_reason: cheatReason,
      answers: userAnswers
    };

    await supabase.from("test_submissions").insert([submissionPayload]);
    fetchSubmissions();

    setViewingReport({
      ...submissionPayload,
      questions: currentTest.questions
    });
    setReviewFilter("ALL");
    setFlippedCards({});
    setView("RESULT_REVIEW");
  };

  // Re-open Past Test for Error Analysis
  const handleReanalyzeSubmission = (sub: any) => {
    const parentTest = tests.find(t => t.id === sub.test_id);
    setViewingReport({
      ...sub,
      questions: parentTest ? parentTest.questions : []
    });
    setReviewFilter("ALL");
    setFlippedCards({});
    setView("RESULT_REVIEW");
  };

  // Direct Word (.docx) & Text File Upload
  const handleWordFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingDoc(true);
    try {
      if (file.name.endsWith(".docx")) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setRawQuestions(result.value);
        alert("✅ Word document read successfully! Content loaded below.");
      } else if (file.name.endsWith(".txt")) {
        const text = await file.text();
        setRawQuestions(text);
        alert("✅ Text file loaded successfully!");
      } else {
        alert("Kripya .docx (Word) ya .txt file choose karein.");
      }
    } catch (err: any) {
      alert("Error reading file: " + err.message);
    } finally {
      setIsProcessingDoc(false);
    }
  };

  // Publish Test (Live or Hidden)
  const handleAdminCreateTest = async () => {
    if (!newTitle.trim() || !rawQuestions.trim()) {
      alert("Title aur Questions text hona zaroori hai.");
      return;
    }

    try {
      const questionBlocks = rawQuestions.split(/Q\d+\./g).filter(b => b.trim());
      const parsedQuestions = questionBlocks.map((block, idx) => {
        const lines = block.trim().split("\n").map(l => l.trim()).filter(Boolean);
        const qText = lines[0];
        const optA = (lines.find(l => l.startsWith("A)")) || "").replace(/^A\)\s*/, "");
        const optB = (lines.find(l => l.startsWith("B)")) || "").replace(/^B\)\s*/, "");
        const optC = (lines.find(l => l.startsWith("C)")) || "").replace(/^C\)\s*/, "");
        const optD = (lines.find(l => l.startsWith("D)")) || "").replace(/^D\)\s*/, "");
        const ansLine = lines.find(l => l.startsWith("Ans:")) || "Ans: A";
        const correctOpt = ansLine.replace("Ans:", "").trim().charAt(0);
        const expLine = lines.find(l => l.includes("Explanation:")) || "";

        return {
          id: idx + 1,
          question_text: qText,
          imageUrl: "",
          option_a: optA,
          option_b: optB,
          option_c: optC,
          option_d: optD,
          correct_option: correctOpt,
          explanation: expLine.replace(/.*Explanation:\s*/, "")
        };
      });

      const newTestRecord = {
        id: `test-${Date.now()}`,
        title: newTitle,
        subject: newSubject,
        duration_mins: Number(newDuration),
        is_active: newIsLive, // LIVE or HIDDEN
        chapters: newChapters.split(",").map(c => c.trim()).filter(Boolean),
        questions: parsedQuestions
      };

      const { error } = await supabase.from("tests").insert([newTestRecord]);
      if (error) throw error;

      alert(`✅ Test successfully saved as ${newIsLive ? "LIVE" : "HIDDEN (Draft)"}!`);
      setNewTitle("");
      setRawQuestions("");
      setNewChapters("");
      fetchTests();
      setIsAdminView(false);
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    }
  };

  // Toggle Live/Hidden from Faculty Table
  const toggleTestLiveStatus = async (testId: string, currentStatus: boolean) => {
    const { error } = await supabase.from("tests").update({ is_active: !currentStatus }).eq("id", testId);
    if (!error) {
      setTests(prev => prev.map(t => t.id === testId ? { ...t, is_active: !currentStatus } : t));
    }
  };

  const toggleCardFlip = (id: number) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-3.5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🩺</span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-cyan-950 tracking-tight">DR. JASMAN</h1>
              <span className="bg-cyan-100 text-cyan-800 text-[10px] px-2 py-0.5 rounded-full font-bold">NEET 2027</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Faculty Controlled Medical Examination Engine</p>
          </div>
        </div>

        <button
          onClick={() => {
            if (isAdminUnlocked) setIsAdminView(!isAdminView);
            else {
              const pass = prompt("Enter Faculty Admin PIN:");
              if (pass === "neet2027") {
                setIsAdminUnlocked(true);
                setIsAdminView(true);
              } else if (pass) alert("Incorrect PIN!");
            }
          }}
          className="text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 transition"
        >
          {isAdminView ? "← Exit Portal" : "Faculty Portal 🔐"}
        </button>
      </header>

      {/* DASHBOARD */}
      {view === "DASHBOARD" && !isAdminView && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          {/* DAILY MOTIVATIONAL BANNER */}
          <div className="relative overflow-hidden bg-gradient-to-r from-cyan-900 via-teal-800 to-cyan-950 rounded-2xl p-6 text-white shadow-md mb-6 border border-cyan-800">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-cyan-700/60 text-cyan-200 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border border-cyan-500/30">
                  Doctor's Motivation 🩺
                </span>
                <span className="text-xs text-cyan-300">Target: 720/720</span>
              </div>
              <p className="text-sm font-medium italic text-cyan-50 leading-relaxed max-w-2xl mt-1">
                {dailyQuote}
              </p>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] text-8xl text-white/5 pointer-events-none select-none font-black">
              AIIMS
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 border-b border-slate-200 pb-2 mb-5">
            <button
              onClick={() => setActiveTab("TESTS")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                activeTab === "TESTS" ? "bg-cyan-900 text-white shadow" : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              Active Exam Shifts
            </button>
            <button
              onClick={() => setActiveTab("MY_REPORTS")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                activeTab === "MY_REPORTS" ? "bg-cyan-900 text-white shadow" : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              Completed Tests & Error Analysis ({allSubmissions.filter(s => s.student_name === studentName).length})
            </button>
          </div>

          {/* 5 CATEGORY FOLDERS */}
          {activeTab === "TESTS" && (
            <>
              <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                      selectedCategory === cat
                        ? "bg-cyan-700 text-white shadow-sm"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span>📁</span> {cat}
                  </button>
                ))}
              </div>

              {/* Only LIVE tests shown to students */}
              <div className="grid gap-4">
                {tests
                  .filter(t => t.is_active && (selectedCategory === "ALL" || t.subject === selectedCategory))
                  .map(t => (
                    <div key={t.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-cyan-800 bg-cyan-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {t.subject}
                          </span>
                          <h2 className="text-base font-bold text-slate-900 mt-2">{t.title}</h2>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {t.chapters?.map((ch: string, idx: number) => (
                              <span key={idx} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                                {ch}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                          ⏱️ {t.duration_mins} Mins
                        </span>
                      </div>

                      <div className="flex justify-between items-center mt-5 pt-3.5 border-t border-slate-100">
                        <span className="text-xs font-bold text-rose-600">🎯 {t.questions?.length || 0} Questions (NEET Pattern)</span>
                        <button
                          onClick={() => handleStartTest(t)}
                          className="bg-cyan-800 hover:bg-cyan-900 text-white font-bold text-xs px-5 py-2 rounded-xl shadow transition"
                        >
                          START SHIFT →
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}

          {/* Student Error Analysis & Past Attempts */}
          {activeTab === "MY_REPORTS" && (
            <div className="grid gap-3">
              {allSubmissions
                .filter(s => s.student_name === studentName)
                .map((r, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900">{r.test_title}</h3>
                        {r.cheated && (
                          <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded">
                            ⚠️ Violation: {r.cheat_reason}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Time Taken: <strong>{formatTime(r.time_spent_seconds)}</strong> • Correct: <span className="text-emerald-600 font-bold">{r.correct_count}</span> • Incorrect: <span className="text-rose-600 font-bold">{r.incorrect_count}</span> • Skipped: <span className="text-slate-600 font-bold">{r.unattempted_count}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xl font-black text-cyan-900">{r.obtained_marks} / {r.total_marks}</span>
                      </div>
                      <button
                        onClick={() => handleReanalyzeSubmission(r)}
                        className="bg-cyan-50 border border-cyan-300 hover:bg-cyan-100 text-cyan-900 text-xs font-bold px-3.5 py-2 rounded-xl transition"
                      >
                        🔍 Re-Analyze Mistakes
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ACTIVE TEST MODE */}
      {view === "ACTIVE_TEST" && currentTest && (
        <div className="max-w-3xl mx-auto px-4 mt-6">
          <div className="sticky top-16 bg-white border border-slate-200 p-3.5 rounded-xl shadow-md mb-6 flex justify-between items-center z-20">
            <div>
              <h2 className="font-bold text-slate-800 text-xs">{currentTest.title}</h2>
              <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider animate-pulse">
                🛡️ Screen lock / tab switch prohibited (Auto-submit active)
              </span>
            </div>
            <div className="bg-rose-50 text-rose-700 font-mono text-base font-black px-3 py-1 rounded-lg border border-rose-200">
              ⏱️ {Math.floor(remainingSeconds / 60)}:{String(remainingSeconds % 60).padStart(2, "0")}
            </div>
          </div>

          <div className="space-y-5">
            {currentTest.questions.map((q: any, idx: number) => (
              <div key={q.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-400 font-bold">QUESTION {idx + 1} OF {currentTest.questions.length}</span>
                <p className="font-semibold text-slate-800 text-sm mt-1 leading-relaxed">{q.question_text}</p>

                <div className="grid gap-2 mt-4">
                  {(["a", "b", "c", "d"] as const).map(optKey => {
                    const optText = q[`option_${optKey}`];
                    const isSelected = userAnswers[q.id] === optKey.toUpperCase();
                    return (
                      <button
                        key={optKey}
                        onClick={() => setUserAnswers(prev => ({ ...prev, [q.id]: optKey.toUpperCase() }))}
                        className={`text-left px-4 py-2.5 rounded-xl border text-xs font-medium transition flex items-center gap-3 ${
                          isSelected ? "bg-cyan-50 border-cyan-600 text-cyan-900 font-bold" : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${
                          isSelected ? "bg-cyan-600 text-white border-cyan-600" : "border-slate-300"
                        }`}>{optKey.toUpperCase()}</span>
                        {optText}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="sticky bottom-4 mt-8 bg-white p-4 rounded-xl border border-slate-200 shadow-lg flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500">
              Attempted: {Object.keys(userAnswers).length} / {currentTest.questions.length}
            </span>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to finish and submit?")) {
                  executeFinalSubmit(false, "Voluntary Submission");
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow transition"
            >
              FINAL SUBMIT SHIFT
            </button>
          </div>
        </div>
      )}

      {/* RESULT REVIEW + ERROR ANALYSIS & 3D FLIP CARDS */}
      {view === "RESULT_REVIEW" && viewingReport && (
        <div className="max-w-3xl mx-auto px-4 mt-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center mb-6">
            <span className="text-xs font-bold text-cyan-700 uppercase tracking-widest">NEET Shift Scorecard & Mistake Analysis</span>
            <h2 className="text-xl font-black text-slate-900 mt-1">{viewingReport.test_title}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Candidate: <strong>{viewingReport.student_name}</strong> • Time Taken: <strong>{formatTime(viewingReport.time_spent_seconds)}</strong>
            </p>

            {viewingReport.cheated && (
              <div className="bg-rose-50 text-rose-700 text-xs font-bold p-2.5 rounded-lg border border-rose-200 my-3">
                ⚠️ Violation: {viewingReport.cheat_reason}
              </div>
            )}

            <div className="text-4xl font-black text-cyan-900 my-4">
              {viewingReport.obtained_marks} <span className="text-sm font-normal text-slate-400">/ {viewingReport.total_marks}</span>
            </div>

            {/* Scorecard quick stats */}
            <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto my-3 text-center">
              <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                <div className="text-base font-bold text-emerald-700">{viewingReport.correct_count}</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Correct (+4)</div>
              </div>
              <div className="bg-rose-50 p-2 rounded-lg border border-rose-100">
                <div className="text-base font-bold text-rose-700">{viewingReport.incorrect_count}</div>
                <div className="text-[10px] text-rose-600 font-semibold">Incorrect (-1)</div>
              </div>
              <div className="bg-slate-100 p-2 rounded-lg">
                <div className="text-base font-bold text-slate-600">{viewingReport.unattempted_count}</div>
                <div className="text-[10px] text-slate-500 font-semibold">Skipped (0)</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-2 mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => setCardFlipMode(!cardFlipMode)}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition ${
                  cardFlipMode ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-900 border border-amber-300"
                }`}
              >
                🔄 {cardFlipMode ? "Exit Flip Card Mode" : "Flashcard / Flip Mode"}
              </button>
              <button
                onClick={() => setView("DASHBOARD")}
                className="bg-slate-900 text-white text-xs font-bold px-4 py-1.5 rounded-xl"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Error Analysis Filters */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Mistake Breakdown:</h3>
            <div className="flex gap-1.5">
              <button
                onClick={() => setReviewFilter("ALL")}
                className={`text-xs font-bold px-3 py-1 rounded-lg border transition ${
                  reviewFilter === "ALL" ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                All ({viewingReport.questions?.length || 0})
              </button>
              <button
                onClick={() => setReviewFilter("INCORRECT")}
                className={`text-xs font-bold px-3 py-1 rounded-lg border transition ${
                  reviewFilter === "INCORRECT" ? "bg-rose-600 text-white border-rose-600" : "bg-white text-rose-600 border-rose-200"
                }`}
              >
                ❌ Incorrect Only ({viewingReport.incorrect_count})
              </button>
              <button
                onClick={() => setReviewFilter("UNATTEMPTED")}
                className={`text-xs font-bold px-3 py-1 rounded-lg border transition ${
                  reviewFilter === "UNATTEMPTED" ? "bg-amber-600 text-white border-amber-600" : "bg-white text-amber-700 border-amber-200"
                }`}
              >
                ⚠️ Skipped Only ({viewingReport.unattempted_count})
              </button>
            </div>
          </div>

          {/* Filtered Question List / Flip Cards */}
          <div className="space-y-4">
            {viewingReport.questions
              ?.filter((q: any) => {
                const ans = viewingReport.answers[q.id];
                if (reviewFilter === "INCORRECT") return ans && ans !== q.correct_option;
                if (reviewFilter === "UNATTEMPTED") return !ans;
                return true;
              })
              .map((q: any, idx: number) => {
                const studentChoice = viewingReport.answers[q.id];
                const isCorrect = studentChoice === q.correct_option;
                const isFlipped = !!flippedCards[q.id];

                if (cardFlipMode) {
                  return (
                    <div
                      key={q.id}
                      onClick={() => toggleCardFlip(q.id)}
                      className="cursor-pointer bg-white border-2 rounded-2xl p-6 shadow-sm hover:border-cyan-600 transition min-h-[170px] flex flex-col justify-between"
                      style={{ borderColor: isFlipped ? "#0891b2" : "#e2e8f0" }}
                    >
                      {!isFlipped ? (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-slate-400">FLIP CARD • QUESTION {idx + 1}</span>
                            <span className="text-[11px] text-cyan-600 font-bold">👆 Click to Flip & See Answer</span>
                          </div>
                          <p className="text-sm font-semibold text-slate-800">{q.question_text}</p>
                          <div className="text-xs text-slate-500 mt-3 font-medium">
                            Your Answer: <strong className={isCorrect ? "text-emerald-600" : studentChoice ? "text-rose-600" : "text-slate-400"}>
                              {studentChoice || "Not Attempted"}
                            </strong>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-cyan-50/70 p-4 rounded-xl border border-cyan-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-cyan-900">SOLUTION & REASONING</span>
                            <span className="text-[11px] text-cyan-700 font-bold">👆 Click to Flip Back</span>
                          </div>
                          <div className="text-xs font-bold text-emerald-700 mb-1">
                            Correct Option: {q.correct_option}
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {q.explanation || "No explanation provided."}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div key={q.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-slate-400">QUESTION {idx + 1}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        isCorrect ? "bg-emerald-100 text-emerald-800" : studentChoice ? "bg-rose-100 text-rose-800" : "bg-slate-100 text-slate-600"
                      }`}>
                        {isCorrect ? "Correct (+4)" : studentChoice ? "Incorrect (-1)" : "Unattempted"}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">{q.question_text}</p>

                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      {(["a", "b", "c", "d"] as const).map(k => (
                        <div
                          key={k}
                          className={`p-2 rounded-lg border ${
                            q.correct_option === k.toUpperCase()
                              ? "bg-emerald-50 border-emerald-300 font-bold text-emerald-900"
                              : studentChoice === k.toUpperCase()
                              ? "bg-rose-50 border-rose-300 text-rose-800"
                              : "border-slate-100 text-slate-600"
                          }`}
                        >
                          <strong>{k.toUpperCase()})</strong> {q[`option_${k}`]}
                        </div>
                      ))}
                    </div>

                    {q.explanation && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                        💡 <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* FACULTY PORTAL (Upload, Live/Hidden Control, Word File) */}
      {isAdminView && (
        <div className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
          {/* Manage Existing Tests (Live vs Hidden) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-1">Manage Test Visibility (Live / Hidden)</h2>
            <p className="text-xs text-slate-500 mb-4">Toggle whether tests appear on student devices or stay draft.</p>

            <div className="border border-slate-200 rounded-xl overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="p-3">Title</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Questions</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map(t => (
                    <tr key={t.id} className="border-b border-slate-100">
                      <td className="p-3 font-bold text-slate-900">{t.title}</td>
                      <td className="p-3 text-slate-600">{t.subject}</td>
                      <td className="p-3 font-medium text-slate-600">{t.questions?.length || 0}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.is_active ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                        }`}>
                          {t.is_active ? "🟢 LIVE" : "⚪ HIDDEN"}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => toggleTestLiveStatus(t.id, t.is_active)}
                          className={`text-[10px] font-bold px-3 py-1 rounded-lg border transition ${
                            t.is_active ? "border-rose-300 text-rose-700 hover:bg-rose-50" : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                          }`}
                        >
                          {t.is_active ? "Hide Test" : "Make Live"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upload New Test with Direct Word File Picker */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-1">Publish New Test with Word File Support</h2>
            <p className="text-xs text-slate-500 mb-4">Directly upload Word document (.docx) or paste questions.</p>

            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <div>
                <label className="font-bold text-slate-700">Test Title</label>
                <input
                  type="text"
                  placeholder="e.g. Zoology Rapid Mock 01"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full border p-2 rounded-lg mt-1"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">Subject Folder</label>
                <select
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  className="w-full border p-2 rounded-lg mt-1"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Botany">Botany</option>
                  <option value="Zoology">Zoology</option>
                  <option value="Full Length Mock Tests">Full Length Mock Tests</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs mb-3">
              <div>
                <label className="font-bold text-slate-700">Timer (Minutes)</label>
                <input
                  type="number"
                  value={newDuration}
                  onChange={e => setNewDuration(Number(e.target.value))}
                  className="w-full border p-2 rounded-lg mt-1"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">Chapters</label>
                <input
                  type="text"
                  placeholder="e.g. Genetics, Human Physiology"
                  value={newChapters}
                  onChange={e => setNewChapters(e.target.value)}
                  className="w-full border p-2 rounded-lg mt-1"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">Default Visibility</label>
                <select
                  value={newIsLive ? "LIVE" : "HIDDEN"}
                  onChange={e => setNewIsLive(e.target.value === "LIVE")}
                  className="w-full border p-2 rounded-lg mt-1 font-bold"
                >
                  <option value="LIVE">🟢 Publish as LIVE</option>
                  <option value="HIDDEN">⚪ Save as HIDDEN (Draft)</option>
                </select>
              </div>
            </div>

            {/* DIRECT WORD FILE UPLOADER */}
            <div className="bg-cyan-50/60 border border-dashed border-cyan-300 rounded-xl p-3.5 mb-3 text-xs">
              <label className="font-bold text-cyan-950 block mb-1">
                📄 Direct Word File (.docx) or Text (.txt) Upload:
              </label>
              <input
                type="file"
                accept=".docx,.txt"
                onChange={handleWordFileUpload}
                disabled={isProcessingDoc}
                className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-700 file:text-white hover:file:bg-cyan-800 cursor-pointer"
              />
              {isProcessingDoc && <span className="text-cyan-700 ml-2 animate-pulse">Reading Word file...</span>}
            </div>

            <div className="text-xs mb-4">
              <label className="font-bold text-slate-700">Questions Raw Preview</label>
              <textarea
                rows={6}
                value={rawQuestions}
                onChange={e => setRawQuestions(e.target.value)}
                placeholder="Content will appear here automatically when you select a Word file..."
                className="w-full border p-2 rounded-lg mt-1 font-mono text-xs"
              />
            </div>

            <button
              onClick={handleAdminCreateTest}
              className="bg-cyan-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow hover:bg-cyan-900 transition"
            >
              Save & Publish Test 🚀
            </button>
          </div>
        </div>
      )}
    </main>
  );
}