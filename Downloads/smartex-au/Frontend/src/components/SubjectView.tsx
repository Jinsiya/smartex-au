
import React, { useState, useEffect } from 'react';
import { Subject, Resource } from '../types';

interface SubjectViewProps {
  subject: Subject;
  onBack: () => void;
}

const SubjectView: React.FC<SubjectViewProps> = ({ subject, onBack }) => {
  const [activeTab, setActiveTab] = useState<'papers' | 'notes' | 'questions'>('notes');
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('smartex_cache') || '[]');
    if (!history.includes(subject.id)) {
      const newHistory = [subject.id, ...history].slice(0, 10);
      localStorage.setItem('smartex_cache', JSON.stringify(newHistory));
    }
  }, [subject.id]);

  const handleResourceAction = (res: Resource) => {
    if (res.content) {
      setViewingResource(res);
    } else if (res.url && res.url !== '#') {
      window.open(res.url, '_blank');
    }
  };

  return (
    <div className="animate-slide-up relative">
      {/* Resource Modal */}
      {viewingResource && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl h-[80vh] rounded-[2.5rem] flex flex-col shadow-2xl animate-slide-up overflow-hidden">
            <div className="p-6 bg-[#003366] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <i className="fas fa-file-alt"></i>
                <h3 className="font-black tracking-tight">{viewingResource.name}</h3>
              </div>
              <button 
                onClick={() => setViewingResource(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 lg:p-12 prose max-w-none text-gray-700">
              <div className="whitespace-pre-wrap font-medium leading-relaxed text-sm lg:text-base">
                {viewingResource.content}
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t flex justify-end">
              <button 
                onClick={() => setViewingResource(null)}
                className="px-8 py-3 bg-[#003366] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-800 transition-all"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border-b sticky top-0 z-20">
        <div className="p-4 max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <i className="fas fa-arrow-left text-gray-600"></i>
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-[#003366] leading-tight">{subject.name}</h1>
            <p className="text-xs text-gray-500 font-bold tracking-widest">{subject.code} • SEMESTER {subject.semester}</p>
          </div>
        </div>

        <div className="flex max-w-4xl mx-auto border-t">
          {[
            { id: 'notes', label: 'Study Notes', icon: 'fa-book-open' },
            { id: 'questions', label: 'Important Questions', icon: 'fa-star' },
            { id: 'papers', label: 'Question Papers', icon: 'fa-file-invoice' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                activeTab === tab.id ? 'border-b-2 border-[#003366] text-[#003366]' : 'text-gray-400'
              }`}
            >
              <i className={`fas ${tab.icon}`}></i>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto pb-24">
        {activeTab === 'notes' && (
          <div className="space-y-4">
            {subject.notes.map(note => (
              <div key={note.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#003366] transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${note.type === 'text' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-[#003366]'} rounded-xl flex items-center justify-center`}>
                    <i className={`fas ${note.type === 'text' ? 'fa-file-lines' : 'fa-file-pdf'} text-xl`}></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{note.name}</h3>
                    <p className="text-xs text-gray-400">{note.type === 'text' ? 'Full Textbook Data' : 'PDF Document • 2.4 MB'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleResourceAction(note)}
                  className="bg-gray-50 text-[#003366] px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#003366] hover:text-white transition-all"
                >
                  {note.content ? 'Read Now' : 'View PDF'}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'papers' && (
          <div className="space-y-4">
            {subject.pastPapers.map(paper => (
              <div key={paper.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                    <i className="fas fa-file-lines text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{paper.name}</h3>
                    <p className="text-xs text-gray-400">Anna University Official • {paper.year}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleResourceAction(paper)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <i className="fas fa-download"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="space-y-8">
            {subject.importantQuestions.map((unit) => (
              <div key={unit.unitNumber} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-[#003366] p-4 text-white">
                  <h3 className="font-black text-sm uppercase tracking-widest">Unit {unit.unitNumber}: {unit.title}</h3>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {unit.concepts.map(c => (
                      <span key={c} className="px-3 py-1 bg-blue-50 text-[#003366] rounded-full text-[10px] font-bold border border-blue-100">
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap font-medium">
                    {unit.summary}
                  </div>
                  <div className="mt-8 pt-6 border-t flex items-center justify-between">
                    <button className="text-xs font-black text-[#003366] uppercase tracking-widest flex items-center gap-2">
                      Practice Mock <i className="fas fa-arrow-right text-[10px]"></i>
                    </button>
                    <span className="text-[10px] text-gray-400 italic">Verified by Smartex Team</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectView;
