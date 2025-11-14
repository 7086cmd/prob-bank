import type { Paper, Element, PromptElement } from '@/../@types/paper'
import type {
  AllProblem,
  SingleChoiceProblem,
  MultipleChoiceProblem,
  BlankProblem,
  AnswerProblem,
  JudgeProblem,
} from '@/../@types/problem'
import type { ProblemGroup } from '@/../@types/problem-group'
import type { Content } from '@/../@types/content'
import dayjs from 'dayjs'

/**
 * LaTeX Export Service for Papers
 * Converts paper data to LaTeX format for academic publishing
 */
export class LatexExportService {
  private paper: Paper
  private problemCounter: number = 0
  private includeAnswers: boolean = false

  constructor(paper: Paper, includeAnswers: boolean = false) {
    this.paper = paper
    this.includeAnswers = includeAnswers
  }

  /**
   * Escape special LaTeX characters
   */
  private escapeLatex(text: string): string {
    return text
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/[&%$#_{}]/g, '\\$&')
      .replace(/~/g, '\\textasciitilde{}')
      .replace(/\^/g, '\\textasciicircum{}')
  }

  /**
   * Convert content array to LaTeX
   */
  private contentToLatex(content: Content[]): string {
    let latex = ''

    for (const item of content) {
      switch (item.type) {
        case 'text':
          latex += this.escapeLatex(item.content)
          break

        case 'textarea':
          latex += `\n\\begin{verbatim}\n${item.content}\n\\end{verbatim}\n`
          break

        case 'formula':
          // Handle inline formulas
          latex += `$${item.content}$`
          break

        case 'image':
          // Handle images
          latex += `\n\\begin{figure}[h]\n\\centering\n\\includegraphics[width=0.6\\textwidth]{${item.src}}\n\\end{figure}\n`
          break

        case 'table':
          // Convert table to LaTeX format
          latex += this.tableToLatex(item.content)
          break

        case 'blank':
          // Represent blanks as underlined spaces
          latex += '\\underline{\\hspace{3cm}}'
          break

        case 'divider':
          latex += '\n\\vspace{1em}\\hrule\\vspace{1em}\n'
          break

        default:
          // For other content types, add a note
          latex += `\\textit{[${item.type}]}`
          break
      }
    }

    return latex
  }

  /**
   * Convert table content to LaTeX
   */
  private tableToLatex(table: string[][]): string {
    if (!table || table.length === 0) return ''

    const cols = table[0].length
    const colSpec = 'l'.repeat(cols)

    let latex = `\n\\begin{tabular}{|${colSpec.split('').join('|')}|}\n\\hline\n`

    for (let i = 0; i < table.length; i++) {
      const row = table[i].map((cell) => this.escapeLatex(cell)).join(' & ')
      latex += row + ' \\\\\n\\hline\n'
    }

    latex += '\\end{tabular}\n'
    return latex
  }

  /**
   * Convert single choice problem to LaTeX
   */
  private singleChoiceToLatex(problem: SingleChoiceProblem, order: number): string {
    let latex = `\\item ${this.contentToLatex(problem.content)}\n\n`

    if (problem.image) {
      latex += `\\begin{figure}[h]\n\\centering\n\\includegraphics[width=0.5\\textwidth]{${problem.image}}\n\\end{figure}\n\n`
    }

    latex += '\\begin{enumerate}[label=(\\Alph*)]\n'
    const choices = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    for (const option of problem.options) {
      latex += `\\item ${this.contentToLatex(option.content)}\n`
    }

    latex += '\\end{enumerate}\n\n'

    if (this.includeAnswers) {
      const answerLetter = choices[problem.answer]
      latex += `\\textbf{答案：} ${answerLetter}\n\n`

      if (problem.details.analytical) {
        latex += `\\textbf{解析：} ${this.escapeLatex(problem.details.analytical)}\n\n`
      }
    }

    return latex
  }

  /**
   * Convert multiple choice problem to LaTeX
   */
  private multipleChoiceToLatex(problem: MultipleChoiceProblem, order: number): string {
    let latex = `\\item （多选）${this.contentToLatex(problem.content)}\n\n`

    if (problem.image) {
      latex += `\\begin{figure}[h]\n\\centering\n\\includegraphics[width=0.5\\textwidth]{${problem.image}}\n\\end{figure}\n\n`
    }

    latex += '\\begin{enumerate}[label=(\\Alph*)]\n'
    const choices = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    for (const option of problem.options) {
      latex += `\\item ${this.contentToLatex(option.content)}\n`
    }

    latex += '\\end{enumerate}\n\n'

    if (this.includeAnswers) {
      const answerLetters = problem.answer.map((idx) => choices[idx]).join(', ')
      latex += `\\textbf{答案：} ${answerLetters}\n\n`

      if (problem.details.analytical) {
        latex += `\\textbf{解析：} ${this.escapeLatex(problem.details.analytical)}\n\n`
      }
    }

    return latex
  }

  /**
   * Convert judge problem to LaTeX
   */
  private judgeToLatex(problem: JudgeProblem, order: number): string {
    let latex = `\\item ${this.contentToLatex(problem.content)}\n\n`

    if (problem.image) {
      latex += `\\begin{figure}[h]\n\\centering\n\\includegraphics[width=0.5\\textwidth]{${problem.image}}\n\\end{figure}\n\n`
    }

    if (this.includeAnswers) {
      latex += `\\textbf{答案：} ${problem.answer ? '正确' : '错误'}\n\n`

      if (problem.details.analytical) {
        latex += `\\textbf{解析：} ${this.escapeLatex(problem.details.analytical)}\n\n`
      }
    }

    return latex
  }

  /**
   * Convert blank problem to LaTeX
   */
  private blankToLatex(problem: BlankProblem, order: number): string {
    let latex = `\\item ${this.contentToLatex(problem.content)}\n\n`

    if (problem.image) {
      latex += `\\begin{figure}[h]\n\\centering\n\\includegraphics[width=0.5\\textwidth]{${problem.image}}\n\\end{figure}\n\n`
    }

    // Handle sub-problems
    if (problem.subProblems && problem.subProblems.length > 0) {
      latex += '\\begin{enumerate}[label=(\\arabic*)]\n'
      for (const subProblem of problem.subProblems) {
        latex += this.problemToLatex(subProblem.problem, subProblem.id)
      }
      latex += '\\end{enumerate}\n\n'
    }

    if (this.includeAnswers && problem.details.analytical) {
      latex += `\\textbf{解析：} ${this.escapeLatex(problem.details.analytical)}\n\n`
    }

    return latex
  }

  /**
   * Convert answer problem to LaTeX
   */
  private answerToLatex(problem: AnswerProblem, order: number): string {
    let latex = `\\item ${this.contentToLatex(problem.content)}\n\n`

    if (problem.image) {
      latex += `\\begin{figure}[h]\n\\centering\n\\includegraphics[width=0.5\\textwidth]{${problem.image}}\n\\end{figure}\n\n`
    }

    // Handle sub-problems
    if (problem.subProblems && problem.subProblems.length > 0) {
      latex += '\\begin{enumerate}[label=(\\arabic*)]\n'
      for (const subProblem of problem.subProblems) {
        latex += this.problemToLatex(subProblem.problem, subProblem.id)
      }
      latex += '\\end{enumerate}\n\n'
    }

    if (this.includeAnswers) {
      latex += `\\textbf{答案：} ${this.contentToLatex(problem.answer)}\n\n`

      if (problem.details.procedure && problem.details.procedure.length > 0) {
        latex += `\\textbf{解答过程：}\n${this.contentToLatex(problem.details.procedure)}\n\n`
      }

      if (problem.details.analytical) {
        latex += `\\textbf{解析：} ${this.escapeLatex(problem.details.analytical)}\n\n`
      }
    }

    return latex
  }

  /**
   * Convert problem to LaTeX based on type
   */
  private problemToLatex(problem: AllProblem, order: number): string {
    this.problemCounter++

    switch (problem.type) {
      case 'single-choice':
        return this.singleChoiceToLatex(problem as SingleChoiceProblem, order)

      case 'multiple-choice':
        return this.multipleChoiceToLatex(problem as MultipleChoiceProblem, order)

      case 'judge':
        return this.judgeToLatex(problem as JudgeProblem, order)

      case 'blank':
        return this.blankToLatex(problem as BlankProblem, order)

      case 'answer':
        return this.answerToLatex(problem as AnswerProblem, order)

      default:
        return `\\item [未知题型]\n\n`
    }
  }

  /**
   * Convert problem group to LaTeX
   */
  private problemGroupToLatex(group: ProblemGroup): string {
    let latex = ''

    // Add prompts/materials
    if (group.prompts && group.prompts.length > 0) {
      latex += '\\textbf{材料：}\n\n'
      latex += this.contentToLatex(group.prompts)
      latex += '\n\n'
    }

    // Add problems
    latex += '\\begin{enumerate}[resume]\n'
    for (const problem of group.problems) {
      latex += this.problemToLatex(problem, this.problemCounter + 1)
    }
    latex += '\\end{enumerate}\n\n'

    return latex
  }

  /**
   * Convert prompt element to LaTeX
   */
  private promptToLatex(prompt: PromptElement): string {
    let latex = '\\section*{'

    // Add description
    if (prompt.description && prompt.description.length > 0) {
      latex += this.contentToLatex(prompt.description)
    }

    latex += '}\n\n'

    // Add problem count and score info
    if (prompt.problemsCount) {
      latex += `共${prompt.problemsCount}题`
      if (prompt.score && prompt.score.length > 0) {
        const scoreInfo = prompt.score.map((s, i) => `第${i + 1}题${s}分`).join('，')
        latex += `，${scoreInfo}`
      }
      latex += '\n\n'
    }

    return latex
  }

  /**
   * Generate complete LaTeX document
   */
  public generateLatex(): string {
    const { metadata } = this.paper
    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss')

    let latex = `% LaTeX Export from Problem Bank
% Generated: ${timestamp}
% Paper: ${metadata.name}

\\documentclass[12pt,a4paper]{article}

% Packages
\\usepackage{ctex}          % Chinese support
\\usepackage{amsmath}       % Math support
\\usepackage{amssymb}       % Math symbols
\\usepackage{graphicx}      % Images
\\usepackage{enumerate}     % Custom enumerate
\\usepackage{enumitem}      % Enhanced list environments
\\usepackage{geometry}      % Page layout
\\usepackage{fancyhdr}      % Headers and footers
\\usepackage{booktabs}      % Better tables
\\usepackage{mhchem}        % Chemistry formulas

% Page setup
\\geometry{left=2.5cm,right=2.5cm,top=2.5cm,bottom=2.5cm}

% Header and footer
\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[L]{${this.escapeLatex(metadata.name)}}
\\fancyhead[R]{${this.escapeLatex(metadata.subject)}}
\\fancyfoot[C]{\\thepage}

\\begin{document}

% Title
\\begin{center}
{\\Huge\\bfseries ${this.escapeLatex(metadata.name)}}\\\\[1em]
{\\large 学科：${this.escapeLatex(metadata.subject)} \\quad 年级：${metadata.level[0]}-${metadata.level[1]}}\\\\[1em]
\\hrule
\\end{center}

\\vspace{1em}

`

    // Process elements
    latex += '\\begin{enumerate}\n'

    for (const element of this.paper.elements) {
      switch (element.type) {
        case 'problem':
          latex += this.problemToLatex(element.content, this.problemCounter + 1)
          break

        case 'problem-group':
          latex += this.problemGroupToLatex(element.content)
          break

        case 'prompt':
          latex += '\\end{enumerate}\n\n'
          latex += this.promptToLatex(element as PromptElement)
          latex += '\\begin{enumerate}[resume]\n'
          break

        case 'divider':
          latex += '\\end{enumerate}\n\\vspace{1em}\\hrule\\vspace{1em}\\begin{enumerate}[resume]\n'
          break

        default:
          // Handle index types by noting they should be resolved first
          if (element.type === 'problem-index' || element.type === 'problem-group-index') {
            latex += `\\item [Error: Unresolved ${element.type} with ID ${element._id}]\n\n`
          }
          break
      }
    }

    latex += '\\end{enumerate}\n\n'

    // Add answer section if needed
    if (this.includeAnswers) {
      latex += `\\newpage
\\section*{答案与解析}
答案与解析已包含在题目中。

`
    }

    latex += '\\end{document}\n'

    return latex
  }

  /**
   * Export LaTeX to file
   */
  public async exportToFile(): Promise<void> {
    const latex = this.generateLatex()
    const blob = new Blob([latex], { type: 'text/plain;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const filename = `${this.paper.metadata.name} - ${dayjs().format('YYYY-MM-DD-HHmmss')}.tex`
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }
}

/**
 * Helper function to export paper to LaTeX
 */
export async function exportPaperToLatex(
  paper: Paper,
  includeAnswers: boolean = false
): Promise<void> {
  const service = new LatexExportService(paper, includeAnswers)
  await service.exportToFile()
}
