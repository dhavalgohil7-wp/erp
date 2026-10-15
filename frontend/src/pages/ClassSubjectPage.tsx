import { useState } from 'react'
import PageWrapper from '../components/ui/PageWrapper'

const classes = [
  { id: 1, name: 'Nursery', sections: ['A','B'],   subjects: 6, students: 80,  stream: '' },
  { id: 2, name: 'Class 1', sections: ['A','B','C'], subjects: 8, students: 120, stream: '' },
  { id: 3, name: 'Class 8', sections: ['A','B','C'], subjects: 10, students: 160, stream: '' },
  { id: 4, name: 'Class 11', sections: ['A','B'],  subjects: 12, students: 90,  stream: 'Science / Commerce / Arts' },
  { id: 5, name: 'Class 12', sections: ['A','B'],  subjects: 12, students: 85,  stream: 'Science / Commerce / Arts' },
]

const subjects = [
  { id: 1, name: 'Mathematics',   code: 'MATH', type: 'Theory', classes: 'Class 1-12', teacher: 'Mr. Raj Kumar' },
  { id: 2, name: 'Physics',       code: 'PHY',  type: 'Theory + Practical', classes: 'Class 9-12', teacher: 'Mr. Marcus Vance' },
  { id: 3, name: 'English',       code: 'ENG',  type: 'Theory', classes: 'Nursery-12', teacher: 'Ms. Anita Desai' },
  { id: 4, name: 'Chemistry',     code: 'CHEM', type: 'Theory + Practical', classes: 'Class 9-12', teacher: 'Ms. Priya Sharma' },
  { id: 5, name: 'Computer Science', code: 'CS', type: 'Theory + Practical', classes: 'Class 6-12', teacher: 'Mr. Sandeep Roy' },
]

export default function ClassSubjectPage() {
  const [tab, setTab] = useState('classes')

  return (
    <PageWrapper breadcrumb={['Dashboard', 'Class & Subject Management']}>
      <div className="flex flex-col gap-space-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-headline-md text-on-surface">Class & Subject Management</h1>
            <p className="text-body-md text-on-surface-variant">Configure classes, sections, streams and subject mappings</p>
          </div>
          <button className="btn-primary">
            <i className="fa-solid fa-plus text-[15px]"></i>
            Add {tab === 'classes' ? 'Class' : 'Subject'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface-container-low p-1 rounded-lg w-fit">
          {[['classes','Classes & Sections'],['subjects','Subjects']].map(([key,label]) => (
            <button key={key} onClick={()=>setTab(key)}
              className={`px-4 py-1.5 rounded text-label-md font-semibold transition-colors ${tab===key?'bg-surface-container-lowest text-on-surface shadow-sm':'text-secondary hover:text-on-surface'}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'classes' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md stagger animate-fade-in">
            {classes.map(c => (
              <div key={c.id} className="card p-space-md hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-primary-fixed/40 flex items-center justify-center">
                      <i className="fa-solid fa-chalkboard-user text-[18px] text-primary"></i>
                    </div>
                    <h3 className="text-headline-sm text-on-surface">{c.name}</h3>
                  </div>
                  <span className="text-body-sm text-secondary">{c.students} students</span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-body-sm">
                    <span className="text-on-surface-variant">Sections</span>
                    <div className="flex gap-1">
                      {c.sections.map(s=>(
                        <span key={s} className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-semibold text-label-sm">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-body-sm">
                    <span className="text-on-surface-variant">Subjects</span>
                    <span className="text-on-surface font-semibold">{c.subjects}</span>
                  </div>
                  {c.stream && (
                    <div className="text-body-sm text-secondary bg-surface-container-low rounded p-2">{c.stream}</div>
                  )}
                </div>
                <div className="flex gap-2 pt-3 border-t border-surface-container">
                  <button className="btn-secondary flex-1 justify-center text-xs">
                    <i className="fa-solid fa-plus text-[13px]"></i> Section
                  </button>
                  <button className="btn-ghost px-2 py-1.5" title="Edit">
                    <i className="fa-solid fa-pen-to-square text-[14px]"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-container-low">
                    {['Code','Subject','Type','Classes','Teacher','Actions'].map(h=>(
                      <th key={h} className="text-left px-4 py-3 text-label-md text-on-surface-variant font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {subjects.map(s=>(
                    <tr key={s.id} className="table-row-hover border-t border-surface-container">
                      <td className="px-4 py-3 text-body-sm font-mono text-secondary">{s.code}</td>
                      <td className="px-4 py-3 text-body-sm font-semibold text-on-surface">{s.name}</td>
                      <td className="px-4 py-3">
                        <span className="badge-status bg-primary-fixed/40 text-primary">{s.type}</span>
                      </td>
                      <td className="px-4 py-3 text-body-sm text-on-surface-variant">{s.classes}</td>
                      <td className="px-4 py-3 text-body-sm text-on-surface-variant">{s.teacher}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors">
                            <i className="fa-solid fa-pen-to-square text-[14px]"></i>
                          </button>
                          <button className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-error transition-colors">
                            <i className="fa-solid fa-trash-can text-[14px]"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
