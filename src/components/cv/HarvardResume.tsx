'use client';

import React, { useState } from 'react';
import { Printer, Copy, Check, Edit3, Eye, FileText } from 'lucide-react';

export interface HarvardCvData {
  personalInfo: {
    fullName: string;
    location: string;
    email: string;
    phone: string;
    linkedin: string;
    github?: string;
    portfolio?: string;
  };
  summaryProfile?: string;
  summary?: string;
  education: Array<{
    institution: string;
    location: string;
    degree: string;
    dates: string;
    gpa?: string;
    coursework?: string;
    highlights?: string;
  }>;
  experience: Array<{
    company: string;
    location: string;
    role: string;
    dates: string;
    bullets: string[];
  }>;
  trainingCertifications?: Array<{
    title: string;
    subtitle?: string;
    dates?: string;
    bullets?: string[];
  }>;
  certifications?: Array<{
    name: string;
    issuer?: string;
    year?: string;
    details?: string;
    bullets?: string[];
  }>;
  organizationalExperience?: Array<{
    organization: string;
    roles: Array<{
      role: string;
      dates: string;
      bullets: string[];
    }>;
  }>;
  leadership?: Array<{
    organization: string;
    role: string;
    dates: string;
    bullets: string[];
  }>;
  achievements?: Array<{
    title: string;
    year?: string;
    details?: string;
  }>;
  skillsActivitiesInterests?: {
    languages?: string;
    technicalSkills?: string;
    softSkills?: string;
  };
  skills?: {
    languages?: string[];
    frameworks?: string[];
    cloudDevOps?: string[];
    databasesTools?: string[];
  };
  projects?: Array<{
    title: string;
    role?: string;
    techStack?: string;
    dates?: string;
    bullets: string[];
  }>;
}

export const DEFAULT_HARVARD_CV_DATA: HarvardCvData = {
  personalInfo: {
    fullName: 'Nugroho Adi',
    location: 'Jakarta, Indonesia',
    phone: '+6281331620830',
    email: 'deeforce112002@gmail.com',
    linkedin: 'https://www.linkedin.com/in/nugrohoadi11/',
    portfolio: 'nugroho-adi.me',
  },
  summaryProfile:
    'Informatics graduate specializing in Full-Stack Web Development and Backend Engineering with hands-on experience designing, developing, and deploying scalable software solutions in microservices environments. Proficient in Java, JavaScript (React.js, Next.js), and Go, with a strong foundation in cloud-based infrastructure, containerized applications (Docker, Kubernetes), and CI/CD pipelines. Possesses an analytical, detail-oriented mindset with a proven track record of utilizing telemetry data and collaborating within agile, geo-distributed teams. Eager to leverage technical expertise in API product development and distributed systems to drive high-impact digital products.',
  education: [
    {
      institution: 'University of Muhammadiyah Malang',
      location: 'Malang, Indonesia',
      degree: 'Bachelor of Informatics',
      dates: '2021 - 2026',
      gpa: '3.83 / 4.0',
      coursework:
        'Data Structures, Algorithms, Software Engineering, Database Systems, Web & Mobile Programming.',
    },
  ],
  experience: [
    {
      company: 'Telkom Indonesia',
      location: 'Remote',
      role: 'Class Manager Digistar Class Intern 2026',
      dates: 'March 2026 – Now',
      bullets: [
        'Orchestrated end-to-end virtual mentoring operations for two learning paths (Soft Skills and Artificial Intelligence), managing 8 mentees in each class.',
        'Tailored operational support and bridged communication for diverse mentor pools across both behavioral and technical (AI) curricula, tracking assignments and ensuring grading SLAs were met with a compliance rate.',
        'Maintained strict administrative tracking for both cohorts, consistently delivering session feedback, attendance records, and programmatic evidence within 24 hours.',
      ],
    },
    {
      company: 'Digistar Club by Telkom Indonesia',
      location: 'Remote',
      role: 'Front-End Developer',
      dates: 'August 2025 – Now',
      bullets: [
        'Spearheaded the development of responsive, user-centric web applications using React.js, successfully translating UI/UX designs from Figma into interactive and highly functional web components.',
        'Optimized front-end architecture, reducing average page load times by 30% and boosting Lighthouse performance scores to 90+ through efficient React state management and lazy loading.',
        'Integrated 15+ RESTful APIs in collaboration with backend engineers, ensuring seamless data flow and dynamic content delivery for an active user base of 500+ club members.',
      ],
    },
    {
      company: 'Venturo',
      location: 'Malang, Indonesia',
      role: 'Mobile Programmer',
      dates: 'March 2025 – August 2025',
      bullets: [
        'Architected a scalable mobile application infrastructure utilizing Flutter and GetX, significantly accelerating feature time-to-market and enhancing overall product maintainability for the business.',
        'Optimized application stability and user experience across the product lifecycle by integrating real-time error tracking (Sentry) and diagnostic analytics, leading to proactive issue resolution before customer impact.',
        'Delivered seamless, consumer-facing mobile solutions by leveraging backend cloud services (Firebase) to power robust, high-performance features aligned with strict business requirements.',
      ],
    },
    {
      company: 'Telkom Indonesia',
      location: 'Jakarta, Indonesia',
      role: 'Developer',
      dates: 'September 2024 – December 2024',
      bullets: [
        'Selected as one of only 315 awardees from a highly competitive pool of 64,255 applicants.',
        'Architected and deployed scalable backend microservices using Java, Go, and Google Cloud Platform (GCP), creating robust APIs for high-throughput data processing.',
        'Designed and managed CI/CD pipelines to deploy containerized applications via Google Kubernetes Engine (GKE), ensuring high availability and automated scaling.',
        'Optimized system performance using managed GCP services like Cloud SQL and Pub/Sub to guarantee low latency and efficient data handling.',
      ],
    },
  ],
  trainingCertifications: [
    {
      title: 'Bangkit Academy 2023 By Google, GoTo, Traveloka',
      subtitle: 'Cloud Computing Cohort',
      dates: 'August 2023 – December 2023',
      bullets: [
        'Selected as one of 4,520 awardees out of 47,800 total registrants.',
        'Graduated with Distinction from a rigorous 922-hour Cloud Computing career readiness program.',
        'Developed expertise in deploying, managing, and scaling cloud-based solutions, collaborating with a team to implement a real-world cloud architecture capstone project.',
      ],
    },
    {
      title: 'Alibaba Cloud Certification',
      subtitle: 'Certified Developer',
      dates: '',
      bullets: [
        'Demonstrated technical proficiency in utilizing core Alibaba Cloud services (ECS, OSS, RDS) to design, deploy, and maintain highly scalable and secure cloud native applications.',
      ],
    },
    {
      title: 'AWS Certification',
      subtitle: 'AWS Certified Cloud Practitioner',
      dates: '',
      bullets: [
        'Validated foundational knowledge of AWS Cloud architecture, security protocols, billing models, and core services, establishing a strong baseline for enterprise cloud management.',
      ],
    },
  ],
  organizationalExperience: [
    {
      organization: 'Digistar Club by Telkom Indonesia',
      roles: [
        {
          role: 'Internal Vice Lead',
          dates: 'February 2026 - Now',
          bullets: [
            'Co-Lead the Internal Division, directly overseeing 4 sub-divisions (including AI Ecosystem & Infrastructure Club, Business & International Relations Club, Human Capital Development, and Performance Monitoring & Solutions) to drive operational excellence.',
          ],
        },
        {
          role: 'Digital Network Club Lead',
          dates: 'February 2025 – February 2026',
          bullets: [
            'Directed a core leadership team of 13 Rangers to manage and grow the Digital Network Club.',
            'Organized and executed 15 events focusing on Cyber Security, IoT, and Cloud Computing with industry professionals to enhance member technical skills.',
          ],
        },
      ],
    },
  ],
  achievements: [
    {
      title: 'Semi-Finalist DigiHack 2025: Selected among the top tier out of 256 competing teams',
      year: '2025',
    },
    {
      title: 'MSIB Batch 5 Awardee: Government Educational Program',
      year: '2023',
    },
    {
      title: 'MSIB Batch 7 Awardee: Government Educational Program',
      year: '2024',
    },
  ],
  skillsActivitiesInterests: {
    languages: 'Bahasa Indonesia (Native), English',
    technicalSkills: 'Cloud Computing, Flutter, React.js, Next.js, Nest.js, Golang, Java, Figma, SQL',
    softSkills: 'Adaptability, Collaboration, Analytical and Critical thinking, Problem Solving, Time Management',
  },
};

interface HarvardResumeProps {
  data: HarvardCvData;
  onChange?: (updated: HarvardCvData) => void;
  showActions?: boolean;
}

export default function HarvardResume({
  data: initialData,
  onChange,
  showActions = true,
}: HarvardResumeProps) {
  const [data, setData] = useState<HarvardCvData>(initialData || DEFAULT_HARVARD_CV_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [copiedAts, setCopiedAts] = useState(false);

  // Sync state if initialData changes externally
  React.useEffect(() => {
    setData(initialData || DEFAULT_HARVARD_CV_DATA);
  }, [initialData]);

  const updateField = (updater: (prev: HarvardCvData) => HarvardCvData) => {
    setData((prev) => {
      const updated = updater(prev);
      onChange?.(updated);
      return updated;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Divide experiences across page 1 (first 3) and page 2 (remaining, e.g. Telkom Developer 2024)
  const allExperiences = data.experience || [];
  const page1Exp = allExperiences.slice(0, 3);
  const page2Exp = allExperiences.slice(3);

  // Format training certifications
  const trainings =
    data.trainingCertifications ||
    (data.certifications
      ? data.certifications.map((c) => ({
          title: c.issuer ? `${c.name} By ${c.issuer}` : c.name,
          subtitle: c.issuer || '',
          dates: c.year || '',
          bullets: c.details ? [c.details] : c.bullets || [],
        }))
      : []);

  // Format organizational experience
  const orgs =
    data.organizationalExperience ||
    (data.leadership
      ? [
          {
            organization: data.leadership[0]?.organization || 'Digistar Club by Telkom Indonesia',
            roles: data.leadership.map((l) => ({
              role: l.role,
              dates: l.dates,
              bullets: l.bullets,
            })),
          },
        ]
      : []);

  // Format skills & languages
  const languagesText =
    data.skillsActivitiesInterests?.languages ||
    'Bahasa Indonesia (Native), English';

  const technicalSkillsText =
    data.skillsActivitiesInterests?.technicalSkills ||
    [
      ...(data.skills?.languages || []),
      ...(data.skills?.frameworks || []),
      ...(data.skills?.cloudDevOps || []),
    ].join(', ') ||
    'Cloud Computing, Flutter, React.js, Next.js, Nest.js, Golang, Java, Figma, SQL';

  const softSkillsText =
    data.skillsActivitiesInterests?.softSkills ||
    'Adaptability, Collaboration, Analytical and Critical thinking, Problem Solving, Time Management';

  // Format achievements
  const achievementsList =
    data.achievements || [
      {
        title: 'Semi-Finalist DigiHack 2025: Selected among the top tier out of 256 competing teams',
        year: '2025',
      },
      {
        title: 'MSIB Batch 5 Awardee: Government Educational Program',
        year: '2023',
      },
      {
        title: 'MSIB Batch 7 Awardee: Government Educational Program',
        year: '2024',
      },
    ];

  const generateAtsText = () => {
    const lines: string[] = [];
    const { personalInfo, education } = data;

    lines.push(personalInfo.fullName.toUpperCase());
    lines.push(
      [personalInfo.location, personalInfo.phone, personalInfo.email, personalInfo.linkedin, personalInfo.portfolio]
        .filter(Boolean)
        .join(' | ')
    );
    lines.push('\n=== LEMBAR 1 / PAGE 1 ===\n');

    const summaryText = data.summaryProfile || data.summary;
    if (summaryText) {
      lines.push('SUMMARY PROFILE');
      lines.push('---------------');
      lines.push(summaryText);
      lines.push('\n');
    }

    lines.push('EDUCATION');
    lines.push('---------');
    education.forEach((edu) => {
      lines.push(`${edu.institution} — ${edu.location}`);
      lines.push(`${edu.degree} | ${edu.dates}`);
      if (edu.gpa) lines.push(`GPA: ${edu.gpa}`);
      if (edu.coursework || edu.highlights) {
        lines.push(`Relevant Coursework: ${edu.coursework || edu.highlights}`);
      }
      lines.push('');
    });

    lines.push('EXPERIENCE');
    lines.push('----------');
    page1Exp.forEach((exp) => {
      lines.push(`${exp.company} — ${exp.location}`);
      lines.push(`${exp.role} | ${exp.dates}`);
      exp.bullets.forEach((b) => lines.push(`• ${b}`));
      lines.push('');
    });

    lines.push('\n=== LEMBAR 2 / PAGE 2 ===\n');

    if (page2Exp.length > 0) {
      lines.push('EXPERIENCE (CONTINUED)');
      lines.push('----------------------');
      page2Exp.forEach((exp) => {
        lines.push(`${exp.company} — ${exp.location}`);
        lines.push(`${exp.role} | ${exp.dates}`);
        exp.bullets.forEach((b) => lines.push(`• ${b}`));
        lines.push('');
      });
    }

    if (trainings.length > 0) {
      lines.push('TRAINING & CERTIFICATION');
      lines.push('------------------------');
      trainings.forEach((tr) => {
        lines.push(`${tr.title} ${tr.dates ? `| ${tr.dates}` : ''}`);
        if (tr.subtitle) lines.push(tr.subtitle);
        (tr.bullets || []).forEach((b) => lines.push(`• ${b}`));
        lines.push('');
      });
    }

    if (orgs.length > 0) {
      lines.push('ORGANIZATIONAL EXPERIENCE');
      lines.push('-------------------------');
      orgs.forEach((org) => {
        lines.push(org.organization);
        org.roles.forEach((r) => {
          lines.push(`${r.role} | ${r.dates}`);
          r.bullets.forEach((b) => lines.push(`• ${b}`));
        });
        lines.push('');
      });
    }

    if (achievementsList.length > 0) {
      lines.push('ACHIEVEMENTS');
      lines.push('------------');
      achievementsList.forEach((ach) => {
        lines.push(`• ${ach.title} ${ach.year ? `(${ach.year})` : ''}`);
      });
      lines.push('\n');
    }

    lines.push('SKILLS, ACTIVITIES & INTERESTS');
    lines.push('------------------------------');
    lines.push(`Languages: ${languagesText}`);
    lines.push(`Technical Skills: ${technicalSkillsText}`);
    lines.push(`Soft Skills: ${softSkillsText}`);

    return lines.join('\n');
  };

  const handleCopyAts = async () => {
    try {
      await navigator.clipboard.writeText(generateAtsText());
      setCopiedAts(true);
      setTimeout(() => setCopiedAts(false), 2000);
    } catch (err) {
      console.error('Failed to copy ATS text:', err);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Toolbar Controls (Hidden during print) */}
      {showActions && (
        <div className="no-print w-full max-w-[850px] mb-4 flex flex-wrap items-center justify-between bg-slate-800/90 border border-slate-700 p-3 rounded-2xl backdrop-blur-md gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              CV Standar Harvard (Format 2 Lembar / 2-Page CV)
            </span>
            <span className="text-slate-500 text-xs">|</span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition ${
                isEditing
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-700/60 text-slate-300 border-slate-600 hover:bg-slate-700'
              }`}
            >
              {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
              <span>{isEditing ? 'Lihat Preview' : 'Edit Teks CV'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAts}
              className="flex items-center gap-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-xl border border-slate-600 transition"
              title="Salin teks ATS 2 lembar untuk form lamaran portal online"
            >
              {copiedAts ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAts ? 'Teks ATS Disalin!' : 'Salin Teks ATS (2 Lembar)'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-1.5 rounded-xl transition shadow-sm"
              title="Print langsung atau Simpan sebagai PDF 2 Lembar"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Simpan PDF (2 Lembar)</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Container for 2-Page Harvard Resume */}
      <div id="harvard-cv-print-area" className="w-full flex flex-col items-center">
        {/* ======================================================== */}
        {/* LEMBAR 1 / PAGE 1 */}
        {/* ======================================================== */}
        <div className="no-print w-full max-w-[850px] mb-2 flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <FileText className="w-3.5 h-3.5" /> Lembar 1 / Page 1 (Summary, Education & Experience Part 1)
          </span>
          <span className="text-slate-500">A4 Portrait</span>
        </div>

        <div
          className="w-full max-w-[850px] bg-white text-black font-serif shadow-xl rounded-sm p-8 sm:p-12 mb-6 print:p-0 print:m-0 print:shadow-none print:w-full print:max-w-none"
          style={{
            fontFamily: '"Times New Roman", Times, "Georgia", serif',
            lineHeight: '1.25',
            color: '#111827',
          }}
        >
          {/* HEADER: Centered Name & Contact Info */}
          <header className="text-center pb-2">
            <h1 className="text-[26px] sm:text-[28px] font-bold tracking-normal text-black mb-1">
              {data.personalInfo.fullName}
            </h1>
            <div className="text-[12px] text-gray-900 flex flex-wrap justify-center items-center gap-x-1.5 gap-y-0.5">
              <span>{data.personalInfo.location || 'Jakarta, Indonesia'}</span>
              <span>|</span>
              <span>{data.personalInfo.phone || '+6281331620830'}</span>
              <span>|</span>
              <a href={`mailto:${data.personalInfo.email}`} className="text-blue-700 underline">
                {data.personalInfo.email}
              </a>
              <span>|</span>
              <a
                href={data.personalInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 underline"
              >
                {data.personalInfo.linkedin || 'https://www.linkedin.com/in/nugrohoadi11/'}
              </a>
              <span>|</span>
              <a
                href={data.personalInfo.portfolio?.startsWith('http') ? data.personalInfo.portfolio : `https://${data.personalInfo.portfolio || 'nugroho-adi.me'}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 underline"
              >
                {data.personalInfo.portfolio || 'nugroho-adi.me'}
              </a>
            </div>
          </header>

          {/* SUMMARY PROFILE */}
          <section className="mt-2.5">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
              SUMMARY PROFILE
            </h2>
            {isEditing ? (
              <textarea
                value={data.summaryProfile || data.summary || ''}
                onChange={(e) =>
                  updateField((prev) => ({
                    ...prev,
                    summaryProfile: e.target.value,
                    summary: e.target.value,
                  }))
                }
                rows={5}
                className="w-full text-[11.5px] p-1 border border-amber-300 rounded bg-amber-50/50 font-serif"
              />
            ) : (
              <p className="text-[11.5px] text-gray-900 text-justify leading-relaxed">
                {data.summaryProfile || data.summary}
              </p>
            )}
          </section>

          {/* EDUCATION SECTION */}
          <section className="mt-3">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
              EDUCATION
            </h2>
            {data.education.map((edu, idx) => (
              <div key={idx} className="mb-2">
                <div className="flex justify-between items-baseline text-[12px]">
                  <span className="font-bold text-black">{edu.institution}</span>
                  <span className="font-bold text-black">{edu.location}</span>
                </div>
                <div className="flex justify-between items-baseline text-[11.5px] italic text-gray-900 mb-0.5">
                  <span>{edu.degree}</span>
                  <span className="not-italic text-black font-normal">{edu.dates}</span>
                </div>
                <ul className="list-disc ml-5 space-y-0.5 text-[11px] sm:text-[11.5px] text-gray-900 leading-snug">
                  {edu.gpa && <li>GPA: {edu.gpa}</li>}
                  {(edu.coursework || edu.highlights) && (
                    <li>
                      <span className="font-semibold text-black">Relevant Coursework:</span>{' '}
                      {edu.coursework || edu.highlights}
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </section>

          {/* EXPERIENCE SECTION (PAGE 1) */}
          <section className="mt-3">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
              EXPERIENCE
            </h2>
            {page1Exp.map((exp, expIdx) => (
              <div key={expIdx} className="mb-3">
                <div className="flex justify-between items-baseline text-[12px]">
                  <span className="font-bold text-black">{exp.company}</span>
                  <span className="font-bold text-black">{exp.location}</span>
                </div>
                <div className="flex justify-between items-baseline text-[11.5px] italic text-gray-900 mb-1">
                  <span>{exp.role}</span>
                  <span className="not-italic text-black font-normal">{exp.dates}</span>
                </div>
                <ul className="list-disc ml-5 space-y-0.5 text-[11px] sm:text-[11.5px] text-gray-900 leading-snug text-justify">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx}>
                      {isEditing ? (
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateField((prev) => {
                              const updated = [...prev.experience];
                              updated[expIdx].bullets[bIdx] = val;
                              return { ...prev, experience: updated };
                            });
                          }}
                          className="w-full text-[11px] p-0.5 border border-amber-300 bg-amber-50/50 rounded font-serif"
                        />
                      ) : (
                        bullet
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </div>

        {/* ======================================================== */}
        {/* PAGE BREAK SEPARATOR FOR PRINT & SCREEN */}
        {/* ======================================================== */}
        <div className="page-break no-print w-full max-w-[850px] my-4 flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <FileText className="w-3.5 h-3.5" /> Lembar 2 / Page 2 (Experience Continued, Training, Organisasi, Achievements & Skills)
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 text-[10px]">
            Halaman ke-2
          </span>
        </div>

        {/* ======================================================== */}
        {/* LEMBAR 2 / PAGE 2 */}
        {/* ======================================================== */}
        <div
          className="w-full max-w-[850px] bg-white text-black font-serif shadow-xl rounded-sm p-8 sm:p-12 mb-6 print:p-0 print:m-0 print:shadow-none print:w-full print:max-w-none print:mt-0"
          style={{
            fontFamily: '"Times New Roman", Times, "Georgia", serif',
            lineHeight: '1.25',
            color: '#111827',
          }}
        >
          {/* EXPERIENCE (CONTINUED ON PAGE 2) */}
          {page2Exp.length > 0 && (
            <section className="mb-3">
              {page2Exp.map((exp, expIdx) => (
                <div key={expIdx} className="mb-3">
                  <div className="flex justify-between items-baseline text-[12px]">
                    <span className="font-bold text-black">{exp.company}</span>
                    <span className="font-bold text-black">{exp.location}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-[11.5px] italic text-gray-900 mb-1">
                    <span>{exp.role}</span>
                    <span className="not-italic text-black font-normal">{exp.dates}</span>
                  </div>
                  <ul className="list-disc ml-5 space-y-0.5 text-[11px] sm:text-[11.5px] text-gray-900 leading-snug text-justify">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {/* TRAINING & CERTIFICATION SECTION */}
          {trainings.length > 0 && (
            <section className="mb-3">
              <h2 className="text-[12px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
                TRAINING &amp; CERTIFICATION
              </h2>
              {trainings.map((tr, trIdx) => (
                <div key={trIdx} className="mb-2.5">
                  <div className="flex justify-between items-baseline text-[12px]">
                    <span className="font-bold text-black">{tr.title}</span>
                    {!tr.subtitle && tr.dates && (
                      <span className="not-italic text-black font-normal text-[11.5px]">{tr.dates}</span>
                    )}
                  </div>
                  {tr.subtitle && (
                    <div className="flex justify-between items-baseline text-[11.5px] italic text-gray-900 mb-0.5">
                      <span>{tr.subtitle}</span>
                      {tr.dates && <span className="not-italic text-black font-normal">{tr.dates}</span>}
                    </div>
                  )}
                  {tr.bullets && tr.bullets.length > 0 && (
                    <ul className="list-disc ml-5 space-y-0.5 text-[11px] sm:text-[11.5px] text-gray-900 leading-snug text-justify">
                      {tr.bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* ORGANIZATIONAL EXPERIENCE (ORGANISASI) */}
          {orgs.length > 0 && (
            <section className="mb-3">
              <h2 className="text-[12px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
                ORGANIZATIONAL EXPERIENCE
              </h2>
              {orgs.map((org, oIdx) => (
                <div key={oIdx} className="mb-2">
                  <div className="text-[12px] font-bold text-black mb-0.5">{org.organization}</div>
                  {org.roles.map((r, rIdx) => (
                    <div key={rIdx} className="mb-2">
                      <div className="flex justify-between items-baseline text-[11.5px] italic text-gray-900 mb-0.5">
                        <span className="font-medium">{r.role}</span>
                        <span className="not-italic text-black font-normal">{r.dates}</span>
                      </div>
                      <ul className="list-disc ml-5 space-y-0.5 text-[11px] sm:text-[11.5px] text-gray-900 leading-snug text-justify">
                        {r.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </section>
          )}

          {/* ACHIEVEMENTS */}
          {achievementsList.length > 0 && (
            <section className="mb-3">
              <h2 className="text-[12px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
                ACHIEVEMENTS
              </h2>
              <ul className="list-disc ml-5 space-y-0.5 text-[11px] sm:text-[11.5px] text-gray-900 leading-snug">
                {achievementsList.map((ach, aIdx) => {
                  const hasColon = ach.title.includes(':');
                  const prefix = hasColon ? ach.title.split(':')[0] + ':' : '';
                  const rest = hasColon ? ach.title.substring(ach.title.indexOf(':') + 1) : ach.title;
                  return (
                    <li key={aIdx} className="flex justify-between items-baseline">
                      <span className="flex-1 pr-2">
                        {prefix && <span className="font-semibold text-black">{prefix} </span>}
                        <span>{rest}</span>
                      </span>
                      {ach.year && <span className="text-black font-normal shrink-0">{ach.year}</span>}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* SKILLS, ACTIVITIES & INTERESTS (INCLUDES LANGUAGES) */}
          <section className="mb-2">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
              SKILLS, ACTIVITIES &amp; INTERESTS
            </h2>
            <div className="space-y-1 text-[11.5px] text-gray-900">
              <div>
                <span className="font-bold text-black">Languages: </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={languagesText}
                    onChange={(e) =>
                      updateField((prev) => ({
                        ...prev,
                        skillsActivitiesInterests: {
                          ...prev.skillsActivitiesInterests,
                          languages: e.target.value,
                        },
                      }))
                    }
                    className="w-2/3 p-0.5 border border-amber-300 rounded font-serif"
                  />
                ) : (
                  <span>{languagesText}</span>
                )}
              </div>
              <div>
                <span className="font-bold text-black">Technical Skills: </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={technicalSkillsText}
                    onChange={(e) =>
                      updateField((prev) => ({
                        ...prev,
                        skillsActivitiesInterests: {
                          ...prev.skillsActivitiesInterests,
                          technicalSkills: e.target.value,
                        },
                      }))
                    }
                    className="w-full p-0.5 border border-amber-300 rounded font-serif mt-0.5"
                  />
                ) : (
                  <span>{technicalSkillsText}</span>
                )}
              </div>
              <div>
                <span className="font-bold text-black">Soft Skills: </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={softSkillsText}
                    onChange={(e) =>
                      updateField((prev) => ({
                        ...prev,
                        skillsActivitiesInterests: {
                          ...prev.skillsActivitiesInterests,
                          softSkills: e.target.value,
                        },
                      }))
                    }
                    className="w-full p-0.5 border border-amber-300 rounded font-serif mt-0.5"
                  />
                ) : (
                  <span>{softSkillsText}</span>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Global CSS for 2-Page Print Layout */}
      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          .no-print,
          aside,
          header,
          nav {
            display: none !important;
          }
          .page-break {
            page-break-before: always !important;
            break-before: page !important;
            display: block !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          #harvard-cv-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm 14mm;
          }
        }
      `}</style>
    </div>
  );
}
