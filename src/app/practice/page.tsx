'use client';

import { 
  ShieldCheck, MoreHorizontal, Lightbulb, Search, ChevronDown, X, Sparkles, Rocket, Code, Box, Check,
  Menu, Sun, Lock, Terminal, MessageSquare, Edit2, Trash2, EyeOff, Layers, ArrowRight, Zap, CheckCircle2, 
  Bookmark, Edit3, PlayCircle, Star, PlusCircle, Upload, Moon, LineChart
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface PracticeProject {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  tags: string;
  curriculum_link: string;
  views: string;
  completion_rate: number;
  icon_name: string;
  is_hidden: number;
  content?: string;
}

export default function PracticePage() {
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PracticeProject | null>(null);
  const [projects, setProjects] = useState<PracticeProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<PracticeProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Filter States
  const [selectedLevels, setSelectedLevels] = useState<string[]>(['전체']);
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['전체']);
  const [selectedCurriculum, setSelectedCurriculum] = useState('전체 단계');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'level'>('latest');
  const [selectedProject, setSelectedProject] = useState<PracticeProject | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/practice');
      const data = await response.json() as any;
      
      let finalProjects = [];
      if (data.success && data.projects) {
        finalProjects = data.projects;
      }
      
      // Port 3000 / Local Dev Persistence Sync
      if (!data.projects || data.message?.includes('Mock')) {
        const localData = localStorage.getItem('local_practice_projects');
        if (localData) {
          finalProjects = JSON.parse(localData);
        } else if (data.projects) {
          finalProjects = data.projects;
          localStorage.setItem('local_practice_projects', JSON.stringify(finalProjects));
        }
      }

      setProjects(finalProjects);
      setFilteredProjects(finalProjects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      const localData = localStorage.getItem('local_practice_projects');
      if (localData) {
        const lp = JSON.parse(localData);
        setProjects(lp);
        setFilteredProjects(lp);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocalUpdate = (updatedProjects: PracticeProject[]) => {
    setProjects(updatedProjects);
    setFilteredProjects(updatedProjects);
    localStorage.setItem('local_practice_projects', JSON.stringify(updatedProjects));
  };

  useEffect(() => {
    fetchProjects();
    
    // Check Admin
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsAdmin(user.username === 'ljj');
      } catch (e) {}
    }
    setMounted(true);
  }, []);

  // Filtering & Sorting Logic
  useEffect(() => {
    let result = [...projects];

    // Level Filter
    if (!selectedLevels.includes('전체')) {
      result = result.filter(p => selectedLevels.includes(p.level));
    }

    // Category Filter
    if (!selectedCategory.includes('전체')) {
      result = result.filter(p => selectedCategory.includes(p.category));
    }

    // Curriculum Filter
    if (selectedCurriculum !== '전체 단계') {
      result = result.filter(p => p.curriculum_link.includes(selectedCurriculum.replace(' 단계', '')));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'latest') {
        return b.id.localeCompare(a.id); // Assuming higher ID is later
      } else if (sortBy === 'popular') {
        const parseViews = (v: string) => parseFloat(v.replace('K', '')) * (v.includes('K') ? 1000 : 1);
        return parseViews(b.views) - parseViews(a.views);
      } else if (sortBy === 'level') {
        const levelMap: Record<string, number> = { '입문': 1, '기초': 2, '실전': 3, '심화': 4 };
        return levelMap[a.level] - levelMap[b.level];
      }
      return 0;
    });

    setFilteredProjects(result);
  }, [projects, selectedLevels, selectedCategory, selectedCurriculum, sortBy]);

  const toggleLevel = (level: string) => {
    if (level === '전체') {
      setSelectedLevels(['전체']);
      return;
    }
    const newLevels = selectedLevels.filter(l => l !== '전체');
    if (newLevels.includes(level)) {
      const filtered = newLevels.filter(l => l !== level);
      setSelectedLevels(filtered.length === 0 ? ['전체'] : filtered);
    } else {
      setSelectedLevels([...newLevels, level]);
    }
  };

  const toggleCategory = (cat: string) => {
    if (cat === '전체') {
      setSelectedCategory(['전체']);
      return;
    }
    const newCats = selectedCategory.filter(c => c !== '전체');
    if (newCats.includes(cat)) {
      const filtered = newCats.filter(c => c !== cat);
      setSelectedCategory(filtered.length === 0 ? ['전체'] : filtered);
    } else {
      setSelectedCategory([...newCats, cat]);
    }
  };

  if (!mounted) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans transition-colors">

      {/* --- Header Area --- */}
      <header className="relative bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white py-16 transition-colors border-b border-slate-200 dark:border-white/5 text-left overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-10 relative z-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
              <Zap size={14} className="animate-pulse" /> Interactive Learning
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">기능 실습</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed text-base font-medium">
              작은 기능부터 직접 만들어보며 실력을 쌓아보세요.<br />
              실전에서 자주 사용하는 기능들을 단계별로 구현해보고<br />
              코딩 감각을 익히고 응용력을 키워보세요.
            </p>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setIsIdeaModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all text-white shadow-lg shadow-indigo-600/20"
              >
                <PlusCircle className="w-5 h-5" /> 기능 실습 요청하기
              </button>
              {isAdmin && (
                <button 
                  onClick={() => {
                    setEditingProject(null);
                    setIsAdminModalOpen(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all text-white shadow-lg shadow-emerald-600/20"
                >
                  <PlusCircle className="w-5 h-5" /> 새 실습 등록하기
                </button>
              )}
            </div>
          </div>
          
          {/* Compact Learning Outcomes Card (Curriculum Style) */}
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-5 w-full max-w-md shadow-2xl shadow-indigo-900/10 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-500/5 rounded-full blur-xl" />
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> 실습 목표
              </h3>
              <div className="bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-[12px] font-black px-2 py-0.5 rounded-full border border-indigo-500/20">
                PRACTICE
              </div>
            </div>
            
            <div className="space-y-1 relative z-10">
              <div className="grid grid-cols-1 gap-1">
                <OutcomeItem icon={<Code size={12} />} label="기능 구현" desc="실제 서비스에 필요한 핵심 기능 제작" />
                <OutcomeItem icon={<Box size={12} />} label="모듈 활용" desc="다양한 라이브러리와 API 연동 실습" />
                <OutcomeItem icon={<Rocket size={12} />} label="응용력 향상" desc="복합적인 로직 설계와 문제 해결 능력" />
              </div>
              
              <div className="pt-3 mt-1 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between bg-indigo-600/5 dark:bg-indigo-500/10 rounded-xl px-3 py-2 border border-indigo-500/10">
                  <span className="text-[12px] font-bold text-indigo-600/70 dark:text-indigo-400/70 uppercase">Goal</span>
                  <span className="text-[12px] font-black text-slate-700 dark:text-slate-200">완성도 높은 기능 빌딩</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto w-full px-6 py-10 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="lg:w-64 space-y-8 shrink-0">
          <div className="space-y-6">
            <FilterSection title="커리큘럼">
              <Checkbox label="전체" checked={selectedLevels.includes('전체')} onChange={() => toggleLevel('전체')} />
              <Checkbox label="입문" checked={selectedLevels.includes('입문')} onChange={() => toggleLevel('입문')} />
              <Checkbox label="기초" checked={selectedLevels.includes('기초')} onChange={() => toggleLevel('기초')} />
              <Checkbox label="실전" checked={selectedLevels.includes('실전')} onChange={() => toggleLevel('실전')} />
              <Checkbox label="심화" checked={selectedLevels.includes('심화')} onChange={() => toggleLevel('심화')} />
            </FilterSection>

            <FilterSection title="카테고리">
              <Checkbox label="전체" checked={selectedCategory.includes('전체')} onChange={() => toggleCategory('전체')} />
              <Checkbox label="UI/UX" checked={selectedCategory.includes('UI/UX')} onChange={() => toggleCategory('UI/UX')} />
              <Checkbox label="데이터 처리" checked={selectedCategory.includes('데이터 처리')} onChange={() => toggleCategory('데이터 처리')} />
              <Checkbox label="인증/보안" checked={selectedCategory.includes('인증/보안')} onChange={() => toggleCategory('인증/보안')} />
              <Checkbox label="CRUD" checked={selectedCategory.includes('CRUD')} onChange={() => toggleCategory('CRUD')} />
              <Checkbox label="파일 관리" checked={selectedCategory.includes('파일 관리')} onChange={() => toggleCategory('파일 관리')} />
              <Checkbox label="상태 관리" checked={selectedCategory.includes('상태 관리')} onChange={() => toggleCategory('상태 관리')} />
              <Checkbox label="API 연동" checked={selectedCategory.includes('API 연동')} onChange={() => toggleCategory('API 연동')} />
              <Checkbox label="기타" checked={selectedCategory.includes('기타')} onChange={() => toggleCategory('기타')} />
            </FilterSection>

            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest">연계 커리큘럼</h3>
              <div className="relative">
                <select 
                  value={selectedCurriculum}
                  onChange={(e) => setSelectedCurriculum(e.target.value)}
                  className="w-full bg-card dark:bg-slate-800/50 border border-border rounded-lg px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
                >
                  <option>전체 단계</option>
                  <option>입문 단계</option>
                  <option>기초 단계</option>
                  <option>실전 단계</option>
                  <option>심화 단계</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Suggestion Box */}
          <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl p-5 space-y-3 transition-colors">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
               <Lightbulb className="w-4 h-4" />
               <h4 className="text-xs font-black">실습 아이디어</h4>
            </div>
            <p className="text-[12px] text-indigo-700/70 dark:text-indigo-300/60 leading-relaxed font-medium">
              직접 만들어보고 싶은 기능이 있나요? 아이디어를 제안해주시면 실습 리스트에 추가됩니다!
            </p>
            <button 
              onClick={() => setIsIdeaModalOpen(true)}
              className="w-full bg-white dark:bg-white/10 py-2 rounded-lg text-[12px] font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            >
              아이디어 제안하기
            </button>
          </div>
        </aside>

        {/* Practice Grid */}
        <div className="flex-1 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="어떤 기능을 구현해볼까요?" 
                 className="w-full bg-card dark:bg-slate-800/50 border border-border rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors dark:text-white"
               />
             </div>
             <div className="flex gap-2">
               <button 
                 onClick={() => setSortBy('latest')}
                 className={`px-4 py-3 border rounded-xl text-xs font-bold transition-all ${sortBy === 'latest' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-card dark:bg-slate-800/50 border-border text-slate-600 dark:text-slate-400 hover:text-indigo-600'}`}
               >
                 최신순
               </button>
               <button 
                 onClick={() => setSortBy('popular')}
                 className={`px-4 py-3 border rounded-xl text-xs font-bold transition-all ${sortBy === 'popular' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-card dark:bg-slate-800/50 border-border text-slate-600 dark:text-slate-400 hover:text-indigo-600'}`}
               >
                 인기순
               </button>
               <button 
                 onClick={() => setSortBy('level')}
                 className={`px-4 py-3 border rounded-xl text-xs font-bold transition-all ${sortBy === 'level' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-card dark:bg-slate-800/50 border-border text-slate-600 dark:text-slate-400 hover:text-indigo-600'}`}
               >
                 난이도순
               </button>
             </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {isLoading ? (
              // Skeleton loading
              [...Array(8)].map((_, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border p-6 h-[280px] animate-pulse space-y-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-xl" />
                  <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-full" />
                  <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-5/6" />
                </div>
              ))
            ) : (
              filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <div key={project.id} onClick={() => {
                    setSelectedProject(project);
                    setIsDetailModalOpen(true);
                  }}>
                    <ProjectCard 
                      project={project}
                      onEdit={(p) => {
                        setEditingProject(p);
                        setIsAdminModalOpen(true);
                      }}
                      onDelete={async (id) => {
                        if (confirm('정말 삭제하시겠습니까?')) {
                          const res = await fetch('/api/practice', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id })
                          });
                          const data = await res.json() as { success: boolean; message?: string };
                          if (data.success) {
                            if (data.message?.includes('Mock')) {
                              handleLocalUpdate(projects.filter(p => p.id !== id));
                            } else {
                              fetchProjects();
                            }
                          }
                        }
                      }}
                      onHide={async (id, currentHidden) => {
                        const project = projects.find(p => p.id === id);
                        const res = await fetch('/api/practice', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ 
                            ...project,
                            id, 
                            is_hidden: currentHidden ? 0 : 1 
                          })
                        });
                        const data = await res.json() as { success: boolean; message?: string };
                        if (data.success) {
                          if (data.message?.includes('Mock')) {
                            handleLocalUpdate(projects.map(p => p.id === id ? { ...p, is_hidden: currentHidden ? 0 : 1 } : p));
                          } else {
                            fetchProjects();
                          }
                        }
                      }}
                      onRefresh={fetchProjects}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center space-y-4 bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
                  <Search className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-slate-500 font-bold">조건에 맞는 실습 프로젝트가 없습니다.</p>
                  <button 
                    onClick={() => {
                      setSelectedLevels(['전체']);
                      setSelectedCategory(['전체']);
                      setSelectedCurriculum('전체 단계');
                    }}
                    className="text-indigo-600 font-black hover:underline"
                  >
                    필터 초기화하기
                  </button>
                </div>
              )
            )}
          </div>

          {/* Pagination removed as per request */}
        </div>
      </main>

      {/* --- Connection Footer --- */}
      <section className="bg-white dark:bg-[#0f172a] border-t border-slate-100 dark:border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" /> 커리큘럼 연계 실습
            </h2>
            <Link href="/curriculum" className="text-xs font-bold text-indigo-600 hover:underline">커리큘럼 전체 보기 →</Link>
          </div>
          <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
            <StepItem 
              step="입문 단계" 
              title="AI 구조 이해" 
              count={projects.filter(p => p.level === '입문').length.toString()} 
              color="emerald"
            />
            <StepArrow />
            <StepItem 
              step="기초 단계" 
              title="흐름 설계" 
              count={projects.filter(p => p.level === '기초').length.toString()} 
              color="sky"
            />
            <StepArrow />
            <StepItem 
              step="실전 단계" 
              title="연결 구현" 
              count={projects.filter(p => p.level === '실전').length.toString()} 
              color="indigo"
            />
            <StepArrow />
            <StepItem 
              step="심화 단계" 
              title="서비스 확장" 
              count={projects.filter(p => p.level === '심화').length.toString()} 
              color="purple"
            />
          </div>
          
          <div className="bg-indigo-50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-indigo-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 text-white rounded-xl">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-indigo-600 dark:text-indigo-400 font-black text-sm uppercase tracking-widest mb-1">TIP</p>
                <p className="text-slate-700 dark:text-slate-200 text-sm font-bold">실습을 완료하고 나면 커리큘럼 회차에 기록해 보세요!</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">학습 기록을 남기면 나중에 복습하기에도 좋아요.</p>
              </div>
            </div>
            <Link href="/curriculum" className="bg-white dark:bg-white/10 px-6 py-3 rounded-lg text-indigo-600 dark:text-indigo-400 font-bold text-sm shadow-sm hover:shadow-md transition-all border border-indigo-50 dark:border-white/10">
              커리큘럼으로 기록하기 →
            </Link>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}

      {/* Admin Project Modal */}
      {isAdminModalOpen && (
        <ProjectAdminModal 
          isOpen={isAdminModalOpen} 
          onClose={() => setIsAdminModalOpen(false)} 
          project={editingProject}
          onSuccess={(newProject) => {
            setIsAdminModalOpen(false);
            if (newProject && !newProject.id) { // Mock response case
              const mockWithId = { ...newProject, id: Date.now().toString(), completion_rate: 0, views: '0' };
              if (editingProject) {
                handleLocalUpdate(projects.map(p => p.id === editingProject.id ? { ...p, ...newProject } : p));
              } else {
                handleLocalUpdate([mockWithId, ...projects]);
              }
            } else {
              fetchProjects();
            }
          }}
        />
      )}

      {/* Project Detail Modal */}
      {isDetailModalOpen && selectedProject && (
        <ProjectDetailModal 
          project={selectedProject} 
          onClose={() => setIsDetailModalOpen(false)} 
          onUpdate={fetchProjects}
        />
      )}

      {/* Idea Modal */}
      {isIdeaModalOpen && (
        <IdeaModal 
          isOpen={isIdeaModalOpen} 
          onClose={() => setIsIdeaModalOpen(false)} 
        />
      )}
    </div>
  );
}

function FilterSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest">{title}</h3>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

function Checkbox({ label, checked = false, onChange }: { label: string, checked?: boolean, onChange?: () => void }) {
  return (
    <label className="flex items-center gap-2.5 group cursor-pointer" onClick={onChange}>
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
        checked ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200 dark:border-slate-700 group-hover:border-indigo-400'
      }`}>
        {checked && <Check className="w-3.5 h-3.5 text-white" />}
      </div>
      <span className={`text-xs font-bold transition-colors ${checked ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`}>{label}</span>
    </label>
  );
}

function ProjectCard({ project, onEdit, onDelete, onHide, onRefresh }: { project: PracticeProject, onEdit: (p: PracticeProject) => void, onDelete: (id: string) => void, onHide: (id: string, current: boolean) => void, onRefresh: () => void }) {
  const { id, icon_name, level, title, description, tags, curriculum_link, completion_rate, is_hidden } = project;
  const tagList = tags?.split(',') || [];
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsAdmin(user.username === 'ljj');
      } catch (e) {}
    }
  }, []);

  // Normal users cannot see hidden items
  if (is_hidden === 1 && !isAdmin) return null;

  const IconComponent = (function() {
    switch(icon_name) {
      case 'ShieldCheck': return ShieldCheck;
      case 'CheckCircle2': return CheckCircle2;
      case 'Upload': return Upload;
      case 'Search': return Search;
      case 'Edit3': return Edit3;
      case 'LineChart': return LineChart;
      case 'MessageSquare': return MessageSquare;
      case 'Moon': return Moon;
      case 'Menu': return Menu;
      case 'Sun': return Sun;
      case 'Lock': return Lock;
      default: return Code;
    }
  })();
  const levelColors: Record<string, string> = {
    '입문': 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400',
    '기초': 'text-sky-500 bg-sky-50 dark:bg-sky-500/10 dark:text-sky-400',
    '실전': 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400',
    '심화': 'text-purple-500 bg-purple-50 dark:bg-purple-500/10 dark:text-purple-400'
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 flex flex-col justify-between group hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all duration-500 cursor-pointer overflow-hidden relative">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl text-slate-700 dark:text-slate-300 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors relative">
            <IconComponent className="w-6 h-6" />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5">
              {is_hidden === 1 && (
                <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm animate-pulse">HIDDEN</span>
              )}
              <span className={`text-[12px] font-black px-2 py-0.5 rounded-full ${levelColors[level]}`}>{level}</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-800 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{title}</h4>
          <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 h-10">{description}</p>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tagList.map((tag, i) => (
            <span key={i} className="text-[12px] font-bold px-2 py-0.5 bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-slate-500 rounded-md border border-slate-100 dark:border-border transition-colors">{tag}</span>
          ))}
        </div>
      </div>
      <div className="pt-6 mt-6 border-t border-border space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
              className={`transition-colors ${isFavorite ? 'text-indigo-600' : 'text-slate-200 dark:text-slate-700 hover:text-indigo-500'}`}
            >
              <Bookmark className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <div className="flex items-center gap-1.5 text-[12px] text-slate-400 font-black">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-500" /> {completion_rate}회
            </div>
          </div>
          
          {isAdmin && (
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="p-1 text-slate-300 hover:text-indigo-600 transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              
              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                  <div className="absolute bottom-full right-0 mb-2 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-20 py-1 animate-in zoom-in-95 duration-200 origin-bottom-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(project);
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> 수정
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(id);
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> 삭제
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onHide(id, is_hidden === 1);
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-black text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-t border-slate-100 dark:border-white/5 mt-1"
                    >
                      <EyeOff className="w-3.5 h-3.5" /> {is_hidden === 1 ? '숨김 해제' : '가리기'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectAdminModal({ isOpen, onClose, project, onSuccess }: { isOpen: boolean, onClose: () => void, project: PracticeProject | null, onSuccess: (newP?: any) => void }) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    level: project?.level || '입문',
    category: project?.category || 'UI/UX',
    tags: project?.tags || '',
    curriculum_link: project?.curriculum_link || '입문 단계',
    icon_name: project?.icon_name || 'Code',
    is_hidden: project?.is_hidden || 0,
    content: project?.content || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = project ? 'PUT' : 'POST';
    const body = project ? { ...formData, id: project.id } : formData;

    const res = await fetch('/api/practice', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      const data = await res.json() as { success: boolean; message?: string };
      onSuccess(data.message?.includes('Mock') ? formData : null);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-tighter">
              {project ? '실습 프로젝트 수정' : '새 실습 프로젝트 등록'}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 flex-1 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <div className="space-y-1.5 col-span-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">프로젝트 제목</label>
              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" placeholder="예: 로그인 기능 구현" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none dark:text-white focus:border-indigo-500 transition-colors" />
            </div>

            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">카테고리</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none dark:text-white focus:border-indigo-500 transition-colors cursor-pointer">
                <option>UI/UX</option><option>데이터 처리</option><option>인증/보안</option><option>CRUD</option><option>파일 관리</option><option>상태 관리</option><option>API 연동</option><option>기타</option>
              </select>
            </div>

            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">커리큘럼 설정</label>
              <div className="flex gap-1.5">
                {['입문', '기초', '실전', '심화'].map(l => (
                  <button key={l} type="button" onClick={() => setFormData({...formData, level: l})} className={`flex-1 py-2 rounded-lg text-[11px] font-black border transition-all ${formData.level === l ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 hover:border-slate-300'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">연계 커리큘럼</label>
              {formData.level === '심화' ? (
                <div className="space-y-2">
                  <p className="text-[10px] text-indigo-500 font-bold">심화 트랙 중복 선택 가능</p>
                  {[
                    { key: '트랙 A: 수익형 빌딩', label: '트랙 A: 수익형 빌딩 (SaaS & Game)' },
                    { key: '트랙 B: 플랫폼 확장', label: '트랙 B: 플랫폼 확장 (Mobile & Extensions)' },
                    { key: '트랙 C: 고급 OS & AI 인프라', label: '트랙 C: 고급 OS & AI 인프라' },
                    { key: '트랙 D: 자동화 파이프라인', label: '트랙 D: 자동화 파이프라인' }
                  ].map(track => {
                    const currentTracks = formData.curriculum_link.split(', ').filter(Boolean);
                    const isChecked = currentTracks.includes(track.key);
                    const handleToggle = () => {
                      const updated = isChecked
                        ? currentTracks.filter(t => t !== track.key)
                        : [...currentTracks, track.key];
                      setFormData({...formData, curriculum_link: updated.join(', ')});
                    };
                    return (
                      <label key={track.key} className="flex items-center gap-2.5 cursor-pointer group" onClick={handleToggle}>
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          isChecked ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200 dark:border-slate-700 group-hover:border-indigo-400'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className={`text-xs font-bold transition-colors ${isChecked ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>{track.label}</span>
                      </label>
                    );
                  })}
                  <input type="hidden" value={formData.curriculum_link} onChange={() => {}} />
                </div>
              ) : (
                <select value={formData.curriculum_link} onChange={e => setFormData({...formData, curriculum_link: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none dark:text-white focus:border-indigo-500 transition-colors cursor-pointer">
                  <option>입문 단계</option><option>기초 단계</option><option>실전 단계</option>
                </select>
              )}
            </div>

            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">대표 아이콘</label>
              <select value={formData.icon_name} onChange={e => setFormData({...formData, icon_name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none dark:text-white focus:border-indigo-500 transition-colors cursor-pointer">
                <option>ShieldCheck</option><option>CheckCircle2</option><option>Upload</option><option>Search</option><option>Edit3</option><option>LineChart</option><option>MessageSquare</option><option>Moon</option><option>Menu</option><option>Sun</option><option>Lock</option><option>Code</option>
              </select>
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">간략 설명</label>
              <input required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} type="text" placeholder="실습에 대한 핵심 설명을 입력하세요." className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none dark:text-white focus:border-indigo-500 transition-colors" />
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">태그 (쉼표로 구분)</label>
              <input value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} type="text" placeholder="예: 인증,폼 처리,Firebase" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none dark:text-white focus:border-indigo-500 transition-colors" />
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">상세 실습 과정 (마크다운)</label>
              <textarea 
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})} 
                rows={6} 
                placeholder="### 🔐 실습 가이드&#13;1. 환경 설정...&#13;2. 기능 구현..."
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none dark:text-white resize-none font-mono leading-relaxed"
              />
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer group w-fit">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={formData.is_hidden === 1} 
                    onChange={e => setFormData({...formData, is_hidden: e.target.checked ? 1 : 0})}
                    className="sr-only peer" 
                  />
                  <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-indigo-600 transition-all after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-5" />
                </div>
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">이 프로젝트 숨기기 (관리자 전용)</span>
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="mt-10 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-black text-slate-500 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">취소</button>
            <button type="submit" className="flex-[2.5] py-3 rounded-xl text-sm font-black text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/25 active:scale-[0.98]">
              {project ? '변경 사항 저장' : '새 실습 프로젝트 게시'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StepItem({ step, title, count, active = false, color = 'indigo' }: { step: string, title: string, count: string, active?: boolean, color?: string }) {
  const colorMap: Record<string, { bg: string, border: string, text: string, darkBg: string, darkBorder: string, hoverBorder: string, darkHoverBorder: string, badgeBg: string, activeBg: string }> = {
    'emerald': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', darkBg: 'dark:bg-emerald-500/10', darkBorder: 'dark:border-emerald-500/30', hoverBorder: 'hover:border-emerald-200', darkHoverBorder: 'dark:hover:border-emerald-500/30', badgeBg: 'bg-emerald-600', activeBg: 'bg-emerald-50' },
    'sky': { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-600', darkBg: 'dark:bg-sky-500/10', darkBorder: 'dark:border-sky-500/30', hoverBorder: 'hover:border-sky-200', darkHoverBorder: 'dark:hover:border-sky-500/30', badgeBg: 'bg-sky-600', activeBg: 'bg-sky-50' },
    'indigo': { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600', darkBg: 'dark:bg-indigo-500/10', darkBorder: 'dark:border-indigo-500/30', hoverBorder: 'hover:border-indigo-200', darkHoverBorder: 'dark:hover:border-indigo-500/30', badgeBg: 'bg-indigo-600', activeBg: 'bg-indigo-50' },
    'purple': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', darkBg: 'dark:bg-purple-500/10', darkBorder: 'dark:border-purple-500/30', hoverBorder: 'hover:border-purple-200', darkHoverBorder: 'dark:hover:border-purple-500/30', badgeBg: 'bg-purple-600', activeBg: 'bg-purple-50' },
  };

  const c = colorMap[color] || colorMap['indigo'];

  return (
    <div className={`flex-1 min-w-[140px] p-5 rounded-xl border text-center transition-all duration-300 cursor-pointer group/step ${
      active 
        ? `${c.activeBg} ${c.border} shadow-sm ${c.darkBg} ${c.darkBorder}` 
        : `bg-white border-slate-100 dark:bg-slate-900 dark:border-white/5 ${c.hoverBorder} hover:shadow-md ${c.darkHoverBorder}`
    }`}>
      <p className={`text-[12px] font-black mb-1 transition-colors ${active ? c.text : `text-slate-400 group-hover/step:${c.text.replace('text-', 'text-')}`}`}>{step}</p>
      <h5 className="text-sm font-black text-slate-800 dark:text-white mb-3">{title}</h5>
      <span className={`text-[12px] px-3 py-1 rounded-full font-bold transition-all ${
        active 
          ? `${c.badgeBg} text-white` 
          : `bg-slate-50 text-slate-400 dark:bg-white/5 group-hover/step:${c.badgeBg} group-hover/step:text-white`
      }`}>추천 실습 {count}개</span>
    </div>
  );
}

function StepArrow() {
  return <ArrowRight className="w-5 h-5 text-slate-200 hidden lg:block" />;
}

function OutcomeItem({ icon, label, desc }: { icon: React.ReactNode, label: string, desc: string }) {
  return (
    <div className="flex items-center gap-3 py-1 px-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all group/item">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 group-hover/item:scale-110 transition-transform">
        {icon}
      </div>
      <div className="space-y-0">
        <h4 className="text-[12px] font-black text-slate-800 dark:text-white leading-tight">{label}</h4>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-tight">{desc}</p>
      </div>
    </div>
  );
}

function IdeaModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div className="bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase">Request Feature</div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-4 text-left">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">기능 실습 요청하기</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">만들어보고 싶은 기능이나 실습 아이디어를 자유롭게 남겨주세요!</p>
            
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300">실습 명칭</label>
                <input 
                  type="text" 
                  placeholder="예: 인스타그램 피드 구현하기" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300">기능 설명</label>
                <textarea 
                  rows={4}
                  placeholder="구체적인 동작 방식이나 필요한 기능을 적어주세요." 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white resize-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              onClick={() => {
                alert('소중한 아이디어가 전달되었습니다. 감사합니다!');
                onClose();
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-indigo-600/20"
            >
              아이디어 제출하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectDetailModal({ project, onClose, onUpdate }: { project: PracticeProject, onClose: () => void, onUpdate: () => void }) {
  const { id, title, description, level, category, tags, content, icon_name, completion_rate, curriculum_link } = project;
  const tagList = tags?.split(',') || [];
  const trackList = (curriculum_link && level === '심화') ? curriculum_link.split(', ').filter(Boolean) : [];
  const [isCompleting, setIsCompleting] = useState(false);
  const [promptCount, setPromptCount] = useState(completion_rate || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const IconComponent = (function() {
    switch(icon_name) {
      case 'ShieldCheck': return ShieldCheck;
      case 'CheckCircle2': return CheckCircle2;
      case 'Upload': return Upload;
      case 'Search': return Search;
      case 'Edit3': return Edit3;
      case 'LineChart': return LineChart;
      case 'MessageSquare': return MessageSquare;
      case 'Moon': return Moon;
      case 'Menu': return Menu;
      case 'Sun': return Sun;
      case 'Lock': return Lock;
      default: return Code;
    }
  })();

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/practice', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...project,
          completion_rate: Number(promptCount)
        })
      });
      const data = await res.json() as { success: boolean; message?: string };
      if (data.success) {
        if (data.message?.includes('Mock')) {
          const localData = localStorage.getItem('local_practice_projects');
          if (localData) {
            const projects = JSON.parse(localData) as PracticeProject[];
            const updated = projects.map(p => p.id === id ? { ...p, completion_rate: Number(promptCount) } : p);
            localStorage.setItem('local_practice_projects', JSON.stringify(updated));
          }
        }
        onUpdate();
        setIsCompleting(false);
        alert('학습 기록이 성공적으로 저장되었습니다!');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMarkdown = (text: string) => {
    if (!text) return <p className="text-slate-400 italic">상세 실습 과정이 등록되지 않았습니다.</p>;
    
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-black text-slate-800 dark:text-white mt-6 mb-3">{line.replace('### ', '')}</h3>;
      if (line.startsWith('#### ')) return <h4 key={i} className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-4 mb-2">{line.replace('#### ', '')}</h4>;
      if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 p-4 my-4 rounded-r-lg text-sm italic">{line.replace('> ', '')}</blockquote>;
      if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc text-sm text-slate-600 dark:text-slate-400 mb-1">{line.replace('- ', '')}</li>;
      if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) return <li key={i} className="ml-4 list-decimal text-sm text-slate-600 dark:text-slate-400 mb-1">{line.substring(3)}</li>;
      if (line.startsWith('```')) return null;
      
      const boldText = line.split('**').map((part, idx) => idx % 2 === 1 ? <strong key={idx} className="font-black text-indigo-600 dark:text-indigo-400">{part}</strong> : part);
      return <p key={i} className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-2">{boldText}</p>;
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-start justify-between bg-slate-50/50 dark:bg-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
              <IconComponent className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{category}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{level} 단계</span>
              </div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white">{title}</h2>
              {trackList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {trackList.map((track: string, i: number) => (
                    <span key={i} className="text-[9px] font-black px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20">{track}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <section className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">프로젝트 개요</h3>
            <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{description}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {tagList.map((tag, i) => (
                <span key={i} className="text-[10px] font-black px-2 py-1 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-md">#{tag.trim()}</span>
              ))}
            </div>
          </section>

          <div className="h-px bg-slate-100 dark:bg-white/5" />

          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">실습 과정 가이드</h3>
            <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-6 border border-slate-100 dark:border-white/5">
              {renderMarkdown(content || '')}
            </div>
          </section>

          {/* Completion Section */}
          <section className="pt-4">
            <div className={`rounded-2xl p-6 border transition-all ${isCompleting ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5'}`}>
              {!isCompleting ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                      <Zap className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black dark:text-white">나의 실습 현황</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">현재 실습을 진행 중입니다.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsCompleting(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-black shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
                  >
                    실습 완료하기
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-white">축하합니다! 실습을 완료하셨나요?</h4>
                    <button onClick={() => setIsCompleting(false)} className="text-indigo-200 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-[10px] font-black uppercase text-indigo-200 mb-1 block">사용된 프롬프트 횟수</label>
                      <input 
                        type="number" 
                        value={promptCount}
                        onChange={(e) => setPromptCount(Number(e.target.value))}
                        className="w-full bg-indigo-700/50 border border-indigo-400/30 rounded-lg px-4 py-2 text-sm outline-none text-white font-black"
                        placeholder="0"
                      />
                    </div>
                    <button 
                      onClick={handleComplete}
                      disabled={isSubmitting}
                      className="mt-5 px-6 py-2 bg-white text-indigo-600 rounded-lg text-sm font-black hover:bg-indigo-50 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? '저장 중...' : '기록 저장'}
                    </button>
                  </div>
                  <p className="text-[11px] text-indigo-200">완료한 횟수는 실습 목록의 메트릭에 반영됩니다.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-lg font-black text-sm hover:bg-slate-300 transition-all">닫기</button>
        </div>
      </div>
    </div>
  );
}
