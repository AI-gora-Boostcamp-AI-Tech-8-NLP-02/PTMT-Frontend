// TermsCheckbox.tsx
import Link from "next/link";

interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function TermsCheckbox({ checked, onChange }: Props) {
  return (
    <label className='flex items-start gap-3 cursor-pointer'>
      <div className='relative mt-0.5'>
        <input
          type='checkbox'
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          required
          className='peer appearance-none size-6 border-2 rounded-lg checked:bg-primary'
        />
        <span className='material-symbols-outlined absolute inset-0 flex items-center justify-center text-primary-foreground text-sm opacity-0 peer-checked:opacity-100'>
          check
        </span>
      </div>

      <span className='text-sm text-muted-foreground'>
        <Link href='#' className='font-semibold hover:text-primary'>
          이용약관
        </Link>{" "}
        및{" "}
        <Link href='#' className='font-semibold hover:text-primary'>
          개인정보 처리방침
        </Link>
        에 동의합니다.
      </span>
    </label>
  );
}

export default TermsCheckbox;
