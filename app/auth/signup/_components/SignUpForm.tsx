// SignupForm.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordField } from "./PasswordField";
import TermsCheckBox from "./TermsCheckBox";

interface Props {
  name: string;
  email: string;
  password: string;
  showPassword: boolean;
  confirmShowPassword: boolean;
  confirmPassword: string;
  agreed: boolean;
  isLoading: boolean;
  error: string | null;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onConfirmChange: (v: string) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onAgreeChange: (v: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SignupForm(props: Props) {
  return (
    <form onSubmit={props.onSubmit} className='flex flex-col gap-5'>
      {props.error && (
        <div className='p-4 bg-red-50 border border-red-200 rounded-xl'>
          {props.error}
        </div>
      )}

      <div className='flex flex-col gap-2'>
        <Label>이름</Label>
        <Input
          value={props.name}
          onChange={e => props.onNameChange(e.target.value)}
          className='h-13 px-5 rounded-2xl border-2 text-base'
        />
      </div>

      <div className='flex flex-col gap-2'>
        <Label>이메일</Label>
        <Input
          type='email'
          value={props.email}
          onChange={e => props.onEmailChange(e.target.value)}
          className='h-13 px-5 rounded-2xl border-2 text-base'
        />
      </div>

      <PasswordField
        value={props.password}
        confirmValue={props.confirmPassword}
        onChange={props.onPasswordChange}
        onConfirmChange={props.onConfirmChange}
        show={props.showPassword}
        confirmShow={props.confirmShowPassword}
        onToggle={props.onTogglePassword}
        onConfirmToggle={props.onToggleConfirmPassword}
      />

      <TermsCheckBox checked={props.agreed} onChange={props.onAgreeChange} />

      <Button type='submit' disabled={props.isLoading}>
        회원가입
      </Button>
    </form>
  );
}
