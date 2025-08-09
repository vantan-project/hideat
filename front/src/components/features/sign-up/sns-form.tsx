import { Input } from "@heroui/react";
import { SignUpFormProps } from "./sign-up-form";
import { LineIcon } from "@/components/shared/icons/line-icon";
import { InstagramIcon } from "@/components/shared/icons/instagram-icon";
import { TikTokIcon } from "@/components/shared/icons/tiktok-icon";
import { XIcon } from "@/components/shared/icons/x-icon";
import { FacebookIcon } from "@/components/shared/icons/facebook-icon";

export function SnsForm({
  formData,
  setFormData,
  inputClassNames,
}: SignUpFormProps) {
  const fieldClassNames = "flex items-center gap-1";
  const iconClassName = "w-8 h-8";
  return (
    <>
      <div className={fieldClassNames}>
        <LineIcon className={iconClassName} />
        <Input
          label="LINE URL"
          type="text"
          value={formData.restaurant.lineUrl}
          onChange={(e) =>
            setFormData({
              ...formData,
              restaurant: { ...formData.restaurant, lineUrl: e.target.value },
            })
          }
          classNames={inputClassNames}
          size="sm"
        />
      </div>

      <div className={fieldClassNames}>
        <InstagramIcon className={iconClassName} />
        <Input
          label="Instagram URL"
          type="text"
          value={formData.restaurant.instagramUrl}
          onChange={(e) =>
            setFormData({
              ...formData,
              restaurant: {
                ...formData.restaurant,
                instagramUrl: e.target.value,
              },
            })
          }
          classNames={inputClassNames}
          size="sm"
        />
      </div>

      <div className={fieldClassNames}>
        <TikTokIcon className={iconClassName} />
        <Input
          label="TikTok URL"
          type="text"
          value={formData.restaurant.tiktokUrl}
          onChange={(e) =>
            setFormData({
              ...formData,
              restaurant: { ...formData.restaurant, tiktokUrl: e.target.value },
            })
          }
          classNames={inputClassNames}
          size="sm"
        />
      </div>

      <div className={fieldClassNames}>
        <XIcon className={iconClassName} />
        <Input
          label="X URL"
          type="text"
          value={formData.restaurant.xUrl}
          onChange={(e) =>
            setFormData({
              ...formData,
              restaurant: { ...formData.restaurant, xUrl: e.target.value },
            })
          }
          classNames={inputClassNames}
          size="sm"
        />
      </div>

      <div className={fieldClassNames}>
        <FacebookIcon className={iconClassName} />
        <Input
          label="Facebook URL"
          type="text"
          value={formData.restaurant.facebookUrl}
          onChange={(e) =>
            setFormData({
              ...formData,
              restaurant: {
                ...formData.restaurant,
                facebookUrl: e.target.value,
              },
            })
          }
          classNames={inputClassNames}
          size="sm"
        />
      </div>
    </>
  );
}
