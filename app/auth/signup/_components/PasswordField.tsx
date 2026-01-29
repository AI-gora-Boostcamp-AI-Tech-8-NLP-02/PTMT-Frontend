// PasswordField.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  confirmValue: string;
  onChange: (v: string) => void;
  onConfirmChange: (v: string) => void;
  show: boolean;
  confirmShow: boolean;
  onToggle: () => void;
  onConfirmToggle: () => void;
  disabled?: boolean;
}

export function PasswordField({
  value,
  confirmValue,
  onChange,
  onConfirmChange,
  show,
  confirmShow,
  onToggle,
  onConfirmToggle,
  disabled,
}: Props) {
  const isMismatch = confirmValue.length > 0 && value !== confirmValue;

  return (
    <div className='flex flex-col gap-4'>
      {/* 비밀번호 */}
      <div className='flex flex-col gap-2'>
        <Label className='text-base font-semibold'>비밀번호</Label>
        <div className='relative'>
          <Input
            type={show ? "text" : "password"}
            value={value}
            onChange={e => onChange(e.target.value)}
            disabled={disabled}
            minLength={8}
            required
            className='h-13 px-5 pr-14 rounded-2xl border-2 text-base'
          />
          <button
            type='button'
            onClick={onToggle}
            className='
              absolute right-2 top-1/2 -translate-y-1/2
              h-10 w-10 flex items-center justify-center
              rounded-lg hover:bg-slate-100
            '
          >
            <span className='material-symbols-outlined'>
              {show ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
      </div>

      {/* 비밀번호 확인 */}
      <div className='flex flex-col gap-2'>
        <Label className='text-base font-semibold'>비밀번호 확인</Label>
        <div className='relative'>
          <Input
            type={confirmShow ? "text" : "password"}
            value={confirmValue}
            onChange={e => onConfirmChange(e.target.value)}
            disabled={disabled}
            required
            className={cn(
              "h-13 px-5 rounded-2xl border-2 text-base",
              isMismatch && "border-red-500 focus-visible:ring-red-500"
            )}
          />

          <button
            type='button'
            onClick={onConfirmToggle}
            className='
              absolute right-2 top-1/2 -translate-y-1/2
              h-10 w-10 flex items-center justify-center
              rounded-lg hover:bg-slate-100
            '
          >
            <span className='material-symbols-outlined'>
              {confirmShow ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
        {isMismatch && (
          <p className='text-sm text-red-500'>비밀번호가 일치하지 않습니다</p>
        )}
      </div>
    </div>
  );
}

export default PasswordField;
