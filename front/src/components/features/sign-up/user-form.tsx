import { PasswordInput } from "@/components/shared/password-input";
import { Input } from "@heroui/react";
import { useState } from "react";
import { SignUpFormProps } from "./sign-up-form";

export function UserForm({
  formData,
  setFormData,
  inputClassNames,
}: SignUpFormProps) {
  const [passwordConfirm, setPasswordConfirm] = useState("");

  return (
    <>
      <Input
        label="名前"
        type="text"
        value={formData.user.name}
        onChange={(e) =>
          setFormData({
            ...formData,
            user: { ...formData.user, name: e.target.value },
          })
        }
        isRequired
        classNames={inputClassNames}
        size="sm"
      />
      <Input
        label="メールアドレス"
        type="email"
        value={formData.user.email}
        onChange={(e) =>
          setFormData({
            ...formData,
            user: { ...formData.user, email: e.target.value },
          })
        }
        isRequired
        classNames={inputClassNames}
        size="sm"
      />
      <PasswordInput
        label="パスワード"
        value={formData.user.password}
        onChange={(e) =>
          setFormData({
            ...formData,
            user: { ...formData.user, password: e.target.value },
          })
        }
        isRequired
        classNames={inputClassNames}
        size="sm"
      />
      <PasswordInput
        label="パスワード（確認）"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        isRequired
        classNames={inputClassNames}
        size="sm"
      />
    </>
  );
}
