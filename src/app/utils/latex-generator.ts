import { Resume } from "../models/resume.models";

/**
 * Generates a valid LaTeX source string from the Resume object.
 * Uses strict escaping for special characters.
 */
export function generateLatex(resume: Resume): string {
  const { profile, experience, education, projects, skills } = resume;

  // Helper to escape LaTeX special characters
  const escape = (str: string = ''): string => {
    return str
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .replace(/\$/g, '\\$')
      .replace(/&/g, '\\&')
      .replace(/#/g, '\\#')
      .replace(/\^/g, '\\textasciicircum{}')
      .replace(/_/g, '\\_')
      .replace(/~/g, '\\textasciitilde{}')
      .replace(/%/g, '\\%');
  };

  // Convert HTML-like newlines to LaTeX line breaks
  const formatNewlines = (str: string = ''): string => {
    return escape(str).replace(/\\n/g, '\\\\ ');
  };

  // Split duties/bullets
  const formatBullets = (str: string = ''): string => {
     const items = str.split('\\n').filter(s => s.trim().length > 0);
     if (items.length === 0) return '';
     return '\\begin{itemize}\n' + items.map(i => `  \\item ${escape(i)}`).join('\n') + '\n\\end{itemize}';
  };

  return `
\\documentclass[a4paper,10pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[spanish]{babel}
\\usepackage[margin=2cm]{geometry}
\\usepackage{hyperref}
\\usepackage{xcolor}
\\usepackage{enumitem}
\\usepackage{titlesec}

% Minimalistic styling
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\titleformat{\\section}{\\large\\bfseries\\uppercase}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{12pt}{6pt}

\\begin{document}

% --- HEADER ---
\\begin{center}
    {\\Huge \\textbf{${escape(profile.fullName)}}} \\\\[0.2cm]
    \\small
    ${[
      profile.location,
      profile.email,
      profile.phone,
      profile.linkedin,
      profile.github
    ].filter(Boolean).map(escape).join(' $\\bullet$ ')}
\\end{center}

% --- SUMMARY ---
${profile.summary ? `
\\begin{center}
  \\begin{minipage}{0.9\\textwidth}
    \\centering \\itshape ${escape(profile.summary)}
  \\end{minipage}
\\end{center}
` : ''}

% --- EXPERIENCE ---
${experience.length > 0 ? `
\\section*{Experiencia Laboral}
${experience.map(exp => `
\\noindent 
\\textbf{${escape(exp.company)}} \\hfill \\textbf{${escape(exp.startDate)} -- ${exp.current ? 'Presente' : escape(exp.endDate)}} \\\\
\\textit{${escape(exp.role)}} \\hfill \\textit{${escape(exp.location)}}
${formatBullets(exp.duties)}
\\vspace{0.2cm}
`).join('\n')}
` : ''}

% --- PROJECTS ---
${projects.length > 0 ? `
\\section*{Proyectos Destacados}
${projects.map(proj => `
\\noindent
\\textbf{${escape(proj.name)}} \\hfill \\textit{${escape(proj.stack)}} \\\\
\\textit{${escape(proj.role)}} ${proj.link ? `\\hfill \\href{${proj.link}}{LINK}` : ''} \\\\
${escape(proj.description)}
${proj.keywords ? `\\\\ \\textbf{Keywords:} ${escape(proj.keywords)}` : ''}
\\vspace{0.2cm}
`).join('\n')}
` : ''}

% --- EDUCATION ---
${education.length > 0 ? `
\\section*{Educación}
${education.map(edu => `
\\noindent
\\textbf{${escape(edu.institution)}} \\hfill \\textbf{${escape(edu.graduationDate)}} \\\\
\\textit{${escape(edu.degree)}} \\hfill \\textit{${escape(edu.location)}}
\\vspace{0.2cm}
`).join('\n')}
` : ''}

% --- SKILLS ---
${skills.length > 0 ? `
\\section*{Habilidades Técnicas}
${skills.map(escape).join(', ')}
` : ''}

\\end{document}
  `.trim();
}
