import { CurriculumListItem } from "@/lib/types";
import CurriculumListItemRow from "./CurriculumListItem";

interface Props {
  items: CurriculumListItem[];
  onClick: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export default function CurriculumList({ items, onClick, onDelete }: Props) {
  return (
    <div className='space-y-3'>
      {items.map(item => (
        <CurriculumListItemRow
          key={item.id}
          item={item}
          onClick={onClick}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
