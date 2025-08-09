import { Button, Input } from "@heroui/react";
import { SignUpFormProps } from "./sign-up-form";
import { CategorySelect } from "@/components/shared/category-select";
import { useState } from "react";
import { MapSelect } from "@/components/shared/map-select";

export function RestaurantForm({
  formData,
  setFormData,
  inputClassNames,
}: SignUpFormProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<Array<number>>(
    []
  );

  return (
    <>
      <Input
        label="店舗名"
        type="text"
        value={formData.restaurant.name}
        onChange={(e) =>
          setFormData({
            ...formData,
            restaurant: { ...formData.restaurant, name: e.target.value },
          })
        }
        classNames={inputClassNames}
        size="sm"
        isRequired
      />
      <MapSelect
        formData={formData}
        setFormData={setFormData}
        inputClassNames={inputClassNames}
      />
      <CategorySelect
        selectedCategoryIds={formData.restaurant.categoryIds}
        setSelectedCategoryIds={(ids) =>
          setFormData({
            ...formData,
            restaurant: { ...formData.restaurant, categoryIds: ids },
          })
        }
        isMulti
        classNames={inputClassNames}
      />

      <div className="flex gap-4">
        <Input
          label="ぐるナビ"
          type="text"
          value={formData.restaurant.gnaviUrl}
          onChange={(e) =>
            setFormData({
              ...formData,
              restaurant: { ...formData.restaurant, gnaviUrl: e.target.value },
            })
          }
          classNames={inputClassNames}
          size="sm"
        />
        <Input
          label="食べログ"
          type="text"
          value={formData.restaurant.tabelogUrl}
          onChange={(e) =>
            setFormData({
              ...formData,
              restaurant: {
                ...formData.restaurant,
                tabelogUrl: e.target.value,
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
