"use client";

import { Header } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { curriculumApi } from "@/lib/api";
import { useCurriculum } from "@/lib/curriculum-context";
import {
  CurriculumPurpose,
  ResourceType,
  UserLevel,
} from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const purposes: { id: CurriculumPurpose; label: string; icon: string }[] = [
  { id: "deep_research", label: "심층 연구", icon: "science" },
  { id: "simple_study", label: "개념 학습", icon: "school" },
  { id: "trend_check", label: "트렌드 파악", icon: "rate_review" },
  { id: "code_implementation", label: "구현 실습", icon: "code" },
  { id: "exam_preparation", label: "시험 준비", icon: "quiz" },
];

const levels: { id: UserLevel; label: string; desc: string }[] = [
  { id: "non_major", label: "입문자", desc: "비전공자/처음 시작" },
  { id: "bachelor", label: "학부생", desc: "기초 지식 보유" },
  { id: "master", label: "대학원생", desc: "심화 학습 가능" },
  { id: "researcher", label: "연구원", desc: "전문 연구 경험" },
  { id: "industry", label: "현업", desc: "실무 적용 목적" },
];

const resourceTypes: { id: ResourceType; label: string; icon: string }[] = [
  { id: "paper", label: "원문 논문", icon: "description" },
  { id: "article", label: "블로그/아티클", icon: "language" },
  { id: "video", label: "영상 강의", icon: "play_circle" },
  { id: "code", label: "코드/튜토리얼", icon: "code" },
];

export default function CurriculumSettingsPage() {
  const router = useRouter();
  const { state, setOptions, startGeneration } = useCurriculum();

  const [purpose, setPurpose] = useState<CurriculumPurpose>("simple_study");
  const [level, setLevel] = useState<UserLevel>("bachelor");
  const [knownConcepts, setKnownConcepts] = useState<string[]>([]);
  const [studyDays, setStudyDays] = useState(14);
  const [dailyHours, setDailyHours] = useState(2);
  const [preferredResources, setPreferredResources] = useState<ResourceType[]>([
    "paper",
    "article",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!state.paper) {
      router.push("/curriculum/upload-paper");
    }
  }, [state.paper, router]);

  // keywords는 이제 {id, name, importance} 객체 배열
  const extractedKeywords = state.paper?.keywords || [];

  const handleSubmit = async () => {
    if (!state.curriculumId) return;
    setIsSubmitting(true);

    try {
      const options = {
        purpose,
        level,
        known_concepts: knownConcepts,
        budgeted_time: {
          days: studyDays,
          daily_hours: dailyHours,
        },
        preferred_resources: preferredResources,
      };

      setOptions(options);
      await curriculumApi.setOptions(state.curriculumId, options);
      startGeneration();
      await curriculumApi.startGeneration(state.curriculumId);
      router.push("/curriculum/generating");
    } catch (err) {
      console.error("Failed to start generation:", err);
      setIsSubmitting(false);
    }
  };

  if (!state.paper) return null;

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />

      <main className='flex-1 py-10 px-6'>
        <div className='max-w-[900px] mx-auto'>
          {/* Header */}
          <div className='mb-10'>
            <h1 className='text-3xl md:text-4xl font-black tracking-tight mb-2'>
              커리큘럼 <span className='text-accent'>설정</span>
            </h1>
            <p className='text-slate-500'>
              "{state.paper.title}" 논문에 맞는 커리큘럼을 설계합니다.
            </p>
          </div>

          <div className='space-y-6'>
            {/* Purpose */}
            <div className='bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200'>
              <div className='flex items-center gap-3 mb-5'>
                <div className='size-10 rounded-2xl bg-red-50 flex items-center justify-center'>
                  <span className='material-symbols-outlined text-accent text-xl'>
                    target
                  </span>
                </div>
                <h2 className='text-lg font-bold'>1. 학습 목적</h2>
              </div>
              <div className='flex flex-wrap gap-3'>
                {purposes.map(p => (
                  <label key={p.id} className='cursor-pointer'>
                    <input
                      type='radio'
                      name='purpose'
                      value={p.id}
                      checked={purpose === p.id}
                      onChange={e =>
                        setPurpose(e.target.value as CurriculumPurpose)
                      }
                      className='peer sr-only'
                    />
                    <div className='px-6 py-3 rounded-full border-2 border-transparent bg-slate-100 text-sm font-bold text-slate-600 transition-all peer-checked:bg-primary peer-checked:text-slate-900 peer-checked:shadow-sm hover:bg-slate-200'>
                      {p.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Level */}
            <div className='bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200'>
              <div className='flex items-center gap-3 mb-5'>
                <div className='size-10 rounded-2xl bg-red-50 flex items-center justify-center'>
                  <span className='material-symbols-outlined text-accent text-xl'>
                    school
                  </span>
                </div>
                <h2 className='text-lg font-bold'>2. 학습 수준</h2>
              </div>
              <div className='flex flex-wrap gap-3'>
                {levels.map(l => (
                  <label key={l.id} className='cursor-pointer relative'>
                    <input
                      type='radio'
                      name='level'
                      value={l.id}
                      checked={level === l.id}
                      onChange={e => setLevel(e.target.value as UserLevel)}
                      className='peer sr-only'
                    />
                    <div className='px-5 py-3 rounded-2xl border-2 border-transparent bg-slate-100 text-center peer-checked:border-primary peer-checked:bg-primary/10 transition-all hover:bg-slate-200'>
                      <span className='font-bold block mb-0.5'>{l.label}</span>
                      <span className='text-xs text-slate-500'>{l.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Known Concepts */}
            <div className='bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='size-10 rounded-2xl bg-red-50 flex items-center justify-center'>
                  <span className='material-symbols-outlined text-accent text-xl'>
                    psychology
                  </span>
                </div>
                <div>
                  <h2 className='text-lg font-bold'>3. 이미 알고 있는 개념</h2>
                </div>
              </div>
              <p className='text-sm text-slate-500 mb-4 ml-[52px]'>
                선택한 개념은 커리큘럼에서 간략히 다루거나 건너뜁니다.
              </p>

              {extractedKeywords.length > 0 ? (
                <div className='flex flex-wrap gap-2'>
                  {extractedKeywords.map(kw => (
                    <label key={kw.id} className='cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={knownConcepts.includes(kw.id)}
                        onChange={() =>
                          setKnownConcepts(prev =>
                            prev.includes(kw.id)
                              ? prev.filter(x => x !== kw.id)
                              : [...prev, kw.id]
                          )
                        }
                        className='peer sr-only'
                      />
                      <div className='px-5 py-2 rounded-full border-2 border-transparent bg-slate-100 font-bold text-sm text-slate-500 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-slate-800 transition-all hover:bg-slate-200 flex items-center gap-1.5'>
                        <span>{kw.name}</span>
                        <div className='size-5 rounded-full bg-accent/10 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity'>
                          <span className='material-symbols-outlined text-[14px] text-accent font-bold'>
                            close
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className='p-4 bg-slate-50 rounded-xl text-center text-slate-400 text-sm'>
                  논문에서 추출된 개념이 없습니다.
                </div>
              )}
            </div>

            {/* Time & Resources */}
            <div className='grid md:grid-cols-2 gap-6'>
              {/* Time - Changed label */}
              <div className='bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200'>
                <div className='flex items-center gap-3 mb-5'>
                  <div className='size-10 rounded-2xl bg-red-50 flex items-center justify-center'>
                    <span className='material-symbols-outlined text-accent text-xl'>
                      schedule
                    </span>
                  </div>
                  <h2 className='text-lg font-bold'>4. 목표 투자 시간</h2>
                </div>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-xs font-bold mb-2 text-slate-500 ml-1'>
                      학습 기간 (일)
                    </label>
                    <div className='relative'>
                      <Input
                        type='number'
                        value={studyDays}
                        onChange={e => setStudyDays(Number(e.target.value))}
                        min={1}
                        max={365}
                        className='h-12 rounded-2xl border-2 border-slate-200 pr-12 bg-slate-50 focus:border-primary'
                      />
                      <span className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold'>
                        일
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className='block text-xs font-bold mb-2 text-slate-500 ml-1'>
                      일일 학습 시간
                    </label>
                    <div className='relative'>
                      <Input
                        type='number'
                        value={dailyHours}
                        onChange={e => setDailyHours(Number(e.target.value))}
                        min={0.5}
                        max={12}
                        step={0.5}
                        className='h-12 rounded-2xl border-2 border-slate-200 pr-12 bg-slate-50 focus:border-primary'
                      />
                      <span className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold'>
                        시간
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resources */}
              <div className='bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200'>
                <div className='flex items-center gap-3 mb-5'>
                  <div className='size-10 rounded-2xl bg-red-50 flex items-center justify-center'>
                    <span className='material-symbols-outlined text-accent text-xl'>
                      library_books
                    </span>
                  </div>
                  <h2 className='text-lg font-bold'>5. 선호 자료 형태</h2>
                </div>
                <div className='flex flex-col gap-3'>
                  {resourceTypes.map(r => (
                    <label
                      key={r.id}
                      className='flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors group'
                    >
                      <div className='relative flex items-center justify-center size-6 ml-1'>
                        <input
                          type='checkbox'
                          checked={preferredResources.includes(r.id)}
                          onChange={() =>
                            setPreferredResources(prev =>
                              prev.includes(r.id)
                                ? prev.filter(x => x !== r.id)
                                : [...prev, r.id]
                            )
                          }
                          className='peer appearance-none size-6 bg-white border-2 border-slate-200 rounded-full checked:bg-primary checked:border-primary transition-all'
                        />
                        <span className='material-symbols-outlined text-slate-900 text-[16px] absolute opacity-0 peer-checked:opacity-100 pointer-events-none font-bold'>
                          check
                        </span>
                      </div>
                      <span className='flex-1 text-sm font-bold text-slate-600 group-hover:text-slate-900'>
                        {r.label}
                      </span>
                      <span className='material-symbols-outlined text-slate-300 group-hover:text-primary text-[20px] mr-1 transition-colors'>
                        {r.icon}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className='pt-6 pb-12'>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className='w-full h-14 rounded-full text-lg font-black bg-primary text-slate-900 hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50'
              >
                {isSubmitting ? (
                  <span className='flex items-center gap-2'>
                    <span className='material-symbols-outlined animate-spin'>
                      progress_activity
                    </span>
                    처리 중...
                  </span>
                ) : (
                  <span className='flex items-center gap-2'>
                    <span className='material-symbols-outlined text-xl icon-filled'>
                      auto_awesome
                    </span>
                    나만의 커리큘럼 생성하기
                  </span>
                )}
              </Button>
              <p className='text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1'>
                <span className='material-symbols-outlined text-[14px]'>
                  info
                </span>
                복잡도에 따라 AI 생성에 최대 30초가 소요될 수 있어요.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
