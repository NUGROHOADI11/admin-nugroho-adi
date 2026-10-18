import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const runtime = 'nodejs';

function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the admin environment.');
  }
  return new GoogleGenAI({ apiKey });
}

const NUGROHO_PROFILE = {
  fullName: 'Nugroho Adi',
  location: 'Jakarta, Indonesia',
  email: 'deeforce112002@gmail.com',
  phone: '+6281331620830',
  linkedin: 'https://www.linkedin.com/in/nugrohoadi11/',
  portfolio: 'nugroho-adi.me',
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

async function fetchLinkedInJobDescription(url: string): Promise<string | null> {
  try {
    const match = url.match(/-(\d{8,12})/);
    if (!match) return null;
    const jobId = match[1];
    const apiUrl = `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`;
    const res = await fetch(apiUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const text = await res.text();
    const descMatch = text.match(/<div class="show-more-less-html__markup[^"]*">([\s\S]*?)<\/div>/);
    if (!descMatch) return null;
    return descMatch[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  } catch (e) {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { jobTitle, company, location, jobDescription, jobUrl } = body;

    if (!jobTitle) {
      return NextResponse.json(
        { success: false, error: 'jobTitle is required.' },
        { status: 400 }
      );
    }

    // Auto-fetch JD from LinkedIn if description is minimal but URL is provided
    if ((!jobDescription || jobDescription.length < 100) && jobUrl && jobUrl.includes('linkedin.com')) {
      const fetchedDesc = await fetchLinkedInJobDescription(jobUrl);
      if (fetchedDesc) {
        jobDescription = fetchedDesc;
      }
    }

    if (!jobDescription || jobDescription.trim().length === 0) {
      jobDescription = `Position: ${jobTitle} at ${company || 'Hiring Company'}, located in ${location || 'Indonesia'}. Looking for a talented junior to mid software engineer (1-3 years experience).`;
    }

    const ai = getGenAI();

    const prompt = `
You are an expert Executive Career Coach and ATS (Applicant Tracking System) Specialist adhering strictly to the **Harvard College Resume Guide**.

CRITICAL REQUIREMENT:
The user explicitly requires a comprehensive **2-PAGE HARVARD CV (CV 2 LEMBAR)** specifically tailored for an early-career / Junior / Mid-level Software Engineer position (0-3 years experience / fresh grad high-achiever).
The CV layout must match the user's authentic Harvard CV format across exactly 2 pages:

PAGE 1 SECTIONS:
1. Centered Header: Name, location, phone, email, LinkedIn, website.
2. SUMMARY PROFILE: A tailored, high-impact 4-6 sentence summary positioning Nugroho Adi as the ideal candidate for this specific role, highlighting relevant technologies (e.g. Java, Go, React, Next.js, GCP, Flutter depending on the JD) without fabricating experience.
3. EDUCATION: University of Muhammadiyah Malang, Bachelor of Informatics (GPA 3.83 / 4.0), Relevant Coursework.
4. EXPERIENCE (Part 1 - first 3 experiences):
   - Telkom Indonesia (Class Manager Digistar Class Intern 2026, March 2026 – Now)
   - Digistar Club by Telkom Indonesia (Front-End Developer, August 2025 – Now)
   - Venturo (Mobile Programmer, March 2025 – August 2025)
   (Tailor the bullet points to highlight skills and metrics relevant to the target job).

PAGE 2 SECTIONS:
5. EXPERIENCE (Part 2 - continued):
   - Telkom Indonesia (Developer, September 2024 – December 2024) - Top 315/64,255 awardee, Backend microservices in Java/Go/GCP.
6. TRAINING & CERTIFICATION:
   - Bangkit Academy 2023 By Google, GoTo, Traveloka (Cloud Computing Cohort with Distinction)
   - Alibaba Cloud Certification (Certified Developer)
   - AWS Certification (AWS Certified Cloud Practitioner)
7. ORGANIZATIONAL EXPERIENCE (ORGANISASI):
   - Digistar Club by Telkom Indonesia:
     * Internal Vice Lead (February 2026 - Now)
     * Digital Network Club Lead (February 2025 – February 2026)
8. ACHIEVEMENTS:
   - Semi-Finalist DigiHack 2025: Selected among the top tier out of 256 competing teams (2025)
   - MSIB Batch 5 Awardee: Government Educational Program (2023)
   - MSIB Batch 7 Awardee: Government Educational Program (2024)
9. SKILLS, ACTIVITIES & INTERESTS:
   - Languages: "Bahasa Indonesia (Native), English" (MUST INCLUDE BOTH LANGUAGES!)
   - Technical Skills: Tailored list of tools and technologies relevant to this job (e.g. Cloud Computing, Flutter, React.js, Next.js, Nest.js, Golang, Java, Figma, SQL, Docker, Kubernetes).
   - Soft Skills: "Adaptability, Collaboration, Analytical and Critical thinking, Problem Solving, Time Management".

TARGET JOB:
- Position: ${jobTitle}
- Company: ${company || 'Hiring Company'}
- Location: ${location || 'Indonesia (Remote / Hybrid)'}
- Job Description:
${jobDescription}

CANDIDATE BASE DATA (Nugroho Adi):
${JSON.stringify(NUGROHO_PROFILE, null, 2)}

ADDITIONAL REQUIREMENTS:
- Calculate realistic ATS Match Score (0-100) based on beginner / 1-3 years requirements.
- Provide targeted matchSummary, strengths, and keywordsToHighlight.
- Write a compelling Email Cover Letter Pitch and LinkedIn Outreach Message.

OUTPUT FORMAT:
Return pure valid JSON matching this exact structure:
{
  "matchScore": number,
  "matchSummary": string,
  "strengths": string[],
  "keywordsToHighlight": string[],
  "harvardCv": {
    "personalInfo": {
      "fullName": "Nugroho Adi",
      "location": "Jakarta, Indonesia",
      "email": "deeforce112002@gmail.com",
      "phone": "+6281331620830",
      "linkedin": "https://www.linkedin.com/in/nugrohoadi11/",
      "portfolio": "nugroho-adi.me"
    },
    "summaryProfile": string,
    "education": [
      {
        "institution": "University of Muhammadiyah Malang",
        "location": "Malang, Indonesia",
        "degree": "Bachelor of Informatics",
        "dates": "2021 - 2026",
        "gpa": "3.83 / 4.0",
        "coursework": "Data Structures, Algorithms, Software Engineering, Database Systems, Web & Mobile Programming."
      }
    ],
    "experience": [
      {
        "company": string,
        "location": string,
        "role": string,
        "dates": string,
        "bullets": string[]
      }
    ],
    "trainingCertifications": [
      {
        "title": string,
        "subtitle": string,
        "dates": string,
        "bullets": string[]
      }
    ],
    "organizationalExperience": [
      {
        "organization": string,
        "roles": [
          {
            "role": string,
            "dates": string,
            "bullets": string[]
          }
        ]
      }
    ],
    "achievements": [
      {
        "title": string,
        "year": string
      }
    ],
    "skillsActivitiesInterests": {
      "languages": "Bahasa Indonesia (Native), English",
      "technicalSkills": string,
      "softSkills": "Adaptability, Collaboration, Analytical and Critical thinking, Problem Solving, Time Management"
    }
  },
  "emailPitch": {
    "subject": string,
    "body": string
  },
  "linkedinPitch": {
    "message": string
  }
}
`;

    // Try primary model gemini-3.5-flash with fallbacks
    const candidateModels = ['gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let lastError: unknown = null;
    let generatedText = '';

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          generatedText = response.text;
          break;
        }
      } catch (err) {
        console.warn(`[Tailor CV] Model ${model} failed, trying next fallback:`, err);
        lastError = err;
      }
    }

    if (!generatedText) {
      throw new Error(`Failed to generate CV with Gemini: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
    }

    // Parse JSON
    const parsedData = JSON.parse(generatedText);

    return NextResponse.json({
      success: true,
      data: {
        ...parsedData,
        jobMeta: {
          jobTitle,
          company,
          location,
          jobUrl,
          tailoredAt: new Date().toISOString(),
        },
      },
    });
  } catch (err) {
    console.error('[API /api/jobs/tailor-cv Error]:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
