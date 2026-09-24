"use client";

import React, { useState, useEffect, useRef } from "react";
// @ts-ignore
import mammoth from "mammoth";

// --- NTA/NMC RATIONALIZED SYLLABUS (0% BASE) ---
const INITIAL_SYLLABUS = [
  // Physics Class 11
  { id: 101, classLevel: "11", subject: "Physics", chapter: "Units & Measurements", completed: false },
  { id: 102, classLevel: "11", subject: "Physics", chapter: "Motion in a Straight Line & Plane", completed: false },
  { id: 103, classLevel: "11", subject: "Physics", chapter: "Laws of Motion", completed: false },
  { id: 104, classLevel: "11", subject: "Physics", chapter: "Work, Energy & Power", completed: false },
  { id: 105, classLevel: "11", subject: "Physics", chapter: "System of Particles & Rotational Motion", completed: false },
  { id: 106, classLevel: "11", subject: "Physics", chapter: "Gravitation", completed: false },
  { id: 107, classLevel: "11", subject: "Physics", chapter: "Mechanical Properties of Solids & Fluids", completed: false },
  { id: 108, classLevel: "11", subject: "Physics", chapter: "Thermal Properties & Thermodynamics", completed: false },
  { id: 109, classLevel: "11", subject: "Physics", chapter: "Kinetic Theory of Gases", completed: false },
  { id: 110, classLevel: "11", subject: "Physics", chapter: "Oscillations & Waves", completed: false },

  // Physics Class 12
  { id: 111, classLevel: "12", subject: "Physics", chapter: "Electric Charges & Fields", completed: false },
  { id: 112, classLevel: "12", subject: "Physics", chapter: "Electrostatic Potential & Capacitance", completed: false },
  { id: 113, classLevel: "12", subject: "Physics", chapter: "Current Electricity", completed: false },
  { id: 114, classLevel: "12", subject: "Physics", chapter: "Moving Charges & Magnetism", completed: false },
  { id: 115, classLevel: "12", subject: "Physics", chapter: "Magnetism & Matter", completed: false },
  { id: 116, classLevel: "12", subject: "Physics", chapter: "Electromagnetic Induction & AC", completed: false },
  { id: 117, classLevel: "12", subject: "Physics", chapter: "Electromagnetic Waves", completed: false },
  { id: 118, classLevel: "12", subject: "Physics", chapter: "Ray Optics & Optical Instruments", completed: false },
  { id: 119, classLevel: "12", subject: "Physics", chapter: "Wave Optics", completed: false },
  { id: 120, classLevel: "12", subject: "Physics", chapter: "Dual Nature of Radiation & Matter", completed: false },
  { id: 121, classLevel: "12", subject: "Physics", chapter: "Atoms & Nuclei", completed: false },
  { id: 122, classLevel: "12", subject: "Physics", chapter: "Semiconductors & Electronic Devices", completed: false },
  { id: 123, classLevel: "12", subject: "Physics", chapter: "Experimental Physics & Skills", completed: false },

  // Chemistry Class 11
  { id: 201, classLevel: "11", subject: "Chemistry", chapter: "Some Basic Concepts of Chemistry (Mole Concept)", completed: false },
  { id: 202, classLevel: "11", subject: "Chemistry", chapter: "Structure of Atom", completed: false },
  { id: 203, classLevel: "11", subject: "Chemistry", chapter: "Classification of Elements & Periodicity", completed: false },
  { id: 204, classLevel: "11", subject: "Chemistry", chapter: "Chemical Bonding & Molecular Structure", completed: false },
  { id: 205, classLevel: "11", subject: "Chemistry", chapter: "Chemical Thermodynamics", completed: false },
  { id: 206, classLevel: "11", subject: "Chemistry", chapter: "Equilibrium", completed: false },
  { id: 207, classLevel: "11", subject: "Chemistry", chapter: "Redox Reactions", completed: false },
  { id: 208, classLevel: "11", subject: "Chemistry", chapter: "Organic Chemistry: Some Basic Principles & Techniques (GOC)", completed: false },
  { id: 209, classLevel: "11", subject: "Chemistry", chapter: "Hydrocarbons", completed: false },

  // Chemistry Class 12
  { id: 210, classLevel: "12", subject: "Chemistry", chapter: "Solutions", completed: false },
  { id: 211, classLevel: "12", subject: "Chemistry", chapter: "Electrochemistry", completed: false },
  { id: 212, classLevel: "12", subject: "Chemistry", chapter: "Chemical Kinetics", completed: false },
  { id: 213, classLevel: "12", subject: "Chemistry", chapter: "d- and f-Block Elements", completed: false },
  { id: 214, classLevel: "12", subject: "Chemistry", chapter: "Coordination Compounds", completed: false },
  { id: 215, classLevel: "12", subject: "Chemistry", chapter: "Haloalkanes & Haloarenes", completed: false },
  { id: 216, classLevel: "12", subject: "Chemistry", chapter: "Alcohols, Phenols & Ethers", completed: false },
  { id: 217, classLevel: "12", subject: "Chemistry", chapter: "Aldehydes, Ketones & Carboxylic Acids", completed: false },
  { id: 218, classLevel: "12", subject: "Chemistry", chapter: "Amines", completed: false },
  { id: 219, classLevel: "12", subject: "Chemistry", chapter: "Biomolecules", completed: false },
  { id: 220, classLevel: "12", subject: "Chemistry", chapter: "Principles Related to Practical Chemistry", completed: false },

  // Botany Class 11
  { id: 301, classLevel: "11", subject: "Botany", chapter: "Biological Classification & Living World", completed: false },
  { id: 302, classLevel: "11", subject: "Botany", chapter: "Plant Kingdom", completed: false },
  { id: 303, classLevel: "11", subject: "Botany", chapter: "Morphology & Anatomy of Flowering Plants", completed: false },
  { id: 304, classLevel: "11", subject: "Botany", chapter: "Cell: The Unit of Life & Cell Cycle", completed: false },
  { id: 305, classLevel: "11", subject: "Botany", chapter: "Photosynthesis in Higher Plants", completed: false },
  { id: 306, classLevel: "11", subject: "Botany", chapter: "Respiration in Plants", completed: false },
  { id: 307, classLevel: "11", subject: "Botany", chapter: "Plant Growth and Development", completed: false },

  // Botany Class 12
  { id: 308, classLevel: "12", subject: "Botany", chapter: "Sexual Reproduction in Flowering Plants", completed: false },
  { id: 309, classLevel: "12", subject: "Botany", chapter: "Principles of Inheritance & Variation (Genetics I)", completed: false },
  { id: 310, classLevel: "12", subject: "Botany", chapter: "Molecular Basis of Inheritance (Genetics II)", completed: false },
  { id: 311, classLevel: "12", subject: "Botany", chapter: "Organisms and Populations", completed: false },
  { id: 312, classLevel: "12", subject: "Botany", chapter: "Ecosystem Dynamics", completed: false },
  { id: 313, classLevel: "12", subject: "Botany", chapter: "Biodiversity and Its Conservation", completed: false },

  // Zoology Class 11
  { id: 401, classLevel: "11", subject: "Zoology", chapter: "Animal Kingdom", completed: false },
  { id: 402, classLevel: "11", subject: "Zoology", chapter: "Structural Organisation in Animals (Frog/Tissues)", completed: false },
  { id: 403, classLevel: "11", subject: "Zoology", chapter: "Breathing and Exchange of Gases", completed: false },
  { id: 404, classLevel: "11", subject: "Zoology", chapter: "Body Fluids and Circulation", completed: false },
  { id: 405, classLevel: "11", subject: "Zoology", chapter: "Excretory Products and Their Elimination", completed: false },
  { id: 406, classLevel: "11", subject: "Zoology", chapter: "Locomotion and Movement", completed: false },
  { id: 407, classLevel: "11", subject: "Zoology", chapter: "Neural Control and Coordination", completed: false },
  { id: 408, classLevel: "11", subject: "Zoology", chapter: "Chemical Coordination and Integration", completed: false },

  // Zoology Class 12
  { id: 409, classLevel: "12", subject: "Zoology", chapter: "Human Reproduction", completed: false },
  { id: 410, classLevel: "12", subject: "Zoology", chapter: "Reproductive Health", completed: false },
  { id: 411, classLevel: "12", subject: "Zoology", chapter: "Evolution", completed: false },
  { id: 412, classLevel: "12", subject: "Zoology", chapter: "Human Health and Diseases", completed: false },
  { id: 413, classLevel: "12", subject: "Zoology", chapter: "Biotechnology: Principles and Processes", completed: false },
  { id: 414, classLevel: "12", subject: "Zoology", chapter: "Biotechnology and Its Applications", completed: false }
];

const CLINICAL_FLASHCARDS: { [key: string]: { fact: string; tip: string; quote: string } } = {
  "Current Electricity": {
    fact: "Kirchhoff's Junction Law = Conservation of Charge. Loop Law = Conservation of Energy. Drift velocity vd = (e * E * tau) / m.",
    tip: "Meter Bridge follows Wheatstone condition (P/Q = R/S). Always check balance point from the zero end!",
    quote: "Precision in circuit laws today leads to flawless ECG analysis tomorrow. 🤍"
  },
  "Moving Charges & Magnetism": {
    fact: "Lorentz Force: F = q(E + v x B). Magnetic field on axis of circular loop: B = (mu0 * I * R^2) / [2(R^2 + x^2)^(3/2)].",
    tip: "A charged particle perpendicular to B moves in a circle; helical if velocity has a component parallel to B.",
    quote: "Stay focused and undeflected like a targeted radiation beam, Dr. Jasman! 🩺"
  },
  "Magnetism & Matter": {
    fact: "Diamagnetic materials have chi < 0. Paramagnetic follow Curie's Law (chi proportional to 1/T). Ferromagnetic retain domain alignment.",
    tip: "Net magnetic flux through any closed Gaussian surface is ALWAYS zero (no magnetic monopoles).",
    quote: "Unwavering consistency is your greatest magnetic strength."
  },
  "Electromagnetic Induction & AC": {
    fact: "Faraday's Law: EMF = -N(dPhi/dt). Lenz's Law obeys Conservation of Energy.",
    tip: "In pure inductor L, voltage leads current by 90 deg. In pure capacitor C, current leads voltage by 90 deg.",
    quote: "Resistance is temporary; current always finds a path forward. 🤍"
  },
  "General": {
    fact: "Review NCERT diagrams, footnotes and summaries. Most NEET conceptual direct lines emerge straight from them.",
    tip: "Eliminate two wrong choices first. Avoid negative marking on 50/50 doubts.",
    quote: "Mistakes made in practice save precious marks on NEET day. Turn errors into mastery! 🩺"
  }
};

const INITIAL_TESTS = [
  {
    id: "test-physics-em",
    title: "Shift 01: Electromagnetism & Induction Sprint",
    subject: "Physics",
    chapters: ["Current Electricity", "Moving Charges & Magnetism", "Magnetism & Matter", "Electromagnetic Induction & AC"],
    durationMins: 45,
    isActive: true,
    questions: [
      {
        id: 1,
        subject: "Physics",
        classLevel: "12",
        chapter: "Current Electricity",
        question_text: "A wire of resistance 12 ohm is bent into a circular ring. What is the effective resistance between two diametrically opposite points?",
        imageUrl: "",
        option_a: "12 ohm",
        option_b: "6 ohm",
        option_c: "3 ohm",
        option_d: "1.5 ohm",
        correct_option: "C",
        explanation: "The two halves each have resistance 6 ohm in parallel: R_eq = (6 * 6)/(6 + 6) = 3 ohm."
      },
      {
        id: 2,
        subject: "Physics",
        classLevel: "12",
        chapter: "Moving Charges & Magnetism",
        question_text: "A charged particle moves with velocity v in a uniform magnetic field B perpendicular to it. The radius of the circular path is directly proportional to:",
        imageUrl: "",
        option_a: "Charge of particle (q)",
        option_b: "Momentum of particle (p)",
        option_c: "Magnetic field intensity (B)",
        option_d: "Kinetic energy squared",
        correct_option: "B",
        explanation: "Radius r = mv / (qB) = p / (qB). Hence radius is directly proportional to linear momentum p."
      }
    ]
  }
];

export default function DrJasmanApp() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [pinError, setPinError] = useState("");

  const [view, setView] = useState("DASHBOARD");
  const [activeTab, setActiveTab] = useState("TESTS");
  const [selectedClassFilter, setSelectedClassFilter] = useState("ALL");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("ALL");

  const [syllabus, setSyllabus] = useState(INITIAL_SYLLABUS);
  const [testsCatalog, setTestsCatalog] = useState(INITIAL_TESTS);
  const [errorLog, setErrorLog] = useState<{ [chapter: string]: number }>({});
  const [dutyStreak, setDutyStreak] = useState(1);

  // New Chapter Form state
  const [newChapterForm, setNewChapterForm] = useState({
    subject: "Physics",
    classLevel: "11",
    chapter: ""
  });

  // Active Test Engine States
  const [currentTest, setCurrentTest] = useState<any>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [idx: number]: string }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<{ [idx: number]: boolean }>({});
  const [questionTimes, setQuestionTimes] = useState<{ [idx: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [omrOpen, setOmrOpen] = useState(false);
  const [shiftResult, setShiftResult] = useState<any>(null);

  // Anti-Cheating & Integrity Guard
  const [switchStrikes, setSwitchStrikes] = useState(0);
  const [strikeWarningModal, setStrikeWarningModal] = useState(false);
  const isSubmittedRef = useRef(false);

  // Flashcards Lockout
  const [reviewedCards, setReviewedCards] = useState<{ [chapter: string]: boolean }>({});
  const [flippedCards, setFlippedCards] = useState<{ [chapter: string]: boolean }>({});

  // Faculty Admin New Test Form
  const [newTestForm, setNewTestForm] = useState({
    title: "",
    subject: "Physics",
    durationMins: 45,
    chapters: "",
    rawBulkQuestions: "",
    startActive: true
  });
  const [pastedImage, setPastedImage] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.pathname.includes("/admin") || window.location.hash.includes("admin")) {
        setIsAdminView(true);
      }
    }
  }, []);

  useEffect(() => {
    const savedSyllabus = localStorage.getItem("dr_jasman_syll_v6");
    if (savedSyllabus) setSyllabus(JSON.parse(savedSyllabus));

    const savedTests = localStorage.getItem("dr_jasman_tests_v6");
    if (savedTests) setTestsCatalog(JSON.parse(savedTests));

    const savedErrors = localStorage.getItem("dr_jasman_errors_v6");
    if (savedErrors) setErrorLog(JSON.parse(savedErrors));

    const savedStreak = localStorage.getItem("dr_jasman_streak_v6");
    if (savedStreak) setDutyStreak(Number(savedStreak));
  }, []);

  const saveSyllabus = (newList: any) => {
    setSyllabus(newList);
    localStorage.setItem("dr_jasman_syll_v6", JSON.stringify(newList));
  };

  const saveTests = (newTests: any) => {
    setTestsCatalog(newTests);
    localStorage.setItem("dr_jasman_tests_v6", JSON.stringify(newTests));
  };

  const saveErrors = (newErrors: any) => {
    setErrorLog(newErrors);
    localStorage.setItem("dr_jasman_errors_v6", JSON.stringify(newErrors));
  };

  // Anti-Cheating Listeners
  useEffect(() => {
    if (view !== "ACTIVE_SHIFT") return;

    const handleVisibilityChange = () => {
      if (document.hidden) handleUserSwitchedApp();
    };

    const handleWindowBlur = () => {
      handleUserSwitchedApp();
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    window.history.pushState(null, "", window.location.href);
    const handlePop = () => {
      if (isSubmittedRef.current) return;
      alert("🚨 Back navigation disabled during active medical duty. Use Submit Shift.");
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePop);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("popstate", handlePop);
    };
  }, [view, switchStrikes]);

  const handleUserSwitchedApp = () => {
    if (isSubmittedRef.current) return;
    if (switchStrikes === 0) {
      setSwitchStrikes(1);
      setStrikeWarningModal(true);
    } else {
      completeShift("AUTO_SUBMIT_STRIKE_OUT");
    }
  };

  // Countdown Timer & Time Tracker
  useEffect(() => {
    if (view !== "ACTIVE_SHIFT") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          completeShift("TIMER_EXPIRED");
          return 0;
        }
        return prev - 1;
      });

      setQuestionTimes((prev) => ({
        ...prev,
        [currentQIndex]: (prev[currentQIndex] || 0) + 1
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [view, currentQIndex]);

  const handleStartShift = (test: any) => {
    setCurrentTest(test);
    setView("BRIEFING");
  };

  const handleBeginExam = () => {
    isSubmittedRef.current = false;
    setCurrentQIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setQuestionTimes({});
    setSwitchStrikes(0);
    setReviewedCards({});
    setFlippedCards({});
    setTimeLeft(currentTest.durationMins * 60);
    setView("ACTIVE_SHIFT");
  };

  const completeShift = (reason = "NORMAL_SUBMISSION") => {
    if (isSubmittedRef.current) return;
    isSubmittedRef.current = true;

    const questions = currentTest.questions;
    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    const currentRunErrors: { [chapter: string]: number } = {};
    const slowQuestions: number[] = [];

    questions.forEach((q: any, idx: number) => {
      const ans = userAnswers[idx];
      const timeSpent = questionTimes[idx] || 0;
      if (timeSpent > 150) slowQuestions.push(idx + 1);

      if (!ans) {
        unattempted++;
      } else if (ans === q.correct_option) {
        score += 4;
        correct++;
      } else {
        score -= 1;
        incorrect++;
        currentRunErrors[q.chapter] = (currentRunErrors[q.chapter] || 0) + 1;
      }
    });

    const updatedErrors = { ...errorLog };
    Object.keys(currentRunErrors).forEach((ch) => {
      updatedErrors[ch] = (updatedErrors[ch] || 0) + currentRunErrors[ch];
    });
    saveErrors(updatedErrors);

    const newStreak = dutyStreak + 1;
    setDutyStreak(newStreak);
    localStorage.setItem("dr_jasman_streak_v6", String(newStreak));

    const attemptedTotal = correct + incorrect;
    const accuracy = attemptedTotal > 0 ? Number(((correct / attemptedTotal) * 100).toFixed(1)) : 0;
    const weakList = Object.keys(currentRunErrors).sort((a, b) => currentRunErrors[b] - currentRunErrors[a]);

    setShiftResult({
      score,
      totalMarks: questions.length * 4,
      correct,
      incorrect,
      unattempted,
      accuracy,
      weakChapters: weakList,
      slowQuestions,
      reason,
      timeSpentMins: Math.max(1, Math.round((currentTest.durationMins * 60 - timeLeft) / 60))
    });

    setView("SUMMARY");
  };

  // Parser: Handles text, options, answers, and image tags
  const parseBulkQuestions = (text: string, subject: string, fallbackImg = "") => {
    const rawBlocks = text.split(/Q\d+[\.:\)]/i).filter((b) => b.trim().length > 5);
    const parsed: any[] = [];

    rawBlocks.forEach((block, i) => {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      let qText = "";
      let optA = "";
      let optB = "";
      let optC = "";
      let optD = "";
      let ans = "A";
      let chapter = "General";
      let img = fallbackImg;

      lines.forEach((line) => {
        if (/^A[\)\.:]/i.test(line)) optA = line.replace(/^A[\)\.:]\s*/i, "");
        else if (/^B[\)\.:]/i.test(line)) optB = line.replace(/^B[\)\.:]\s*/i, "");
        else if (/^C[\)\.:]/i.test(line)) optC = line.replace(/^C[\)\.:]\s*/i, "");
        else if (/^D[\)\.:]/i.test(line)) optD = line.replace(/^D[\)\.:]\s*/i, "");
        else if (/^Ans[\.:\s]/i.test(line)) {
          const match = line.match(/[A-D]/i);
          if (match) ans = match[0].toUpperCase();
        } else if (/^Chapter[\.:\s]/i.test(line)) {
          chapter = line.replace(/^Chapter[\.:\s]*/i, "");
        } else if (/^Image[\.:\s]/i.test(line)) {
          img = line.replace(/^Image[\.:\s]*/i, "").trim();
        } else if (!optA) {
          qText += " " + line;
        }
      });

      if (qText && optA && optB) {
        parsed.push({
          id: Date.now() + i,
          subject,
          classLevel: "12",
          chapter: chapter.trim() || "General",
          question_text: qText.trim(),
          imageUrl: img,
          option_a: optA,
          option_b: optB,
          option_c: optC || "None of these",
          option_d: optD || "Both A and B",
          correct_option: ans,
          explanation: `Correct key: Option ${ans}. Revise concepts directly from NCERT.`
        });
      }
    });

    return parsed;
  };

  // Word (.docx) & Text File Reader
  const handleWordFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);

    if (file.name.endsWith(".docx")) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        try {
          const result = await mammoth.extractRawText({ arrayBuffer });
          setNewTestForm((prev) => ({
            ...prev,
            rawBulkQuestions: prev.rawBulkQuestions ? prev.rawBulkQuestions + "\n\n" + result.value : result.value
          }));
          alert(`Successfully extracted questions from "${file.name}"!`);
        } catch (err) {
          alert("Could not read Word file. Ensure it is a standard .docx document.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setNewTestForm((prev) => ({
          ...prev,
          rawBulkQuestions: prev.rawBulkQuestions ? prev.rawBulkQuestions + "\n\n" + text : text
        }));
      };
      reader.readAsText(file);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPastedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePasteEvent = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = () => {
            setPastedImage(reader.result as string);
            alert("Diagram successfully attached from clipboard! 🖼️");
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  // Delete Test Handler
  const handleDeleteTest = (testId: string) => {
    if (confirm("Are you sure you want to permanently delete this test?")) {
      const updated = testsCatalog.filter((t) => t.id !== testId);
      saveTests(updated);
    }
  };

  // Toggle Hide / Live Handler
  const handleToggleTestActive = (testId: string) => {
    const updated = testsCatalog.map((t) =>
      t.id === testId ? { ...t, isActive: !t.isActive } : t
    );
    saveTests(updated);
  };

  // Add Chapter Handler
  const handleAddChapter = () => {
    if (!newChapterForm.chapter.trim()) {
      alert("Please enter a chapter name.");
      return;
    }
    const newChapObj = {
      id: Date.now(),
      classLevel: newChapterForm.classLevel,
      subject: newChapterForm.subject,
      chapter: newChapterForm.chapter.trim(),
      completed: false
    };
    const updated = [...syllabus, newChapObj];
    saveSyllabus(updated);
    setNewChapterForm({ ...newChapterForm, chapter: "" });
    alert(`Added "${newChapObj.chapter}" to ${newChapObj.subject} (Class ${newChapObj.classLevel})!`);
  };

  // Delete Chapter Handler
  const handleDeleteChapter = (chapId: number, chapName: string) => {
    if (confirm(`Remove "${chapName}" from syllabus checklist?`)) {
      const updated = syllabus.filter((item) => item.id !== chapId);
      saveSyllabus(updated);
    }
  };

  // Metrics
  const totalChaptersCount = syllabus.length;
  const completedChaptersCount = syllabus.filter((c) => c.completed).length;

  const c11List = syllabus.filter((c) => c.classLevel === "11");
  const c11Done = c11List.filter((c) => c.completed).length;
  const c11Percent = c11List.length > 0 ? Math.round((c11Done / c11List.length) * 100) : 0;

  const c12List = syllabus.filter((c) => c.classLevel === "12");
  const c12Done = c12List.filter((c) => c.completed).length;
  const c12Percent = c12List.length > 0 ? Math.round((c12Done / c12List.length) * 100) : 0;

  const activeQuestions = currentTest?.questions || [];
  const activeQ = activeQuestions[currentQIndex] || {};

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerDisplay = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const allCardsCleared = shiftResult
    ? shiftResult.weakChapters.length === 0 ||
      shiftResult.weakChapters.every((ch: string) => reviewedCards[ch])
    : true;

  return (
    <div
      className={`min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col ${
        view === "ACTIVE_SHIFT" ? "select-none selection:bg-transparent" : ""
      }`}
      onContextMenu={(e) => {
        if (view === "ACTIVE_SHIFT") e.preventDefault();
      }}
    >
      {/* Top Clinical Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 py-3 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center text-lg font-bold shadow-md shadow-sky-600/20">
              🩺
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-base sm:text-lg tracking-tight">DR. JASMAN</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-sky-100 text-sky-800 border border-sky-200">
                  NEET 2027
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Class 11 & 12 Medical Preparation Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold flex items-center gap-1 shadow-sm">
              <span>🔥</span>
              <span className="hidden sm:inline">Duty Streak:</span> {dutyStreak} Days
            </div>

            {isAdminView && (
              <span className="px-2.5 py-1 rounded-xl bg-purple-100 text-purple-900 text-xs font-bold border border-purple-300">
                👑 Admin Terminal
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Secret Admin Authentication Modal */}
      {isAdminView && !isAdminUnlocked && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-slate-200 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl mb-4 font-bold">
              🔐
            </div>
            <h3 className="text-lg font-black text-slate-900">Faculty Secure Authentication</h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter your passcode to manage test papers and syllabus checklists.
            </p>
            <input
              type="password"
              placeholder="Enter PIN (neet2027)"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              className="w-full mt-4 p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:border-purple-600"
            />
            {pinError && <p className="text-xs text-rose-600 mt-2 font-bold">{pinError}</p>}

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setIsAdminView(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Back to Student
              </button>
              <button
                onClick={() => {
                  if (adminPin === "neet2027") {
                    setIsAdminUnlocked(true);
                    setPinError("");
                  } else {
                    setPinError("Invalid Passcode. Access Denied.");
                  }
                }}
                className="flex-1 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Unlock Terminal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 1: STUDENT DASHBOARD ================= */}
      {view === "DASHBOARD" && !isAdminUnlocked && (
        <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 space-y-6 flex-1">
          {/* Hero Motivation Card */}
          <div className="bg-gradient-to-br from-white via-sky-50/40 to-teal-50/40 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[11px] font-extrabold text-sky-700 tracking-wider uppercase bg-sky-100/70 px-2.5 py-0.5 rounded-full border border-sky-200">
                ACTIVE ON-CALL RESIDENT
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Good morning, Dr. Jasman.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg leading-relaxed">
                “Every single question solved is one diagnosis mastered, one step closer to your white coat.” 🤍
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-2xl flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <div>
                <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">MISSION STATUS</span>
                <span className="text-xs font-extrabold text-emerald-950">Duty Ready (Target NEET-UG)</span>
              </div>
            </div>
          </div>

          {/* Class 11 & 12 Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-extrabold text-slate-700 uppercase">Class 11 Foundation Mastery</span>
                <span className="text-xs font-black text-teal-600">{c11Percent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-teal-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${c11Percent}%` }}></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-semibold">
                <span>{c11Done} of {c11List.length} Chapters Mastered</span>
                <span>{c11List.length - c11Done} Pending</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-extrabold text-slate-700 uppercase">Class 12 Advanced Mastery</span>
                <span className="text-xs font-black text-indigo-600">{c12Percent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${c12Percent}%` }}></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-semibold">
                <span>{c12Done} of {c12List.length} Chapters Mastered</span>
                <span>{c12List.length - c12Done} Pending</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 gap-6">
            <button
              onClick={() => setActiveTab("TESTS")}
              className={`pb-3 text-xs sm:text-sm font-extrabold border-b-2 transition ${
                activeTab === "TESTS" ? "border-sky-600 text-sky-700" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              📋 Clinical Shift Rotations ({testsCatalog.filter((t) => t.isActive).length})
            </button>
            <button
              onClick={() => setActiveTab("SYLLABUS")}
              className={`pb-3 text-xs sm:text-sm font-extrabold border-b-2 transition ${
                activeTab === "SYLLABUS" ? "border-sky-600 text-sky-700" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              📚 Syllabus Checklist ({completedChaptersCount}/{totalChaptersCount})
            </button>
            <button
              onClick={() => setActiveTab("ERRORS")}
              className={`pb-3 text-xs sm:text-sm font-extrabold border-b-2 transition ${
                activeTab === "ERRORS" ? "border-rose-600 text-rose-700" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              🚨 Diagnostic Error Log ({Object.keys(errorLog).length})
            </button>
          </div>

          {/* TAB 1: TESTS */}
          {activeTab === "TESTS" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {["ALL", "Physics", "Chemistry", "Botany", "Zoology", "Full Rotation"].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubjectFilter(sub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedSubjectFilter === sub
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {testsCatalog.filter((t) => t.isActive).length === 0 ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                  <span className="text-3xl block mb-2">🩺</span>
                  <p className="text-sm font-bold text-slate-800">No Active Rotations Scheduled</p>
                  <p className="text-xs text-slate-500 mt-1">Your next clinical exam will appear here when scheduled by faculty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testsCatalog
                    .filter((t) => t.isActive)
                    .filter((t) => selectedSubjectFilter === "ALL" || t.subject === selectedSubjectFilter)
                    .map((t) => (
                      <div
                        key={t.id}
                        className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-sky-500/70 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-sky-100 text-sky-800 border border-sky-200">
                              {t.subject}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-500">⏱ {t.durationMins} Mins</span>
                          </div>
                          <h3 className="text-base font-black text-slate-900">{t.title}</h3>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {t.chapters.map((ch: string, idx: number) => (
                              <span key={idx} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                                {ch}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500">🎯 {t.questions.length} NEET Cases</span>
                          <button
                            onClick={() => handleStartShift(t)}
                            className="px-4 py-2 bg-gradient-to-r from-sky-600 to-teal-600 hover:opacity-90 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-600/20 transition"
                          >
                            START SHIFT →
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SYLLABUS */}
          {activeTab === "SYLLABUS" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                {["ALL", "11", "12"].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedClassFilter(lvl)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedClassFilter === lvl ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600"
                    }`}
                  >
                    {lvl === "ALL" ? "All Rationalized Units" : `Class ${lvl} Only`}
                  </button>
                ))}
              </div>

              {["Physics", "Chemistry", "Botany", "Zoology"].map((sub) => {
                const chapters = syllabus
                  .filter((item) => item.subject === sub)
                  .filter((item) => selectedClassFilter === "ALL" || item.classLevel === selectedClassFilter);

                if (chapters.length === 0) return null;
                const doneCount = chapters.filter((c) => c.completed).length;

                return (
                  <div key={sub} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                      <h3 className="font-black text-slate-900 text-sm sm:text-base">{sub}</h3>
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                        {doneCount} / {chapters.length} Mastered
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {chapters.map((chap) => (
                        <div
                          key={chap.id}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs transition ${
                            chap.completed ? "bg-emerald-50/50 border-emerald-200" : "bg-white border-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${chap.completed ? "text-emerald-600" : "text-slate-300"}`}>
                              {chap.completed ? "✓" : "○"}
                            </span>
                            <span className={`font-semibold ${chap.completed ? "line-through text-slate-400" : "text-slate-800"}`}>
                              {chap.chapter}
                            </span>
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-mono">
                            Cl {chap.classLevel}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: DIAGNOSTIC ERROR LOG */}
          {activeTab === "ERRORS" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Dr. Jasman's Clinical Mistake Book</h3>
                <p className="text-xs text-slate-500">
                  Chapters where negative marking accumulated in previous shifts. Priority revision targets:
                </p>
              </div>

              {Object.keys(errorLog).length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-3xl block mb-2">🩺</span>
                  <p className="text-sm font-bold text-slate-800">Clean Diagnostic Record!</p>
                  <p className="text-xs text-slate-500 mt-1">No negative marks logged yet. Keep your accuracy 100% on the next shift.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {Object.entries(errorLog)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .map(([chap, count]) => (
                      <div key={chap} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black text-xs">
                            -{count}
                          </span>
                          <div>
                            <span className="text-xs sm:text-sm font-bold text-slate-900 block">{chap}</span>
                            <span className="text-[10px] text-rose-600 font-semibold">High Yield Error Frequency</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
                          Requires NCERT Line Revision
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= VIEW 2: FACULTY ADMIN CONTROL DESK ================= */}
      {isAdminUnlocked && (
        <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 space-y-6 flex-1">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-300 shadow-md flex justify-between items-center">
            <div>
              <span className="text-[11px] font-extrabold uppercase bg-purple-100 text-purple-800 px-3 py-1 rounded-full border border-purple-200">
                FACULTY CONTROL DESK
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">Curriculum & Paper Setting Center</h2>
              <p className="text-xs text-slate-500 mt-1">
                Upload Word files, delete tests, manage custom chapters, or toggle syllabus checklists.
              </p>
            </div>
            <button
              onClick={() => {
                setIsAdminUnlocked(false);
                setIsAdminView(false);
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
            >
              Exit Faculty Desk
            </button>
          </div>

          {/* SECTION 1: MANAGE SCHEDULED TESTS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-slate-900">📋 Scheduled Shifts Manager</h3>
                <p className="text-xs text-slate-500">Hide tests to keep them as drafts, or delete accidental uploads.</p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
                {testsCatalog.length} Total Tests
              </span>
            </div>

            {testsCatalog.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No tests created yet. Use the builder below to add one.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {testsCatalog.map((t) => (
                  <div key={t.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-xs sm:text-sm">{t.title}</span>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          t.isActive ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {t.isActive ? "● Live for Student" : "○ Hidden / Draft"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {t.subject} • {t.questions.length} Questions • {t.durationMins} Mins
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleTestActive(t.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          t.isActive
                            ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {t.isActive ? "👁️ Hide from Student" : "🚀 Make Live Now"}
                      </button>
                      <button
                        onClick={() => handleDeleteTest(t.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: TEST BUILDER */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-base font-black text-slate-900">➕ Create & Schedule New Clinical Shift</h3>

            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs font-extrabold text-sky-950 block">📄 Upload Word Test Paper (.docx / .txt)</span>
                <span className="text-[11px] text-slate-500">
                  Select a Word document from your phone or PC. It will auto-populate the questions below.
                </span>
                {uploadedFileName && (
                  <span className="text-xs text-teal-700 font-bold block mt-1">✓ Loaded: {uploadedFileName}</span>
                )}
              </div>
              <label className="cursor-pointer px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-sm transition">
                <span>Select File 📁</span>
                <input type="file" accept=".docx,.txt" onChange={handleWordFileUpload} className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Test Title</label>
                <input
                  type="text"
                  placeholder="e.g. Shift 03: Electrodynamics Rapid Fire"
                  value={newTestForm.title}
                  onChange={(e) => setNewTestForm({ ...newTestForm, title: e.target.value })}
                  className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Subject Category</label>
                <select
                  value={newTestForm.subject}
                  onChange={(e) => setNewTestForm({ ...newTestForm, subject: e.target.value })}
                  className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Botany">Botany</option>
                  <option value="Zoology">Zoology</option>
                  <option value="Full Rotation">Full Rotation</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Exam Timer (Minutes)</label>
                <input
                  type="number"
                  value={newTestForm.durationMins}
                  onChange={(e) => setNewTestForm({ ...newTestForm, durationMins: Number(e.target.value) })}
                  className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-xs font-bold text-slate-700">Covered Chapters (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Current Electricity, Moving Charges, Magnetism"
                  value={newTestForm.chapters}
                  onChange={(e) => setNewTestForm({ ...newTestForm, chapters: e.target.value })}
                  className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="sm:col-span-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">🖼️ Attach Diagram / Circuit Figure</span>
                    <span className="text-[11px] text-slate-500">
                      Paste a screenshot directly (<strong>Ctrl + V</strong>) or pick from device gallery.
                    </span>
                  </div>
                  <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl shadow-sm">
                    <span>Gallery / Photo 📷</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>

                {pastedImage && (
                  <div className="mt-3 flex items-center gap-3">
                    <img src={pastedImage} alt="Diagram preview" className="h-16 w-auto rounded-lg border border-slate-300" />
                    <div>
                      <span className="text-xs text-emerald-700 font-bold block">✓ Figure attached</span>
                      <button
                        onClick={() => setPastedImage("")}
                        className="text-[11px] text-rose-600 underline font-semibold mt-0.5"
                      >
                        Remove Diagram
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="sm:col-span-3">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Questions Raw Box (Freely select, edit, delete, or type)
                  </label>
                  {newTestForm.rawBulkQuestions && (
                    <button
                      onClick={() => setNewTestForm({ ...newTestForm, rawBulkQuestions: "" })}
                      className="text-[11px] text-rose-600 hover:underline font-semibold"
                    >
                      Clear Raw Box
                    </button>
                  )}
                </div>
                <textarea
                  rows={8}
                  onPaste={handlePasteEvent}
                  placeholder={`Q1. What is the magnetic field inside a long straight solenoid?\nA) Zero\nB) mu0 * n * I\nC) 2 * mu0 * n * I\nD) mu0 * I / (2 * pi * r)\nAns: B\nChapter: Moving Charges & Magnetism`}
                  value={newTestForm.rawBulkQuestions}
                  onChange={(e) => setNewTestForm({ ...newTestForm, rawBulkQuestions: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono leading-relaxed focus:bg-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="sm:col-span-3 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="liveCheck"
                  checked={newTestForm.startActive}
                  onChange={(e) => setNewTestForm({ ...newTestForm, startActive: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <label htmlFor="liveCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Publish test as <strong>Live immediately</strong> for Dr. Jasman (Uncheck to save as Hidden Draft)
                </label>
              </div>
            </div>

            <button
              onClick={() => {
                if (!newTestForm.title || !newTestForm.rawBulkQuestions) {
                  alert("Please provide at least a Title and some Questions.");
                  return;
                }
                const parsedQs = parseBulkQuestions(newTestForm.rawBulkQuestions, newTestForm.subject, pastedImage);
                if (parsedQs.length === 0) {
                  alert("Could not parse questions. Make sure format has Q1., A), B), C), D), Ans:");
                  return;
                }
                const chArray = newTestForm.chapters ? newTestForm.chapters.split(",").map((s) => s.trim()) : ["General"];
                const newTestObj = {
                  id: "test-" + Date.now(),
                  title: newTestForm.title,
                  subject: newTestForm.subject,
                  chapters: chArray,
                  durationMins: newTestForm.durationMins || 45,
                  isActive: newTestForm.startActive,
                  questions: parsedQs
                };
                const updated = [...testsCatalog, newTestObj];
                saveTests(updated);
                alert(`Success! Created "${newTestForm.title}" with ${parsedQs.length} questions.`);
                setNewTestForm({
                  title: "",
                  subject: "Physics",
                  durationMins: 45,
                  chapters: "",
                  rawBulkQuestions: "",
                  startActive: true
                });
                setPastedImage("");
                setUploadedFileName("");
              }}
              className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Parse & Save Test Shift →
            </button>
          </div>

          {/* SECTION 3: SYLLABUS CHECKLIST MANAGER (WITH ADD & DELETE CHAPTERS) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div>
              <h3 className="text-base font-black text-slate-900">📚 Manage Syllabus Completion Checklist</h3>
              <p className="text-xs text-slate-500">
                Add custom chapters, delete unwanted ones, or toggle completion status for Dr. Jasman.
              </p>
            </div>

            {/* ADD CUSTOM CHAPTER FORM */}
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 flex flex-col sm:flex-row items-end gap-3">
              <div className="w-full sm:w-1/4">
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Subject</label>
                <select
                  value={newChapterForm.subject}
                  onChange={(e) => setNewChapterForm({ ...newChapterForm, subject: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Botany">Botany</option>
                  <option value="Zoology">Zoology</option>
                </select>
              </div>

              <div className="w-full sm:w-1/4">
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Class</label>
                <select
                  value={newChapterForm.classLevel}
                  onChange={(e) => setNewChapterForm({ ...newChapterForm, classLevel: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </select>
              </div>

              <div className="w-full sm:flex-1">
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Chapter Name</label>
                <input
                  type="text"
                  placeholder="e.g. Experimental Skills & Vernier Calipers"
                  value={newChapterForm.chapter}
                  onChange={(e) => setNewChapterForm({ ...newChapterForm, chapter: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                />
              </div>

              <button
                onClick={handleAddChapter}
                className="w-full sm:w-auto px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-sm whitespace-nowrap"
              >
                ➕ Add Chapter
              </button>
            </div>

            {/* CHAPTERS LIST WITH TOGGLE AND DELETE BUTTON */}
            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-2">
              {syllabus.map((c) => (
                <div key={c.id} className="py-2.5 flex items-center justify-between text-xs gap-2">
                  <div className="flex-1">
                    <span className="font-bold text-slate-800">{c.chapter}</span>
                    <span className="text-[10px] text-slate-400 ml-2">({c.subject} - Cl {c.classLevel})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const updated = syllabus.map((item) =>
                          item.id === c.id ? { ...item, completed: !item.completed } : item
                        );
                        saveSyllabus(updated);
                      }}
                      className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
                        c.completed
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {c.completed ? "✓ Mastered" : "Mark Done"}
                    </button>
                    <button
                      onClick={() => handleDeleteChapter(c.id, c.chapter)}
                      className="p-1 px-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition"
                      title="Delete chapter from syllabus"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 3: PRE-SHIFT BRIEFING ================= */}
      {view === "BRIEFING" && currentTest && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <span className="text-sky-700 font-extrabold text-[10px] uppercase tracking-wider bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
              MISSION BRIEFING
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">{currentTest.title}</h2>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {currentTest.chapters.map((ch: string, i: number) => (
                <span key={i} className="text-[11px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                  {ch}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 py-5 border-y border-slate-100 my-6 text-center text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
                <span className="font-black text-slate-900 text-sm mt-0.5 block">{currentTest.durationMins}m</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Questions</span>
                <span className="font-black text-slate-900 text-sm mt-0.5 block">{currentTest.questions.length} Qs</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Marking</span>
                <span className="font-black text-emerald-600 text-sm mt-0.5 block">+4 / -1</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 mb-6 leading-relaxed">
              ⚠️ <strong>Strict Integrity Guard:</strong> App switching or window minimization triggers 1 warning strike. Next switch auto-submits your test immediately.
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setView("DASHBOARD")}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Abort
              </button>
              <button
                onClick={handleBeginExam}
                className="flex-1 py-3 bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-600/20"
              >
                START SHIFT →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 4: ACTIVE TEST SHIFT ================= */}
      {view === "ACTIVE_SHIFT" && currentTest && (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-between select-none">
          <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOmrOpen(!omrOpen)}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-1.5"
              >
                <span>📑</span> OMR ({Object.keys(userAnswers).length}/{activeQuestions.length})
              </button>
              <div className="hidden sm:block">
                <span className="text-xs font-black text-slate-900 block">Dr. Jasman — On Duty</span>
                <span className="text-[10px] text-slate-500 font-medium">Case {currentQIndex + 1} of {activeQuestions.length}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="font-mono text-sm sm:text-base font-bold bg-rose-50 text-rose-600 px-3 py-1 rounded-xl border border-rose-200 flex items-center gap-1">
                <span className="animate-pulse">⏱</span> {timerDisplay}
              </div>
              <button
                onClick={() => completeShift("MANUAL_SUBMIT")}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
              >
                SUBMIT
              </button>
            </div>
          </header>

          {/* OMR Grid Drawer */}
          {omrOpen && (
            <div className="bg-white border-b border-slate-200 p-4 max-w-4xl w-full mx-auto shadow-md">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-black text-slate-900 uppercase">OMR Answer Sheet Palette</span>
                <button onClick={() => setOmrOpen(false)} className="text-xs text-slate-400 font-bold">
                  ✕ Close
                </button>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
                {activeQuestions.map((_: any, idx: number) => {
                  const isAns = userAnswers[idx];
                  const isFlag = flaggedQuestions[idx];
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentQIndex(idx);
                        setOmrOpen(false);
                      }}
                      className={`h-9 rounded-xl font-mono text-xs font-bold flex items-center justify-center border transition ${
                        isFlag
                          ? "bg-purple-100 border-purple-400 text-purple-800"
                          : isAns
                          ? "bg-teal-600 border-teal-600 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Question Body with Diagram */}
          <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-extrabold text-sky-700 uppercase tracking-wider bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                  {activeQ.subject} • {activeQ.chapter}
                </span>
                <button
                  onClick={() => setFlaggedQuestions({ ...flaggedQuestions, [currentQIndex]: !flaggedQuestions[currentQIndex] })}
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                    flaggedQuestions[currentQIndex]
                      ? "bg-purple-100 text-purple-800 border border-purple-300"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {flaggedQuestions[currentQIndex] ? "★ Marked for Review" : "☆ Review Later"}
                </button>
              </div>

              <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                <span className="text-slate-400 font-mono mr-2">Q{currentQIndex + 1}.</span>
                {activeQ.question_text || "Clinical case loading..."}
              </p>

              {activeQ.imageUrl && (
                <div className="my-4 p-2 bg-slate-50 border border-slate-200 rounded-2xl flex justify-center">
                  <img
                    src={activeQ.imageUrl}
                    alt="Clinical diagram"
                    className="max-h-64 max-w-full rounded-xl object-contain shadow-sm"
                  />
                </div>
              )}

              <div className="space-y-3 mt-6">
                {["A", "B", "C", "D"].map((optKey) => {
                  const optVal = activeQ[`option_${optKey.toLowerCase()}`];
                  const isSelected = userAnswers[currentQIndex] === optKey;
                  return (
                    <button
                      key={optKey}
                      onClick={() => setUserAnswers({ ...userAnswers, [currentQIndex]: optKey })}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition text-xs sm:text-sm flex items-center gap-3.5 ${
                        isSelected
                          ? "border-sky-500 bg-sky-50/70 text-sky-950 font-bold shadow-sm"
                          : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold ${
                          isSelected ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {optKey}
                      </span>
                      <span>{optVal}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentQIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={currentQIndex === 0}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-40"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => {
                    const copy = { ...userAnswers };
                    delete copy[currentQIndex];
                    setUserAnswers(copy);
                  }}
                  className="px-3 py-2 text-slate-400 hover:text-rose-600 text-xs font-bold"
                >
                  Clear
                </button>
              </div>

              <button
                onClick={() => setCurrentQIndex((prev) => Math.min(prev + 1, activeQuestions.length - 1))}
                disabled={currentQIndex === activeQuestions.length - 1}
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold disabled:opacity-40 shadow-sm"
              >
                Next Case →
              </button>
            </div>
          </main>

          {/* STRIKE 1 WARNING ALERT */}
          {strikeWarningModal && (
            <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center border-2 border-rose-500 shadow-2xl">
                <span className="text-4xl block mb-2">🚨</span>
                <h3 className="text-base font-black text-rose-600">STRIKE 1 WARNING!</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                  You switched away from the active medical exam window. Any further tab exit or window switch will <strong>immediately auto-submit your test</strong>!
                </p>
                <button
                  onClick={() => setStrikeWarningModal(false)}
                  className="mt-5 w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  I Understand — Return to Exam
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= VIEW 5: SUMMARY & FLASHCARDS ================= */}
      {view === "SUMMARY" && shiftResult && (
        <div className="max-w-3xl mx-auto w-full p-4 sm:p-6 space-y-6 flex-1 flex flex-col justify-center">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
            <span className="text-xs font-extrabold text-sky-700 uppercase tracking-wider block">
              CLINICAL DEBRIEF REPORT
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Shift Evaluation, Dr. Jasman.
            </h1>

            <div className="mt-3 p-4 rounded-2xl border text-xs sm:text-sm font-semibold leading-relaxed bg-sky-50 border-sky-200 text-sky-900">
              {shiftResult.accuracy >= 80 ? (
                <span>
                  🩺 <strong>Masterclass Accuracy!</strong> Outstanding clinical precision, Dr. Jasman. Your diagnostic judgment reflects genuine NEET readiness. Wear this confidence into your next rotation! ✨
                </span>
              ) : shiftResult.accuracy >= 50 ? (
                <span>
                  🩺 <strong>Solid Core Foundation!</strong> You possess the concept mastery, Dr. Jasman; now we eliminate the negative-marking slip ups. Flip your recovery cards below to convert these into solid +4s!
                </span>
              ) : (
                <span>
                  🤍 <strong>Resilience Shapes Great Physicians.</strong> Every top doctor learns from tough rotations. Mistakes caught here save your seat on the real NEET day. Review your flashcards and return stronger!
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Score</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {shiftResult.score} <span className="text-xs text-slate-400">/ {shiftResult.totalMarks}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Accuracy</span>
                <div className="text-2xl font-black text-teal-600 mt-1">{shiftResult.accuracy}%</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Right / Wrong</span>
                <div className="text-sm font-black text-slate-800 mt-2">
                  <span className="text-emerald-600">+{shiftResult.correct}</span> /{" "}
                  <span className="text-rose-600">-{shiftResult.incorrect}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Time Used</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{shiftResult.timeSpentMins}m</div>
              </div>
            </div>

            {shiftResult.slowQuestions.length > 0 && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                <span>⏱</span>
                <span>
                  <strong>Speed Alert:</strong> You spent &gt; 2.5 minutes on Q{shiftResult.slowQuestions.join(", Q")}. Remember to skip heavy calculations on the first pass!
                </span>
              </div>
            )}

            {/* MANDATORY FLASHCARD LOCKOUT */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                    <span>🩺</span> Mandatory Clinical Recovery Flashcards
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Tap to flip and review high-yield concepts for each missed topic before unlocking the dashboard.
                  </p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${allCardsCleared ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                  {allCardsCleared ? "✓ Protocol Cleared" : "Locked 🔒"}
                </span>
              </div>

              {shiftResult.weakChapters.length === 0 ? (
                <div className="p-4 bg-emerald-50 rounded-2xl text-center border border-emerald-200 text-xs font-bold text-emerald-800">
                  🎉 Flawless Run! No weak chapters identified for this shift.
                </div>
              ) : (
                <div className="space-y-3">
                  {shiftResult.weakChapters.map((chap: string) => {
                    const info = CLINICAL_FLASHCARDS[chap] || CLINICAL_FLASHCARDS["General"];
                    const isFlipped = flippedCards[chap];
                    const isDone = reviewedCards[chap];

                    return (
                      <div
                        key={chap}
                        onClick={() => {
                          setFlippedCards({ ...flippedCards, [chap]: !isFlipped });
                          setReviewedCards({ ...reviewedCards, [chap]: true });
                        }}
                        className={`cursor-pointer rounded-2xl p-5 border-2 transition-all shadow-sm ${
                          isDone ? "border-emerald-400 bg-emerald-50/20" : "border-rose-300 bg-white hover:border-rose-400"
                        }`}
                      >
                        {!isFlipped ? (
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-[10px] font-extrabold uppercase text-rose-600 block">
                                Diagnostic Error Found ⚠️
                              </span>
                              <h4 className="text-sm font-bold text-slate-900 mt-0.5">{chap}</h4>
                              <p className="text-xs text-slate-400 mt-1">Tap card to flip formula & clinical tip ↺</p>
                            </div>
                            <span className="text-xl">{isDone ? "✅" : "👆"}</span>
                          </div>
                        ) : (
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                              <span className="font-black text-slate-900">{chap} — High-Yield Review</span>
                              <span className="text-[10px] font-bold text-emerald-600">✓ Reviewed</span>
                            </div>
                            <p className="text-slate-700"><strong>Formula/Fact:</strong> {info.fact}</p>
                            <p className="text-slate-600"><strong>Clinical Tip:</strong> {info.tip}</p>
                            <p className="text-sky-800 font-medium italic mt-1">“{info.quote}”</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                if (!allCardsCleared) {
                  alert("Please tap and review all recovery flashcards before returning to the dashboard.");
                  return;
                }
                setView("DASHBOARD");
              }}
              disabled={!allCardsCleared}
              className={`mt-6 w-full py-3.5 text-xs font-bold rounded-2xl shadow-md transition ${
                allCardsCleared
                  ? "bg-gradient-to-r from-sky-600 to-teal-600 hover:opacity-95 text-white shadow-sky-600/20"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {allCardsCleared
                ? "RECORD IN JOURNEY & RETURN TO DASHBOARD →"
                : "FLIP ALL FLASHCARDS TO UNLOCK DASHBOARD 🔒"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
