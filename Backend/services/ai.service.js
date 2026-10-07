import OpenAI from 'openai'
import config from '../config/config.js'
import z from "zod"
import zodToJsonSchema from 'zod-to-json-schema'
import { zodTextFormat } from "openai/helpers/zod";
import puppeteer from "puppeteer"

const model = new OpenAI({ apiKey: config.OPENAI_API_KEY })


export const interviewReportSchema = z.object({
    title: z.string().describe("The title of the job for which the interview report is generated"),
    matchScore: z.number().min(0).max(100).describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behaviour question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),



})

export async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    const prompt = `Generate an interview report for a candidate with the following details: Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}`

    const response = await model.responses.parse({
        model: 'gpt-5.6-luna',
        input: prompt,
        text: {
            format: zodTextFormat(interviewReportSchema,
                "interview_report")
        }
    })
    return response.output_parsed
}

export async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
        ],
    })

    try {
        const page = await browser.newPage()
        await page.setContent(htmlContent, { waitUntil: "networkidle0" })
        const pdfBuffer = await page.pdf({
            format: "A4",
            margin: {
                top: "12mm",
                bottom: "12mm",
                left: "14mm",
                right: "14mm"
            }
        })
        await page.close()
        return pdfBuffer
    } finally {
        await browser.close()
    }

}

export async function generateResumePdfInHtml({ resume, selfDescription, jobDescription }) {

    const resumeSchema = z.object({
        candidateName: z.string().describe(
            "The candidate's actual full name exactly as provided in the resume"
        ),
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `
Generate a professional, ATS-friendly resume for the candidate using the
following information.

========================================
RESUME
========================================

${resume}

========================================
SELF DESCRIPTION
========================================

${selfDescription}

========================================
JOB DESCRIPTION
========================================

${jobDescription}


========================================
IMPORTANT CANDIDATE NAME RULE
========================================

The candidate's name is extremely important.

Extract the candidate's EXACT full name from the Resume.

The candidate's exact name MUST:

- Be returned in the "candidateName" field.
- Appear prominently at the TOP of the generated HTML resume.
- Be written exactly as it appears in the Resume.
- NOT be shortened.
- NOT be modified.
- NOT be replaced with a placeholder.
- NOT be invented.

For example, if the Resume says:

Parag Pal

then the generated HTML MUST contain:

<h1>Parag Pal</h1>

Do NOT use:

[Your Name]
Candidate Name
John Doe
Your Name

If the name cannot be confidently identified from the Resume, do not invent one.


========================================
RESUME GENERATION RULES
========================================

Use the Resume as the primary source of truth for:

- Candidate name
- Contact details
- Education
- Skills
- Experience
- Projects
- Certifications
- Other background information

Preserve the original meaning and facts while improving:

- Grammar
- Clarity
- Structure
- Professional wording

Highlight the candidate's most relevant:

- Skills
- Projects
- Experience
- Strengths

based on the Job Description.

Use relevant keywords from the Job Description naturally, but ONLY when
they are supported by the candidate's provided information.

DO NOT invent or assume any information, including:

- Experience
- Companies
- Job titles
- Technologies
- Certifications
- Achievements
- Metrics
- Qualifications

If information is unavailable, omit it.

NEVER use placeholders such as:

[Your Name]
[Email]
[Phone Number]
[University Name]


========================================
RESUME QUALITY
========================================

The resume should:

- Sound natural and human-written.
- Be concise and professional.
- Clearly display the candidate's actual name.
- Clearly display the candidate's actual contact information.
- Use strong and clear bullet points.
- Focus on relevant technical skills and accomplishments.
- Avoid unnecessary repetition.
- Avoid generic filler.
- Ideally fit within 1-2 A4 pages.
- Be easy for ATS systems to parse.


========================================
HTML REQUIREMENTS
========================================

Generate clean, modern HTML with embedded CSS suitable for conversion to PDF
using Puppeteer.

Use standard HTML elements such as:

- h1
- h2
- h3
- p
- ul
- li
- section

Keep the design:

- Professional
- Simple
- Readable
- ATS-friendly

Avoid:

- Complex layouts
- Excessive graphics
- Tables
- Unnecessary icons
- Styling that could interfere with ATS parsing

The candidate's name MUST be the most prominent text at the top of the resume.


========================================
OUTPUT
========================================

Return exactly two fields:

1. "candidateName"
2. "html"

The "candidateName" field must contain the candidate's exact name.

The "html" field must contain the complete HTML and CSS for the resume.

Do not include Markdown.

Do not use code fences.

Do not include explanations outside the structured response.
`;

    const response = await model.responses.parse({
        model: 'gpt-5.6-luna',
        input: prompt,
        text: {
            format: zodTextFormat(resumeSchema,
                "resume_schema")
        }
    })


    const jsonContent = response.output_parsed

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer
}