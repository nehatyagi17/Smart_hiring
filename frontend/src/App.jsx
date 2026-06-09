import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  FileText, 
  Calendar, 
  MessageSquare, 
  BookOpen, 
  LogOut, 
  Plus, 
  CheckCircle, 
  XCircle, 
  User, 
  Shield, 
  Send,
  CloudUpload,
  Clock,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

// Pre-loaded policy context corresponding to chatbot/policy.txt
const POLICY_TEXT = `Leave Policy:
Employees are entitled to 20 paid leaves per year excluding public holidays.

Working Hours:
Standard working hours are from 9 AM to 6 PM, Monday to Friday.

Work From Home Policy:
Employees can work from home up to 2 days per week with manager approval.

Holidays:
The company observes national holidays and publishes an annual holiday calendar.

Leave Application:
Employees should apply for leave via the HR portal or inform their manager.`;

const POLICY_SECTIONS = [
  {
    keywords: ["leave", "leaves", "paid", "vacation", "annual"],
    text: "Leave Policy:\nEmployees are entitled to 20 paid leaves per year excluding public holidays."
  },
  {
    keywords: ["work", "hours", "timings", "schedule", "time"],
    text: "Working Hours:\nStandard working hours are from 9 AM to 6 PM, Monday to Friday."
  },
  {
    keywords: ["home", "wfh", "remote", "telecommute", "flexi"],
    text: "Work From Home Policy:\nEmployees can work from home up to 2 days per week with manager approval."
  },
  {
    keywords: ["holiday", "holidays", "calendar", "national", "observed"],
    text: "Holidays:\nThe company observes national holidays and publishes an annual holiday calendar."
  },
  {
    keywords: ["apply", "request", "inform", "portal", "ask"],
    text: "Leave Application:\nEmployees should apply for leave via the HR portal or inform their manager."
  }
];

function App() {
  // Authentication & Session State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sh_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [roleInput, setRoleInput] = useState('CANDIDATE');

  // Dashboard Navigation
  const [activeTab, setActiveTab] = useState('jobs');

  // App Core States (Initialized with mock data for instant demo utility)
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('sh_jobs');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'AI Research Scientist', description: 'Seeking expertise in PyTorch, NLP, and transformer models. Responsible for building local fine-tuned models for ATS parsing and search workflows.', created_at: '2026-06-01' },
      { id: 2, title: 'Lead Frontend Developer', description: 'Looking for a React developer experienced in creating responsive dashboards, custom HSL styling, and fluid interactive user interfaces.', created_at: '2026-06-03' },
      { id: 3, title: 'HR Manager & Recruiter', description: 'Experienced HR generalist to manage candidate pipelines, organize interview scheduling slots, and configure internal RAG chatbot policy documents.', created_at: '2026-06-05' }
    ];
  });

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('sh_applications');
    return saved ? JSON.parse(saved) : [
      { id: 101, candidate: 'candidate@example.com', jobId: 1, jobTitle: 'AI Research Scientist', fileName: 'resume_dr_smith.pdf', score: 85.5, status: 'SHORTLISTED', uploaded_at: '2026-06-02' },
      { id: 102, candidate: 'candidate@example.com', jobId: 2, jobTitle: 'Lead Frontend Developer', fileName: 'john_doe_portfolio.docx', score: 42.0, status: 'REJECTED', uploaded_at: '2026-06-04' }
    ];
  });

  const [slots, setSlots] = useState(() => {
    const saved = localStorage.getItem('sh_slots');
    return saved ? JSON.parse(saved) : [
      { id: 201, jobId: 1, jobTitle: 'AI Research Scientist', date: '2026-06-12', startTime: '10:00', endTime: '11:00', isBooked: false, bookedBy: null },
      { id: 202, jobId: 1, jobTitle: 'AI Research Scientist', date: '2026-06-12', startTime: '14:30', endTime: '15:30', isBooked: true, bookedBy: 'candidate@example.com' },
      { id: 203, jobId: 2, jobTitle: 'Lead Frontend Developer', date: '2026-06-15', startTime: '11:00', endTime: '12:00', isBooked: false, bookedBy: null }
    ];
  });

  // UI Interactive States
  const [toasts, setToasts] = useState([]);
  const [selectedRankJob, setSelectedRankJob] = useState(1);
  const [uploadModalJob, setUploadModalJob] = useState(null);
  
  // Job Creation Form
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDesc, setNewJobDesc] = useState('');

  // Slot Creation Form
  const [slotJobId, setSlotJobId] = useState(1);
  const [slotDate, setSlotDate] = useState('');
  const [slotStart, setSlotStart] = useState('09:00');
  const [slotEnd, setSlotEnd] = useState('10:00');

  // Candidate Slot Filtering
  const [bookingJobId, setBookingJobId] = useState(1);

  // Resume Upload Dropzone
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Chatbot State
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'system', text: "Hello! I am your AI HR Policy Assistant. Ask me anything about employee handbook rules, leaves, timings, or office guidelines.", confidence: null }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Sync to localstorage
  useEffect(() => {
    localStorage.setItem('sh_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('sh_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('sh_slots', JSON.stringify(slots));
  }, [slots]);

  // Set default tabs depending on role
  useEffect(() => {
    if (user) {
      if (user.role === 'HR') setActiveTab('jobs');
      else if (user.role === 'CANDIDATE') setActiveTab('explore');
      else if (user.role === 'EMPLOYEE') setActiveTab('chat');
    }
  }, [user]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Auth Operations
  const handleAuth = (e) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) return;

    if (authMode === 'login') {
      const loggedUser = {
        email: emailInput,
        role: emailInput.toLowerCase().includes('hr') ? 'HR' 
            : emailInput.toLowerCase().includes('employee') ? 'EMPLOYEE' : roleInput
      };
      setUser(loggedUser);
      localStorage.setItem('sh_user', JSON.stringify(loggedUser));
      showToast(`Logged in successfully as ${loggedUser.role}!`);
    } else {
      const registeredUser = {
        email: emailInput,
        role: roleInput
      };
      setUser(registeredUser);
      localStorage.setItem('sh_user', JSON.stringify(registeredUser));
      showToast(`Account registered successfully as ${roleInput}!`);
    }
  };

  const quickLogin = (role) => {
    const demoEmails = {
      HR: 'hr.manager@company.com',
      CANDIDATE: 'candidate@gmail.com',
      EMPLOYEE: 'john.staff@company.com'
    };
    const loggedUser = {
      email: demoEmails[role],
      role: role
    };
    setUser(loggedUser);
    localStorage.setItem('sh_user', JSON.stringify(loggedUser));
    showToast(`Logged in as ${role} Demo!`);
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('sh_user');
    showToast("Signed out successfully.");
  };

  // HR - Job Creation
  const handleCreateJob = (e) => {
    e.preventDefault();
    if (!newJobTitle || !newJobDesc) return;
    
    const newJob = {
      id: Date.now(),
      title: newJobTitle,
      description: newJobDesc,
      created_at: new Date().toISOString().split('T')[0]
    };
    
    setJobs([newJob, ...jobs]);
    setNewJobTitle('');
    setNewJobDesc('');
    showToast(`Job opening "${newJob.title}" has been published!`);
  };

  // HR - Create Slots
  const handleCreateSlot = (e) => {
    e.preventDefault();
    if (!slotDate) {
      showToast("Please choose an interview date", "error");
      return;
    }
    
    const matchingJob = jobs.find(j => j.id === parseInt(slotJobId));
    const newSlot = {
      id: Date.now(),
      jobId: parseInt(slotJobId),
      jobTitle: matchingJob ? matchingJob.title : 'General Position',
      date: slotDate,
      startTime: slotStart,
      endTime: slotEnd,
      isBooked: false,
      bookedBy: null
    };

    setSlots([newSlot, ...slots]);
    showToast("New available interview slot created!");
  };

  // Candidate - Upload & AI Screening Simulation
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    const validExtensions = ['.pdf', '.docx'];
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (validExtensions.includes(extension)) {
      setSelectedFile(file);
    } else {
      showToast("Unsupported format. Please upload PDF or DOCX.", "error");
    }
  };

  const handleApplySubmit = () => {
    if (!selectedFile || !uploadModalJob) return;

    setIsEvaluating(true);
    
    // Simulate AI Screening calculation locally
    setTimeout(() => {
      // Create a mock score based on matching title keywords in the file name or random high/low
      let score = 50 + Math.random() * 45; // base score between 50 and 95
      const lowerName = selectedFile.name.toLowerCase();
      const lowerTitle = uploadModalJob.title.toLowerCase();
      
      // Bonus if keyword matches
      if (lowerName.includes('resume') || lowerName.includes('cv')) score += 5;
      if (lowerTitle.split(' ').some(word => word.length > 3 && lowerName.includes(word))) {
        score += 15;
      }
      
      score = Math.min(100, Math.round(score * 2) / 2); // Round to nearest 0.5
      const status = score >= 60 ? 'SHORTLISTED' : 'REJECTED';

      const newApp = {
        id: Date.now(),
        candidate: user.email,
        jobId: uploadModalJob.id,
        jobTitle: uploadModalJob.title,
        fileName: selectedFile.name,
        score: score,
        status: status,
        uploaded_at: new Date().toISOString().split('T')[0]
      };

      setApplications([newApp, ...applications]);
      setIsEvaluating(false);
      setSelectedFile(null);
      setUploadModalJob(null);
      
      if (status === 'SHORTLISTED') {
        showToast(`Resume evaluated: Match score ${score}%! You are SHORTLISTED!`, "success");
      } else {
        showToast(`Resume evaluated: Match score ${score}%. Status: Rejected.`, "error");
      }
    }, 2500);
  };

  // Candidate - Book Interview Slot
  const handleBookSlot = (slotId) => {
    const updatedSlots = slots.map(s => {
      if (s.id === slotId) {
        return { ...s, isBooked: true, bookedBy: user.email };
      }
      return s;
    });
    setSlots(updatedSlots);

    const targetSlot = slots.find(s => s.id === slotId);
    showToast("Interview booked! ICS Calendar file generated.");
    downloadICS(targetSlot);
  };

  // Generate and download .ics calendar invite
  const downloadICS = (slot) => {
    const formattedDate = slot.date.replace(/-/g, '');
    const startHour = slot.startTime.replace(/:/g, '') + '00';
    const endHour = slot.endTime.replace(/:/g, '') + '00';
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Smart Hiring//Interview Scheduler//EN',
      'BEGIN:VEVENT',
      `UID:interview-${slot.id}@smarthiring.com`,
      `DTSTAMP:${formattedDate}T090000Z`,
      `DTSTART:${formattedDate}T${startHour}`,
      `DTEND:${formattedDate}T${endHour}`,
      `SUMMARY:Interview - ${slot.jobTitle}`,
      `DESCRIPTION:Interview with Smart Hiring Team for the position of ${slot.jobTitle}.`,
      'LOCATION:Virtual MS Teams / Google Meet',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `interview_${slot.date}_${slot.startTime.replace(/:/g, '-')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Employee Chatbot - Local RAG engine
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const query = chatInput.trim();
    const newUserMsg = { id: Date.now(), sender: 'user', text: query, confidence: null };
    setChatMessages(prev => [...prev, newUserMsg]);
    setChatInput('');

    // Typing simulation
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      let bestSection = null;
      let bestScore = 0;

      POLICY_SECTIONS.forEach(section => {
        let matches = 0;
        section.keywords.forEach(keyword => {
          if (lowerQuery.includes(keyword)) {
            matches++;
          }
        });
        
        // Simple scoring based on matching keywords
        const score = matches / section.keywords.length;
        if (score > bestScore) {
          bestScore = score;
          bestSection = section;
        }
      });

      let answerText = "I’m not fully sure. Please contact HR for accurate information.";
      let confidenceScore = Math.round((bestScore + 0.1) * 100) / 100;

      if (bestScore > 0) {
        answerText = bestSection.text;
        confidenceScore = Math.min(0.98, Math.round((bestScore + 0.4) * 100) / 100);
      }

      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'system',
        text: answerText,
        confidence: confidenceScore
      }]);
    }, 800);
  };

  const askPredefinedChat = (question) => {
    setChatInput(question);
  };

  return (
    <div className="min-h-screen">
      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type === 'error' ? 'error' : 'success'}`}>
            <span>{toast.type === 'error' ? '⚠️' : '✓'}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Unauthenticated State */}
      {!user ? (
        <div className="auth-layout">
          <div className="auth-container glass-panel">
            <div className="auth-header">
              <div className="logo-container" style={{ justifyContent: 'center', padding: '0 0 16px' }}>
                <span style={{ fontSize: '2.5rem' }}>🚀</span>
                <span className="logo-text" style={{ fontSize: '2rem' }}>Smart<span>Hiring</span></span>
              </div>
              <h2>Welcome to Smart Hiring</h2>
              <p>AI-powered screening & automated HR workflows</p>
            </div>

            <div className="auth-tabs">
              <div 
                className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => setAuthMode('login')}
              >
                Sign In
              </div>
              <div 
                className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
                onClick={() => setAuthMode('register')}
              >
                Create Account
              </div>
            </div>

            <form onSubmit={handleAuth}>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="name@company.com" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                />
              </div>

              {authMode === 'register' && (
                <div className="form-group">
                  <label>I want to join as</label>
                  <select 
                    className="form-select"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                  >
                    <option value="CANDIDATE">Candidate (Apply & Schedule)</option>
                    <option value="HR">HR / Recruiter (Manage Jobs & Rank)</option>
                    <option value="EMPLOYEE">Employee (Internal Chatbot & Support)</option>
                  </select>
                </div>
              )}

              <button type="submit" className="btn-primary w-full" style={{ marginTop: '12px' }}>
                {authMode === 'login' ? 'Sign In' : 'Register Account'}
              </button>
            </form>

            <div className="demo-box">
              <div className="demo-title">Quick Demo Logins</div>
              <div className="demo-btn-group">
                <button className="btn-demo" onClick={() => quickLogin('HR')}>HR Manager</button>
                <button className="btn-demo" onClick={() => quickLogin('CANDIDATE')}>Candidate</button>
                <button className="btn-demo" onClick={() => quickLogin('EMPLOYEE')}>Employee</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Authenticated Main App Dashboard Layout */
        <div className="app-layout">
          
          {/* Sidebar */}
          <aside className="sidebar glass-panel">
            <div className="logo-container">
              <span style={{ fontSize: '1.8rem' }}>🚀</span>
              <span className="logo-text">Smart<span>Hiring</span></span>
            </div>

            <div className="user-profile">
              <div className="avatar">
                {user.role === 'HR' ? 'HR' : user.role === 'EMPLOYEE' ? 'EP' : 'CD'}
              </div>
              <div className="user-details">
                <div className="user-email">{user.email}</div>
                <span className="user-role">{user.role.toLowerCase()}</span>
              </div>
            </div>

            <nav className="nav-menu">
              {/* HR Menu Links */}
              {user.role === 'HR' && (
                <>
                  <div className="nav-header">Recruitment Portal</div>
                  <div 
                    className={`nav-link ${activeTab === 'jobs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('jobs')}
                  >
                    <Briefcase size={18} /> Manage Jobs
                  </div>
                  <div 
                    className={`nav-link ${activeTab === 'candidates' ? 'active' : ''}`}
                    onClick={() => setActiveTab('candidates')}
                  >
                    <FileText size={18} /> Resume Screening
                  </div>
                  <div 
                    className={`nav-link ${activeTab === 'scheduler' ? 'active' : ''}`}
                    onClick={() => setActiveTab('scheduler')}
                  >
                    <Calendar size={18} /> Allocate Slots
                  </div>
                </>
              )}

              {/* Candidate Menu Links */}
              {user.role === 'CANDIDATE' && (
                <>
                  <div className="nav-header">Candidate Portal</div>
                  <div 
                    className={`nav-link ${activeTab === 'explore' ? 'active' : ''}`}
                    onClick={() => setActiveTab('explore')}
                  >
                    <Briefcase size={18} /> Explore Jobs
                  </div>
                  <div 
                    className={`nav-link ${activeTab === 'applications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('applications')}
                  >
                    <FileText size={18} /> My Applications
                  </div>
                  <div 
                    className={`nav-link ${activeTab === 'booking' ? 'active' : ''}`}
                    onClick={() => setActiveTab('booking')}
                  >
                    <Calendar size={18} /> Book Interview
                  </div>
                </>
              )}

              {/* Employee Menu Links */}
              {user.role === 'EMPLOYEE' && (
                <>
                  <div className="nav-header">Employee Portal</div>
                  <div 
                    className={`nav-link ${activeTab === 'chat' ? 'active' : ''}`}
                    onClick={() => setActiveTab('chat')}
                  >
                    <MessageSquare size={18} /> HR AI Assistant
                  </div>
                  <div 
                    className={`nav-link ${activeTab === 'policies' ? 'active' : ''}`}
                    onClick={() => setActiveTab('policies')}
                  >
                    <BookOpen size={18} /> Policy Handbook
                  </div>
                </>
              )}
            </nav>

            <div className="sidebar-footer">
              <button className="btn-signout" onClick={handleSignOut}>
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </aside>

          {/* Main Content Workspace */}
          <main className="main-viewport">
            <header className="header-bar glass-panel">
              <h1 className="page-title">
                {activeTab === 'jobs' && 'Manage Job Positions'}
                {activeTab === 'candidates' && 'AI Resume Scoring'}
                {activeTab === 'scheduler' && 'Interview Slots'}
                {activeTab === 'explore' && 'Explore Opportunities'}
                {activeTab === 'applications' && 'My Applications'}
                {activeTab === 'booking' && 'Self-Service Scheduler'}
                {activeTab === 'chat' && 'RAG Policy Chatbot'}
                {activeTab === 'policies' && 'Internal HR Policies'}
              </h1>
              <div className="header-status">
                <span className="pulse-dot"></span>
                <span>AI Core Loaded Locally (Bias-Free screening)</span>
              </div>
            </header>

            <div className="content-body">
              
              {/* ================= HR PANELS ================= */}
              
              {user.role === 'HR' && activeTab === 'jobs' && (
                <div className="grid-2 fade-in">
                  <div className="card glass-panel">
                    <div className="card-title-area">
                      <h3>Create New Job Opportunity</h3>
                      <p>Fill in details to post a new position. The local Sentence Transformers model will score resumes against this exact description.</p>
                    </div>
                    <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="form-group">
                        <label>Job Title</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="e.g. Senior Backend Engineer" 
                          value={newJobTitle}
                          onChange={(e) => setNewJobTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Detailed Requirements (Semantic Reference)</label>
                        <textarea 
                          className="form-textarea" 
                          rows={8}
                          placeholder="Describe the ideal skills, framework expertise, and tasks. High quality sentences enable better semantic evaluations..."
                          value={newJobDesc}
                          onChange={(e) => setNewJobDesc(e.target.value)}
                          required
                        />
                      </div>
                      <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                        <Plus size={16} /> Publish Position
                      </button>
                    </form>
                  </div>

                  <div className="card glass-panel" style={{ height: 'fit-content' }}>
                    <div className="card-title-area">
                      <h3>Active Openings</h3>
                      <p>Currently listed roles open for resume screening.</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '420px', overflowY: 'auto', paddingRight: '8px' }}>
                      {jobs.map(job => (
                        <div key={job.id} className="glass-panel" style={{ padding: '20px', border: '1px solid hsl(var(--border))' }}>
                          <h4 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            {job.title}
                            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: 'normal' }}>{job.created_at}</span>
                          </h4>
                          <p style={{ fontSize: '0.88rem', color: 'hsl(var(--text-muted))', marginTop: '10px', lineHeight: '1.5' }}>
                            {job.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {user.role === 'HR' && activeTab === 'candidates' && (
                <div className="card glass-panel fade-in">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div className="card-title-area">
                      <h3>AI-Scored Rankings</h3>
                      <p>View candidate resumes evaluated via Sentence Transformers against job descriptions.</p>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <select 
                        className="form-select"
                        value={selectedRankJob}
                        onChange={(e) => setSelectedRankJob(parseInt(e.target.value))}
                      >
                        {jobs.map(job => (
                          <option key={job.id} value={job.id}>{job.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="table-wrapper" style={{ marginTop: '16px' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Candidate Email</th>
                          <th>Resume File</th>
                          <th>Match Score</th>
                          <th>Screening Status</th>
                          <th>Date Submitted</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.filter(app => app.jobId === selectedRankJob).length === 0 ? (
                          <tr>
                            <td colSpan="5" style={{ textAlignment: 'center', padding: '32px', color: 'hsl(var(--text-muted))' }}>
                              No candidate resumes submitted for this job yet.
                            </td>
                          </tr>
                        ) : (
                          applications.filter(app => app.jobId === selectedRankJob).map(app => (
                            <tr key={app.id}>
                              <td style={{ fontWeight: 600 }}>{app.candidate}</td>
                              <td style={{ color: 'hsl(var(--secondary))', fontSize: '0.88rem' }}>{app.fileName}</td>
                              <td>
                                <span style={{ fontWeight: 700, color: app.score >= 60 ? '#34d399' : '#f87171' }}>
                                  {app.score}% Match
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${app.status === 'SHORTLISTED' ? 'badge-success' : 'badge-error'}`}>
                                  {app.status}
                                </span>
                              </td>
                              <td style={{ color: 'hsl(var(--text-muted))' }}>{app.uploaded_at}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {user.role === 'HR' && activeTab === 'scheduler' && (
                <div className="grid-2 fade-in">
                  <div className="card glass-panel">
                    <div className="card-title-area">
                      <h3>Allocate Available Slots</h3>
                      <p>Create time slots where shortlisted candidates can pick and book interviews.</p>
                    </div>
                    <form onSubmit={handleCreateSlot} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="form-group">
                        <label>For Job Role</label>
                        <select 
                          className="form-select"
                          value={slotJobId}
                          onChange={(e) => setSlotJobId(parseInt(e.target.value))}
                        >
                          {jobs.map(job => (
                            <option key={job.id} value={job.id}>{job.title}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Interview Date</label>
                        <input 
                          type="date" 
                          className="form-input" 
                          value={slotDate}
                          onChange={(e) => setSlotDate(e.target.value)}
                          required
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                          <label>Start Time</label>
                          <input 
                            type="time" 
                            className="form-input" 
                            value={slotStart}
                            onChange={(e) => setSlotStart(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>End Time</label>
                          <input 
                            type="time" 
                            className="form-input" 
                            value={slotEnd}
                            onChange={(e) => setSlotEnd(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                        <Plus size={16} /> Allocate Time Slot
                      </button>
                    </form>
                  </div>

                  <div className="card glass-panel">
                    <div className="card-title-area">
                      <h3>Active Allocations</h3>
                      <p>List of open and booked interview periods.</p>
                    </div>
                    <div className="slots-container" style={{ maxHeight: '430px', overflowY: 'auto', paddingRight: '8px' }}>
                      {slots.length === 0 ? (
                        <p style={{ color: 'hsl(var(--text-muted))', textAlign: 'center', padding: '32px' }}>
                          No interview slots defined.
                        </p>
                      ) : (
                        slots.map(slot => (
                          <div key={slot.id} className="glass-panel slot-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid hsl(var(--border))', marginBottom: '10px' }}>
                            <div>
                              <div className="slot-time">{slot.date} | {slot.startTime} - {slot.endTime}</div>
                              <div className="slot-job-title">{slot.jobTitle}</div>
                            </div>
                            <div>
                              {slot.isBooked ? (
                                <span className="badge badge-success" title={`Booked by ${slot.bookedBy}`}>
                                  Booked
                                </span>
                              ) : (
                                <span className="badge badge-warning">
                                  Available
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= CANDIDATE PANELS ================= */}

              {user.role === 'CANDIDATE' && activeTab === 'explore' && (
                <div className="grid-3 fade-in">
                  {jobs.map(job => {
                    const hasApplied = applications.some(app => app.jobId === job.id && app.candidate === user.email);
                    const appDetails = applications.find(app => app.jobId === job.id && app.candidate === user.email);
                    
                    return (
                      <div key={job.id} className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{job.title}</h3>
                          <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Posted: {job.created_at}</span>
                          <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))', margin: '16px 0', lineHeight: '1.5' }}>
                            {job.description}
                          </p>
                        </div>
                        
                        <div style={{ marginTop: '16px' }}>
                          {hasApplied ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}>
                              <div>
                                <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>Match score</div>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: appDetails.score >= 60 ? '#34d399' : '#f87171' }}>
                                  {appDetails.score}% Match
                                </div>
                              </div>
                              <span className={`badge ${appDetails.status === 'SHORTLISTED' ? 'badge-success' : 'badge-error'}`}>
                                {appDetails.status}
                              </span>
                            </div>
                          ) : (
                            <button 
                              className="btn-primary w-full" 
                              onClick={() => setUploadModalJob(job)}
                            >
                              Apply with Resume
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {user.role === 'CANDIDATE' && activeTab === 'applications' && (
                <div className="card glass-panel fade-in">
                  <div className="card-title-area">
                    <h3>My Submitted Resumes</h3>
                    <p>Review the calculated matching grades and recruitment pipeline updates.</p>
                  </div>

                  <div className="table-wrapper" style={{ marginTop: '16px' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Position</th>
                          <th>File Name</th>
                          <th>AI Match Grade</th>
                          <th>Screening Outcome</th>
                          <th>Applied On</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.filter(app => app.candidate === user.email).length === 0 ? (
                          <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'hsl(var(--text-muted))' }}>
                              You haven't submitted applications yet. Go to "Explore Jobs" to apply.
                            </td>
                          </tr>
                        ) : (
                          applications.filter(app => app.candidate === user.email).map(app => (
                            <tr key={app.id}>
                              <td style={{ fontWeight: 600 }}>{app.jobTitle}</td>
                              <td style={{ color: 'hsl(var(--secondary))', fontSize: '0.88rem' }}>{app.fileName}</td>
                              <td style={{ fontWeight: 700, color: app.score >= 60 ? '#34d399' : '#f87171' }}>
                                {app.score}% Match
                              </td>
                              <td>
                                <span className={`badge ${app.status === 'SHORTLISTED' ? 'badge-success' : 'badge-error'}`}>
                                  {app.status}
                                </span>
                              </td>
                              <td style={{ color: 'hsl(var(--text-muted))' }}>{app.uploaded_at}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {user.role === 'CANDIDATE' && activeTab === 'booking' && (
                <div className="card glass-panel fade-in">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div className="card-title-area">
                      <h3>Book Interview Slot</h3>
                      <p>Select your shortlisted position to display available dates and confirm booking.</p>
                    </div>
                    
                    <div className="form-group" style={{ margin: 0 }}>
                      <select 
                        className="form-select"
                        value={bookingJobId}
                        onChange={(e) => setBookingJobId(parseInt(e.target.value))}
                      >
                        {applications
                          .filter(app => app.candidate === user.email && app.status === 'SHORTLISTED')
                          .map(app => (
                            <option key={app.jobId} value={app.jobId}>{app.jobTitle}</option>
                          ))
                        }
                        {applications.filter(app => app.candidate === user.email && app.status === 'SHORTLISTED').length === 0 && (
                          <option value="">No Shortlisted Roles</option>
                        )}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginTop: '32px' }}>
                    <h4>Eligible slots matching selection:</h4>
                    <div style={{ marginTop: '16px' }}>
                      {bookingJobId && slots.filter(s => s.jobId === bookingJobId).length === 0 ? (
                        <p style={{ color: 'hsl(var(--text-muted))', padding: '16px 0' }}>
                          No slots published by HR for this role yet. Please check back later.
                        </p>
                      ) : !bookingJobId ? (
                        <p style={{ color: 'hsl(var(--text-muted))', padding: '16px 0' }}>
                          Only candidates with SHORTLISTED outcomes are eligible for interview scheduling.
                        </p>
                      ) : (
                        <div className="slots-grid">
                          {slots.filter(s => s.jobId === bookingJobId).map(slot => (
                            <div 
                              key={slot.id} 
                              className={`glass-panel interactive-slot ${slot.isBooked ? 'selected' : ''}`}
                              style={{ borderStyle: slot.isBooked ? 'solid' : 'dashed' }}
                            >
                              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{slot.date}</div>
                              <div style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', margin: '6px 0' }}>
                                {slot.startTime} - {slot.endTime}
                              </div>
                              {slot.isBooked ? (
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: slot.bookedBy === user.email ? '#06b6d4' : '#ef4444' }}>
                                  {slot.bookedBy === user.email ? 'Booked by You' : 'Filled'}
                                </span>
                              ) : (
                                <button 
                                  className="btn-primary" 
                                  style={{ padding: '6px 12px', fontSize: '0.8rem', marginTop: '8px' }}
                                  onClick={() => handleBookSlot(slot.id)}
                                >
                                  Book Time Slot
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= EMPLOYEE PANELS ================= */}

              {user.role === 'EMPLOYEE' && activeTab === 'chat' && (
                <div className="chat-layout fade-in">
                  
                  {/* Chat interface */}
                  <div className="chat-panel glass-panel">
                    <div className="chat-banner">
                      <div className="avatar">🤖</div>
                      <div>
                        <h4>AI policy RAG assistant</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }}></span>
                          <span style={{ fontSize: '0.72rem', color: 'hsl(var(--success))' }}>Local NLP Engine Online</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="chat-body" id="chat-messages-container">
                      {chatMessages.map(msg => (
                        <div key={msg.id} className={`chat-message ${msg.sender === 'user' ? 'user' : 'system'}`}>
                          <div className="msg-bubble">
                            {msg.text}
                            
                            {msg.confidence !== null && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '0.72rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px' }}>
                                <Info size={12} style={{ color: 'hsl(var(--secondary))' }} />
                                <span style={{ color: 'hsl(var(--text-muted))' }}>Confidence Match:</span>
                                <span style={{ color: msg.confidence >= 0.5 ? '#34d399' : '#fbbf24', fontWeight: 700 }}>
                                  {Math.round(msg.confidence * 100)}%
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="msg-meta">
                            {msg.sender === 'user' ? 'You' : 'AI Assistant'}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="chat-footer">
                      <form onSubmit={handleChatSubmit} className="chat-input-row">
                        <input 
                          type="text" 
                          className="chat-text-input" 
                          placeholder="Ask about leave allowances, remote work or office hours..." 
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                        />
                        <button type="submit" className="btn-primary" style={{ padding: '0 24px' }}>
                          <Send size={16} />
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Reference policies */}
                  <div className="card glass-panel policy-card">
                    <div className="card-title-area">
                      <h3>Policy Quick Queries</h3>
                      <p>Click below to automatically query the knowledge base.</p>
                    </div>
                    <div className="policy-topics" style={{ marginTop: '16px' }}>
                      <button className="btn-topic" onClick={() => askPredefinedChat("What is the annual leave policy?")}>Annual Leaves</button>
                      <button className="btn-topic" onClick={() => askPredefinedChat("What are standard working hours?")}>Working Hours</button>
                      <button className="btn-topic" onClick={() => askPredefinedChat("Can I work from home?")}>Work From Home Rules</button>
                      <button className="btn-topic" onClick={() => askPredefinedChat("Is there a national holiday list?")}>Holidays Calendar</button>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid hsl(var(--border))', margin: '24px 0' }} />

                    <div className="card-title-area">
                      <h3>Local policy context</h3>
                      <p>Source segments parsed by semantic retrieval matches.</p>
                    </div>
                    <div className="policy-viewer" style={{ marginTop: '16px', fontSize: '0.85rem' }}>
                      {POLICY_TEXT}
                    </div>
                  </div>

                </div>
              )}

              {user.role === 'EMPLOYEE' && activeTab === 'policies' && (
                <div className="card glass-panel fade-in">
                  <div className="card-title-area">
                    <h3>Raw policy reference handbook (policy.txt)</h3>
                    <p>The RAG model references this local text knowledge file to retrieve answers without hallucinations.</p>
                  </div>
                  <pre className="policy-viewer" style={{ marginTop: '16px', overflowX: 'auto', maxHeight: '500px' }}>
                    {POLICY_TEXT}
                  </pre>
                </div>
              )}

            </div>
          </main>
        </div>
      )}

      {/* Candidate Resume Upload Modal */}
      {uploadModalJob && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.4rem' }}>Submit Resume</h3>
              <button className="btn-remove" onClick={() => { setSelectedFile(null); setUploadModalJob(null); }}>✕</button>
            </div>
            
            <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem' }}>
              Applying for <strong>{uploadModalJob.title}</strong> position. Upload a PDF or Word file.
            </p>

            {/* Drop Zone */}
            <div 
              className={`dropzone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload-element').click()}
            >
              <input 
                type="file" 
                id="file-upload-element" 
                className="hidden" 
                accept=".pdf,.docx" 
                style={{ display: 'none' }} 
                onChange={handleFileChange}
              />
              
              <CloudUpload size={40} style={{ color: 'hsl(var(--primary))', margin: '0 auto 16px', display: 'block' }} />
              <div className="dz-primary">Drag and drop your file here</div>
              <div className="dz-secondary">or click to browse (.pdf, .docx format only)</div>
            </div>

            {selectedFile && (
              <div className="file-selected-card">
                <div className="file-info">
                  <span className="file-icon">📄</span>
                  <span className="file-name">{selectedFile.name}</span>
                </div>
                <button className="btn-remove" onClick={() => setSelectedFile(null)}>✕</button>
              </div>
            )}

            {isEvaluating && (
              <div className="screening-loader">
                <div className="spinner"></div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700 }}>Extracting resume texts & computing TF-IDF weights...</div>
                  <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginTop: '4px' }}>Local Sentence Transformers model calculation (MiniLM-L6-v2)</div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button 
                className="btn-secondary" 
                onClick={() => { setSelectedFile(null); setUploadModalJob(null); }}
                disabled={isEvaluating}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleApplySubmit}
                disabled={!selectedFile || isEvaluating}
              >
                Analyze & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
