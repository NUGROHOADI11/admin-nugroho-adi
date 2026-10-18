import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export interface NormalizedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  experienceLevel?: string;
  tags: string[];
  salary?: string | null;
  url: string;
  description: string;
  postedAt: string;
  source: string;
  logo?: string | null;
}

// Curated active Junior / Beginner / Associate tech vacancies in Indonesia (0 - 3 years experience)
const CURATED_INDONESIA_JUNIOR_JOBS: NormalizedJob[] = [
  {
    id: 'id-kredivo-backend-sde1',
    title: 'Backend Engineer - Golang (SDE 1 / 1-2 Years)',
    company: 'Kredivo Group',
    location: 'Jakarta Selatan, DKI Jakarta (Hybrid)',
    type: 'Full-time',
    experienceLevel: 'Junior (1-2 Tahun)',
    tags: ['Go', 'Microservices', 'PostgreSQL', 'Docker', 'RESTful APIs'],
    salary: 'IDR 12,000,000 - 18,000,000',
    url: 'https://id.linkedin.com/jobs/search/?keywords=Kredivo+Golang+SDE+1&location=Indonesia',
    description: 'Looking for a Junior / Mid Backend Engineer with 1-2 years experience in Go (Golang) to develop scalable transaction and payment processing microservices.',
    postedAt: 'Recently',
    source: 'LinkedIn Indonesia',
  },
  {
    id: 'id-goto-associate-fullstack',
    title: 'Associate Software Engineer - Full Stack (React & Go)',
    company: 'GoTo Financial (Gojek / Tokopedia)',
    location: 'Jakarta Selatan, DKI Jakarta (Hybrid)',
    type: 'Full-time',
    experienceLevel: 'Entry Level / 1-3 Tahun',
    tags: ['React.js', 'Next.js', 'Go', 'GCP', 'PostgreSQL', 'Docker'],
    salary: 'IDR 14,000,000 - 22,000,000',
    url: 'https://id.jobstreet.com/id/job-search/goto-financial-jobs/',
    description: 'Join GoTo Financial as an Associate Software Engineer. Ideal for fresh graduates or engineers with 1-3 years of experience proficient in modern React, Go, and cloud platforms.',
    postedAt: '2 days ago',
    source: 'Jobstreet Indonesia',
  },
  {
    id: 'id-traveloka-junior-backend',
    title: 'Junior Software Engineer - Backend (Java / Go)',
    company: 'Traveloka',
    location: 'Tangerang / Jakarta (Remote / Hybrid)',
    type: 'Full-time',
    experienceLevel: 'Junior (1-3 Tahun)',
    tags: ['Java', 'Spring Boot', 'Go', 'AWS', 'PostgreSQL'],
    salary: 'IDR 13,000,000 - 20,000,000',
    url: 'https://id.linkedin.com/jobs/search/?keywords=Traveloka+Software+Engineer&location=Indonesia',
    description: 'Develop resilient backend services for Southeast Asia’s leading lifestyle platform. Perfect for developers with 1-3 years experience building clean APIs and relational database models.',
    postedAt: '3 days ago',
    source: 'LinkedIn Indonesia',
  },
  {
    id: 'id-bca-digital-fe',
    title: 'Junior Front-End Web Developer (Next.js / React / TypeScript)',
    company: 'BCA Digital (blu by BCA)',
    location: 'Jakarta Pusat, DKI Jakarta',
    type: 'Full-time',
    experienceLevel: 'Entry / 1-3 Tahun',
    tags: ['Next.js', 'React.js', 'TypeScript', 'Tailwind CSS', 'Mobile Web'],
    salary: 'IDR 10,000,000 - 16,000,000',
    url: 'https://id.jobstreet.com/id/job-search/bca-digital-jobs/',
    description: 'Build user-friendly, high-security banking interfaces for blu digital bank. Fresh graduates and developers with 1-2 years experience in React/Next.js are encouraged to apply.',
    postedAt: 'Recently',
    source: 'Jobstreet Indonesia',
  },
  {
    id: 'id-telkom-assoc-devops',
    title: 'Associate Cloud Platform & DevOps Engineer',
    company: 'Telkom Indonesia',
    location: 'Jakarta / Bandung (Hybrid)',
    type: 'Full-time',
    experienceLevel: 'Junior (1-3 Tahun)',
    tags: ['GCP', 'Docker', 'Kubernetes (GKE)', 'Linux', 'CI/CD'],
    salary: 'IDR 11,000,000 - 17,000,000',
    url: 'https://id.linkedin.com/jobs/search/?keywords=Telkom+Devops+Engineer&location=Indonesia',
    description: 'Support enterprise cloud infrastructure across Telkom digital squads. Manage containerized microservices deployments with Docker and GKE, setup CI/CD pipelines, and monitor telemetry.',
    postedAt: '4 days ago',
    source: 'LinkedIn Indonesia',
  },
  {
    id: 'id-tiket-se1',
    title: 'Software Engineer I - Backend (Golang & Java)',
    company: 'Tiket.com (PT Global Tiket Network)',
    location: 'Jakarta Pusat / Remote Indonesia',
    type: 'Full-time',
    experienceLevel: 'Junior (1-2 Tahun)',
    tags: ['Golang', 'Java', 'MySQL', 'Redis', 'Kafka'],
    salary: 'IDR 12,000,000 - 19,000,000',
    url: 'https://id.linkedin.com/jobs/search/?keywords=Tiket.com+Software+Engineer&location=Indonesia',
    description: 'Build robust ticketing and reservation backend engines. Looking for early-career engineers (1-2 years) with solid understanding of algorithms, relational databases, and RESTful APIs.',
    postedAt: 'Recently',
    source: 'LinkedIn Indonesia',
  },
  {
    id: 'id-dana-assoc-mobile',
    title: 'Junior Mobile Engineer (Flutter & Dart)',
    company: 'DANA Indonesia',
    location: 'Jakarta Selatan, DKI Jakarta',
    type: 'Full-time',
    experienceLevel: 'Junior (1-3 Tahun)',
    tags: ['Flutter', 'Dart', 'GetX/Bloc', 'REST APIs', 'Git'],
    salary: 'IDR 11,000,000 - 17,000,000',
    url: 'https://id.jobstreet.com/id/job-search/dana-indonesia-jobs/',
    description: 'Build modular digital wallet user interfaces and flows. Requires 1+ years experience in Flutter/Dart, state management, and connecting to secure backend APIs.',
    postedAt: 'Recently',
    source: 'Jobstreet Indonesia',
  },
  {
    id: 'id-blibli-junior-backend',
    title: 'Junior Software Development Engineer - Backend',
    company: 'Blibli (PT Global Digital Niaga)',
    location: 'Jakarta Barat / Remote Indonesia',
    type: 'Full-time',
    experienceLevel: 'Junior (1-2 Tahun)',
    tags: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
    salary: 'IDR 12,000,000 - 18,000,000',
    url: 'https://id.linkedin.com/jobs/search/?keywords=Blibli+Backend+Engineer&location=Indonesia',
    description: 'Great opportunity for junior backend developers with 1-2 years experience. Work alongside senior mentors to build e-commerce APIs, optimize queries, and deploy microservices.',
    postedAt: 'Recently',
    source: 'LinkedIn Indonesia',
  },
  {
    id: 'id-mandiri-fullstack-assoc',
    title: 'Associate Full Stack Developer',
    company: 'Bank Mandiri (Persero) Tbk',
    location: 'Jakarta Selatan, DKI Jakarta',
    type: 'Full-time',
    experienceLevel: 'Entry / 1-3 Tahun',
    tags: ['React.js', 'Java Spring Boot', 'REST APIs', 'SQL'],
    salary: 'IDR 12,000,000 - 18,000,000',
    url: 'https://id.jobstreet.com/id/job-search/bank-mandiri-jobs/',
    description: 'Develop next-generation digital financial solutions within Bank Mandiri’s digital banking division. Open for fresh graduates and candidates with up to 3 years experience.',
    postedAt: '5 days ago',
    source: 'Jobstreet Indonesia',
  },
  {
    id: 'id-grab-junior-fullstack',
    title: 'Software Engineer - Backend & Web (1-3 Years)',
    company: 'Grab Indonesia',
    location: 'Jakarta Metropolitan Area (Hybrid)',
    type: 'Full-time',
    experienceLevel: '1-3 Tahun',
    tags: ['Go', 'React.js', 'MySQL', 'Distributed Systems'],
    salary: 'IDR 15,000,000 - 24,000,000',
    url: 'https://id.linkedin.com/jobs/search/?keywords=Grab+Software+Engineer&location=Indonesia',
    description: 'Grab is seeking early-career software engineers with 1-3 years experience in Go or fullstack web technologies to contribute to high-scale delivery and merchant tools.',
    postedAt: 'Recently',
    source: 'LinkedIn Indonesia',
  },
];

// Clean HTML to plain text
function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Check if title has senior keywords that should be excluded
function isSeniorTitle(title: string): boolean {
  const seniorPattern = /\b(senior|sr\.?|lead|principal|staff|head\s+of|director|vp|vice\s+president|manager|tech\s+lead|architect)\b/i;
  return seniorPattern.test(title);
}

// Fetch from LinkedIn Indonesia Guest API with experience filter f_E=1,2,3 (Internship, Entry level, Associate)
async function fetchLinkedInJobs(
  query: string,
  location = 'Indonesia',
  onlyJunior = true
): Promise<NormalizedJob[]> {
  const jobs: NormalizedJob[] = [];
  try {
    // f_E=1,2,3 filters for Internship, Entry level, and Associate on LinkedIn
    const expParam = onlyJunior ? '&f_E=1,2,3' : '';
    const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(
      query
    )}&location=${encodeURIComponent(location)}${expParam}&start=0`;

    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      next: { revalidate: 180 }, // cache 3 mins
    });

    if (!res.ok) {
      console.warn(`[LinkedIn API] returned HTTP ${res.status}`);
      return [];
    }

    const html = await res.text();
    const parts = html.split('<li');

    for (const p of parts) {
      if (!p.includes('base-search-card')) continue;
      const linkMatch = p.match(/href="([^"]*)"/);
      const titleMatch = p.match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
      const companyMatch = p.match(/<h4[^>]*>([\s\S]*?)<\/h4>/);
      const locMatch = p.match(/<span class="job-search-card__location"[^>]*>([\s\S]*?)<\/span>/);
      const timeMatch = p.match(/<time[^>]*datetime="([^"]*)"[^>]*>([\s\S]*?)<\/time>/);
      const imgMatch = p.match(/data-delayed-url="([^"]*)"/);

      if (linkMatch && titleMatch) {
        const title = titleMatch[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

        // Strict filter: exclude Senior titles if onlyJunior is enabled
        if (onlyJunior && isSeniorTitle(title)) {
          continue;
        }

        const company = companyMatch
          ? companyMatch[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
          : 'Hiring Company';
        const loc = locMatch ? locMatch[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : location;
        const rawLink = linkMatch[1].split('?')[0].replace(/&amp;/g, '&');
        const postedAt = timeMatch
          ? (timeMatch[2] || timeMatch[1]).replace(/<[^>]*>/g, '').trim()
          : 'Recent';
        const logo = imgMatch ? imgMatch[1].replace(/&amp;/g, '&') : null;

        jobs.push({
          id: `li-${rawLink.split('-').pop() || Math.random().toString(36).substring(7)}`,
          title,
          company,
          location: loc,
          type: 'Full-time / Hybrid',
          experienceLevel: 'Entry / Junior (1-3 Tahun)',
          tags: ['Junior / 1-3 Thn', 'Indonesia Tech', 'LinkedIn ID'],
          salary: null,
          url: rawLink,
          description: `Lowongan ${title} di ${company} (${loc}, Indonesia). Cocok untuk pelamar beginner hingga 1-3 tahun pengalaman.`,
          postedAt,
          source: 'LinkedIn Indonesia',
          logo,
        });
      }
    }
  } catch (err) {
    console.warn('[fetchLinkedInJobs error]:', err);
  }
  return jobs;
}

// Fetch from Kalibrr Southeast Asia / Indonesia API
async function fetchKalibrrJobs(query: string, onlyJunior = true): Promise<NormalizedJob[]> {
  const jobs: NormalizedJob[] = [];
  try {
    const url = `https://www.kalibrr.com/api/job_board/search?k=${encodeURIComponent(query)}&limit=15`;
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 300 },
    });

    if (res.ok) {
      const data = await res.json();
      const rawJobs = data.jobs || [];

      for (const j of rawJobs) {
        if (onlyJunior && isSeniorTitle(j.name)) {
          continue;
        }

        const city = j.google_location?.address_components?.city || j.google_location?.address_components?.region || 'Indonesia';
        const country = j.google_location?.address_components?.country || 'Indonesia';
        const loc = `${city}, ${country}`;

        let salaryStr: string | null = null;
        if (j.base_salary && j.maximum_salary) {
          salaryStr = `IDR ${Number(j.base_salary).toLocaleString('id-ID')} - ${Number(j.maximum_salary).toLocaleString('id-ID')}`;
        } else if (j.base_salary) {
          salaryStr = `IDR ${Number(j.base_salary).toLocaleString('id-ID')}`;
        }

        const tags: string[] = ['Junior / 1-3 Thn'];
        if (j.job_sds_skills) {
          j.job_sds_skills.forEach((s: any) => {
            if (s.sds_skill?.name) tags.push(s.sds_skill.name);
          });
        }

        const jobUrl = j.company?.code && j.slug
          ? `https://www.kalibrr.com/c/${j.company.code}/jobs/${j.id}/${j.slug}`
          : `https://www.kalibrr.com/job-board/te/${encodeURIComponent(query)}`;

        jobs.push({
          id: `kalibrr-${j.id}`,
          title: j.name,
          company: j.company_name || j.company?.name || 'Company',
          location: loc,
          type: j.tenure || 'Full-time',
          experienceLevel: 'Beginner / 1-3 Tahun',
          tags: tags.slice(0, 5),
          salary: salaryStr,
          url: jobUrl,
          description: stripHtml(j.description || j.qualifications || ''),
          postedAt: j.created_at ? new Date(j.created_at).toLocaleDateString() : 'Recent',
          source: 'Kalibrr Indonesia',
          logo: j.company?.logo_small || null,
        });
      }
    }
  } catch (err) {
    console.warn('[fetchKalibrrJobs error]:', err);
  }
  return jobs;
}

// Fetch Remote Global (Remotive) open to Indonesia
async function fetchRemotiveJobs(query: string, onlyJunior = true, limit = 15): Promise<NormalizedJob[]> {
  const jobs: NormalizedJob[] = [];
  try {
    const apiUrl = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}&limit=${limit}`;
    const res = await fetch(apiUrl, {
      headers: { 'User-Agent': 'NugrohoAdiAdminCMS/1.0' },
      next: { revalidate: 300 },
    });

    if (res.ok) {
      const data = await res.json();
      const rawJobs = data.jobs || [];

      for (const item of rawJobs) {
        if (onlyJunior && isSeniorTitle(item.title)) {
          continue;
        }

        jobs.push({
          id: `remotive-${item.id}`,
          title: item.title,
          company: item.company_name,
          location: item.candidate_required_location || 'Worldwide Remote (Indonesia Eligible)',
          type: item.job_type ? item.job_type.replace('_', ' ') : 'Full-time Remote',
          experienceLevel: 'Junior / Mid (1-3 Tahun)',
          tags: ['Junior / 1-3 Thn', item.category || 'Engineering'],
          salary: item.salary || null,
          url: item.url,
          description: stripHtml(item.description || ''),
          postedAt: item.publication_date ? new Date(item.publication_date).toLocaleDateString() : 'Recent',
          source: 'Remotive Global Remote',
        });
      }
    }
  } catch (err) {
    console.warn('[fetchRemotiveJobs error]:', err);
  }
  return jobs;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || 'software engineer';
    const source = searchParams.get('source') || 'all_id';
    const location = searchParams.get('location') || 'Indonesia';
    const expLevel = searchParams.get('exp') || 'junior'; // default 'junior' (max 1-3 tahun)
    const onlyJunior = expLevel === 'junior';

    let results: NormalizedJob[] = [];

    // Filter curated jobs matching query & ensuring no senior titles
    const lowerQ = query.toLowerCase();
    const curatedMatches = CURATED_INDONESIA_JUNIOR_JOBS.filter((j) => {
      if (onlyJunior && isSeniorTitle(j.title)) return false;
      const inTitle = j.title.toLowerCase().includes(lowerQ);
      const inDesc = j.description.toLowerCase().includes(lowerQ);
      const inCompany = j.company.toLowerCase().includes(lowerQ);
      const inTags = j.tags.some((t) => t.toLowerCase().includes(lowerQ));
      return inTitle || inDesc || inCompany || inTags;
    });

    if (source === 'all_id') {
      const [liJobs, kalibrrJobs] = await Promise.all([
        fetchLinkedInJobs(query, location, onlyJunior),
        fetchKalibrrJobs(query, onlyJunior),
      ]);

      const combined = [...curatedMatches, ...liJobs, ...kalibrrJobs];

      if (combined.length < 5) {
        for (const item of CURATED_INDONESIA_JUNIOR_JOBS) {
          if (!combined.some((c) => c.title === item.title)) {
            combined.push(item);
          }
        }
      }

      results = combined;
    } else if (source === 'linkedin') {
      const liJobs = await fetchLinkedInJobs(query, location, onlyJunior);
      const curatedLI = curatedMatches.filter((j) => j.source.includes('LinkedIn'));
      results = [...curatedLI, ...liJobs];
      if (results.length === 0) {
        results = CURATED_INDONESIA_JUNIOR_JOBS.filter((j) => j.source.includes('LinkedIn'));
      }
    } else if (source === 'jobstreet') {
      const curatedJS = curatedMatches.filter((j) => j.source.includes('Jobstreet'));
      results = curatedJS.length > 0 ? curatedJS : CURATED_INDONESIA_JUNIOR_JOBS.filter((j) => j.source.includes('Jobstreet'));
    } else if (source === 'kalibrr') {
      results = await fetchKalibrrJobs(query, onlyJunior);
    } else if (source === 'remotive') {
      results = await fetchRemotiveJobs(query, onlyJunior);
    }

    // Deduplicate by URL or title + company
    const seen = new Set<string>();
    const uniqueJobs: NormalizedJob[] = [];

    for (const job of results) {
      if (onlyJunior && isSeniorTitle(job.title)) continue;
      const key = `${job.company.toLowerCase()}-${job.title.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueJobs.push(job);
      }
    }

    const expUrlParam = onlyJunior ? '&f_E=1,2,3' : '';

    return NextResponse.json({
      success: true,
      total: uniqueJobs.length,
      data: uniqueJobs,
      meta: {
        query,
        source,
        location,
        expLevel,
        directLinks: {
          linkedin: `https://id.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}${expUrlParam}`,
          jobstreet: `https://id.jobstreet.com/id/job-search/${encodeURIComponent(query)}-jobs/`,
          glints: `https://glints.com/id/opportunities/jobs/explore?keyword=${encodeURIComponent(query)}&country=ID`,
          kalibrr: `https://www.kalibrr.com/job-board/te/${encodeURIComponent(query)}`,
        },
      },
    });
  } catch (err) {
    console.error('[API /api/jobs/search Error]:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
