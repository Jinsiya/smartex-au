
import React from 'react';
import { SubjectCard } from '../types';

interface SubjectDetailProps {
  subject: SubjectCard;
  onBack: () => void;
}

const SubjectDetail: React.FC<SubjectDetailProps> = ({ subject, onBack }) => {
  return (
    <div className="p-6 lg:p-12 max-w-5xl mx-auto animate-fadeIn">
      <button 
        onClick={onBack}
        className="flex items-center gap-3 text-slate-400 hover:text-blue-600 mb-10 transition-all font-bold text-xs uppercase tracking-widest group"
      >
        <div className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
          <i className="fas fa-arrow-left"></i>
        </div>
        Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em]">UNIT 0{subject.unit}</span>
                  <span className="w-1.5 h-1.5 bg-blue-300 rounded-full"></span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Exam Focused</span>
                </div>
                <h1 className="text-4xl font-black mb-4 tracking-tight">{subject.title}</h1>
                <p className="text-blue-100/80 text-lg font-medium leading-relaxed">{subject.description}</p>
              </div>
            </div>

            <div className="p-10">
              <div className="flex items-center gap-2 mb-6">
                <i className="fas fa-file-invoice text-blue-600"></i>
                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Master Summary</h2>
              </div>
              <div className="text-slate-600 leading-[1.8] text-[16px] whitespace-pre-wrap font-medium">
                {subject.summary}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-2">
                 <i className="fas fa-diagram-project text-blue-600"></i>
                 <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Engineering Logic</h2>
               </div>
               <div className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black border border-green-100 uppercase tracking-widest">Verified Layout</div>
            </div>
            <div className="aspect-video bg-slate-50 rounded-[1.5rem] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <i className="fas fa-microchip text-6xl text-slate-200 mb-4 group-hover:scale-110 group-hover:text-blue-200 transition-all duration-500"></i>
              <p className="text-slate-800 font-bold text-lg tracking-tight mb-1">{subject.diagramTitle}</p>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Academic Schematic Visualization</p>
              <button className="mt-6 px-5 py-2.5 bg-white shadow-md rounded-full text-[10px] font-black text-slate-600 border border-slate-100 uppercase tracking-widest hover:bg-slate-50 transition-colors">
                Download Diagram
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0f172a] rounded-[2rem] p-8 text-white shadow-xl shadow-slate-200">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
              <i className="fas fa-lightbulb text-yellow-400"></i>
              Quick Questions
            </h3>
            <ul className="space-y-4">
              {subject.suggestedQuestions?.map((q, i) => (
                <li key={i} className="group cursor-pointer">
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 hover:border-blue-500 hover:bg-slate-800 transition-all">
                    <p className="text-sm font-medium text-slate-300 group-hover:text-white mb-2">{q}</p>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1">
                      View Answer <i className="fas fa-chevron-right text-[8px] mt-0.5"></i>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <i className="fas fa-wand-magic-sparkles text-sm"></i>
              </div>
              <h3 className="text-lg font-bold">Ask Anna AI</h3>
            </div>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed font-medium">Need more clarity on this specific topic? Chat with our AI tutor grounded in these exact notes.</p>
            <button className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-blue-50 transition-colors">
              Launch Tutor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetail;
