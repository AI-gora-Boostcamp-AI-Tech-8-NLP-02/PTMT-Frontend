import { Badge } from "@/components/ui/badge";
import { CurriculumListItem } from "@/lib/types";
import { STATUS_CONFIG } from "../../../../const/curriculumStatus";

interface Props {
  item: CurriculumListItem;
  onClick: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export default function CurriculumListItemRow({
  item,
  onClick,
  onDelete,
}: Props) {
  const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.draft;

  return (
    <div
      onClick={() => onClick(item.id)}
      className='group flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 transition-colors cursor-pointer'
    >
      {/* Icon */}
      <div className='size-10 shrink-0 rounded-lg border border-slate-200 bg-white flex items-center justify-center'>
        <span className='material-symbols-outlined text-lg text-slate-500'>
          psychology
        </span>
      </div>

      {/* Content */}
      <div className='flex-1 min-w-0'>
        <h3 className='font-bold truncate group-hover:text-primary'>
          {item.title}
        </h3>
        <p className='text-sm text-slate-500'>
          {item.paper_title || "논문 정보 없음"}
        </p>
      </div>

      <Badge className={`${status.color} gap-1 font-bold shrink-0`}>
        <span className='material-symbols-outlined text-sm'>{status.icon}</span>
        {status.label}
      </Badge>

      <button
        onClick={e => onDelete(item.id, e)}
        className='size-9 shrink-0 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-colors'
      >
        <span className='material-symbols-outlined text-lg'>delete</span>
      </button>
    </div>
  );
}
