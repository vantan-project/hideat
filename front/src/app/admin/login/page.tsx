"use client";

import { authLogin, AuthLoginRequest } from "@/api/auth-login";
import { LogoIcon } from "@/components/shared/icons/logo-icon";
import { PasswordInput } from "@/components/shared/password-input";
import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { useGlobalContext } from "@/hooks/use-global-context";

export default function LoginPage() {
  const { setIsLoggedIn, setRestaurantId } = useGlobalContext();
  const [formData, setFormData] = useState<AuthLoginRequest>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (field: keyof AuthLoginRequest, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // auth-login.tsのauthLogin関数を使用
    const response = await authLogin(formData);

    if (response.success) {
      // ログイン成功時の処理
      Cookies.set("authToken", response.authToken);
      setIsLoggedIn(true);
      setRestaurantId(response.restaurantId);
      addToast({
        title: "ログインに成功しました",
        color: "success",
      });
      router.push("/admin/restaurant");
    } else {
      response.messages.forEach((message) => {
        addToast({
          title: message,
          color: "danger",
        });
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-[600px] space-y-4">
        <Card className="w-full">
          {/* カードヘッダー */}
          <CardHeader className="text-white rounded-t-lg py-6 flex items-center justify-center bg-primary">
            <LogoIcon className="w-24 h-8 text-white" />
          </CardHeader>

          {/* カードボディ */}
          <CardBody className="p-6 flex flex-col justify-center">
            <div className="text-center mb-6 pt-10 pb-4">
              <h2 className="text-2xl font-bold text-gray-900">ログイン</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="メールアドレス"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                isRequired
                isDisabled={isLoading}
                classNames={{
                  input: "text-sm bg-white",
                  inputWrapper:
                    "bg-white border-2 border-gray-300 focus:border-primary",
                }}
              />

              <PasswordInput
                label="パスワード"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                isRequired
                isDisabled={isLoading}
                classNames={{
                  input: "text-sm bg-white",
                  inputWrapper:
                    "bg-white border-2 border-gray-300 focus:border-primary",
                }}
              />

              <div className="pt-2 pb-13">
                <Button
                  type="submit"
                  className="w-full text-white bg-primary"
                  isLoading={isLoading}
                >
                  {isLoading ? "ログイン中..." : "ログイン"}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* 下部リンク */}
        <div className="text-center">
          <Link
            href="/admin/sign-up"
            className="text-sm font-bold hover:text-red-800 underline"
          >
            新規登録はコチラ
          </Link>
        </div>
      </div>
    </div>
  );
}
