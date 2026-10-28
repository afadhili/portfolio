export type TimelineEntry = {
  id: string
  title: string
  location: string
  summary: string
  date?: string
  details: readonly string[]
}

export const timeline: readonly TimelineEntry[] = [
  {
    id: 'highschool',
    title: 'SMK Semen Gresik',
    location: 'Indonesia - Gresik',
    summary: 'Rekayasa Perangkat Lunak',
    details: ['student council members', 'Intern for 6 months'],
  },
  {
    id: 'university',
    title: 'Universitas Muhammadiyah Gresik',
    location: 'Indonesia - Gresik',
    summary: 'Informatics Enginering',
    details: ['TOEFL certificate'],
  },
]
