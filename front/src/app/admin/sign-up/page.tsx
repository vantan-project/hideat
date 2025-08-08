"use client";

import { AuthSignUpRequest } from "@/api/auth-sign-up";
import { ImageForm } from "@/components/features/sign-up/image-form";
import { RestaurantForm } from "@/components/features/sign-up/restaurant-form";
import { SignUpFormProps } from "@/components/features/sign-up/sign-up-form";
import { SnsForm } from "@/components/features/sign-up/sns-form";
import { UserForm } from "@/components/features/sign-up/user-form";
import { Button } from "@heroui/react";
import clsx from "clsx";
import { ArrowLeft, Image, Link, User, Utensils } from "lucide-react";
import { useState } from "react";
import NextLink from "next/link";
import { LogoIcon } from "@/components/shared/icons/logo-icon";

type Flow = {
  key: number;
  step: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  form: React.ComponentType<SignUpFormProps>;
};

const flows: Array<Flow> = [
  { key: 1, step: "user", label: "ユーザー登録", icon: User, form: UserForm },
  {
    key: 2,
    step: "restaurant",
    label: "店舗登録",
    icon: Utensils,
    form: RestaurantForm,
  },
  { key: 3, step: "image", label: "画像登録", icon: Image, form: ImageForm },
  { key: 4, step: "sns", label: "SNS登録", icon: Link, form: SnsForm },
];

const inputClassNames = {
  input: "text-sm bg-white",
  inputWrapper: "bg-white border border-gray-300 focus:border-primary",
};

export default function () {
  const [currentKey, setCurrentKey] = useState(1);
  const [currentFlow, setCurrentFlow] = useState<Flow>(flows[0]);

  const [formData, setFormData] = useState<AuthSignUpRequest>({
    user: {
      name: "",
      email: "",
      password: "",
    },
    restaurant: {
      name: "",
      placeId: "",
      instagramUrl: "",
      tiktokUrl: "",
      xUrl: "",
      facebookUrl: "",
      lineUrl: "",
      tabelogUrl: "",
      gnaviUrl: "",
      imageFiles: [],
      categoryIds: [],
    },
  });

  if (!currentFlow) return;

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="flex gap-32 relative items-center pb-8">
        <div className="absolute px-4 h-6 w-full border-t-6 border-primary-right z-0" />
        {flows.map((flow) => (
          <div className="z-10" key={flow.step}>
            <button
              className={clsx(
                flow.key === currentKey ? "bg-primary" : "bg-primary-right",
                "w-16 h-16 rounded-full flex items-center justify-center text-white"
              )}
              onClick={() => {
                setCurrentFlow(flow);
                setCurrentKey(flow.key);
              }}
            >
              <flow.icon className="w-6 h-6" />
            </button>
            <p
              className={clsx(
                flow.key === currentKey ? "text-primary" : "text-primary-right",
                "text-xs mx-auto w-fit font-bold h-6 flex items-end"
              )}
            >
              {flow.label}
            </p>
          </div>
        ))}
      </div>
      {currentKey !== 1 && (
        <button
          className="fixed top-1/2 left-56 border p-4 bg-white rounded-full flex justify-center items-center"
          onClick={() => {
            if (currentKey === 1) return;
            const nextFlow = flows.find((flow) => flow.key === currentKey - 1);
            if (nextFlow) {
              setCurrentFlow(nextFlow);
              setCurrentKey(currentKey - 1);
            }
          }}
        >
          <ArrowLeft className="w-8 h-8" />
        </button>
      )}
      <form className="relative grid grid-cols-[3fr_5fr] w-[800px] h-[500px] overflow-hidden rounded-2xl bg-white">
        <div className="absolute top-0 w-[300px] h-full bg-primary flex flex-col items-center justify-center gap-2 text-white font-bold">
          <LogoIcon className="w-32 mb-32" />
          <h3 className="text-2xl">サインアップ</h3>
          <h2 className="text-4xl mb-32">STEP{currentFlow.key}</h2>
        </div>
        <div />
        <div className="pt-10 overflow-y-auto">
          <h1 className="text-center text-2xl font-bold">
            {currentFlow.label}
          </h1>

          <div className="py-5 px-12 flex flex-col gap-4">
            <currentFlow.form
              formData={formData}
              setFormData={setFormData}
              inputClassNames={inputClassNames}
            />

            {currentKey === 4 ? (
              <Button
                radius="full"
                fullWidth
                className="mt-5 bg-primary text-white"
              >
                サインアップ
              </Button>
            ) : (
              <Button
                radius="full"
                fullWidth
                className="mt-5 border-2 bg-white"
                onPress={() => {
                  const nextFlow = flows.find(
                    (flow) => flow.key === currentKey + 1
                  );
                  if (nextFlow) {
                    setCurrentFlow(nextFlow);
                    setCurrentKey(currentKey + 1);
                  }
                }}
              >
                次へ
              </Button>
            )}
          </div>
        </div>
      </form>

      <NextLink href="/admin/login" className="border-b mt-4 text-sm">
        アカウントをお持ちの方はコチラ
      </NextLink>
    </div>
  );
}
