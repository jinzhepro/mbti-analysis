# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 16.2.1 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI**: react-hot-toast (notifications), html-to-image (share images)
- **Fonts**: Playfair Display + Noto Serif SC (Chinese)

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page with type grid
│   ├── layout.tsx            # Root layout with Toaster
│   ├── globals.css           # Global styles + animations
│   ├── test/page.tsx         # Test page (full 40q / quick 12q)
│   └── result/[type]/
│       ├── page.tsx          # Result page
│       └── scores/page.tsx   # Detailed scores analysis
├── lib/
│   ├── personalities.ts      # 16 personality type data
│   ├── questions.ts          # 40 full test questions
│   ├── quickQuestions.ts     # 12 quick test questions
│   ├── testStore.ts          # Scoring logic
│   ├── testHistory.ts        # LocalStorage history management
│   ├── cognitiveFunctions.ts # Jung cognitive functions
│   └── compatibility.ts      # Type matching algorithm
├── components/
│   ├── Header.tsx
│   ├── PersonalityCard.tsx
│   └── TestQuestion.tsx
└── types/index.ts            # TypeScript interfaces
```

## Key Concepts

### Test Flow
1. User selects test mode (full 40 questions or quick 12 questions)
2. Answers saved to localStorage with progress auto-save
3. Scoring uses 5-point Likert scale per question
4. Results saved to history (max 10 entries)

### Scoring Logic (`testStore.ts`)
- Each question maps to a dimension (EI/SN/TF/JP)
- `direction` determines if question favors first or second letter
- Score distribution: answer 5 = 5pts to favored + 1pt to other
- Type determined by comparing E vs I, S vs N, T vs F, J vs P

### Cognitive Functions (`cognitiveFunctions.ts`)
- Each type has 4 functions: dominant, auxiliary, tertiary, inferior
- Functions: Ni, Ne, Si, Se, Ti, Te, Fi, Fe
- Displayed on result page with position descriptions

### Matching Algorithm (`compatibility.ts`)
- Three relationship types: romantic, friendship, work
- Match levels: best, good, challenging
- Score adjustments based on dimension differences and relationship type

### LocalStorage Keys
- `mbti_test_progress` / `mbti_quick_test_progress` - test progress
- `mbti_test_history` - array of past results

## Design System

- **Theme**: Dark cosmic/mystical (bg: #0a0a1a, accent: amber)
- **Animations**: fade-in-up, twinkle stars background
- **Components**: card-mystical, btn-mystical, btn-outline-mystical classes
- **Colors**: Each type has unique gradient (see `typeColors` records)

## User Preferences

- Output language: Chinese (中文)
- Add function-level comments when generating code
