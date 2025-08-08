import { categoryIndex } from "@/api/category-index";
import {
  Drawer,
  DrawerContent,
  Input,
  InputProps,
  useDisclosure,
} from "@heroui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";

type Props = {
  selectedCategoryIds: Array<number>;
  setSelectedCategoryIds: (ids: Array<number>) => void;
  isMulti?: boolean;
} & InputProps;

export function CategorySelect({
  selectedCategoryIds = [],
  setSelectedCategoryIds,
  isMulti = false,
  classNames,
}: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [categories, setCategories] = useState<
    Array<{ key: string; label: string }>
  >([]);

  useEffect(() => {
    const indexApi = async () => {
      const res = await categoryIndex();
      setCategories(
        res.map((category) => ({
          key: String(category.id),
          label: category.name,
        }))
      );
    };
    indexApi();
  }, []);

  const isSelect = (categoryKey: string) =>
    selectedCategoryIds.includes(Number(categoryKey));

  return (
    <>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="bottom">
        <DrawerContent className="h-[50vh]">
          <div className="p-4 flex flex-wrap gap-4">
            {categories.map((category) => (
              <button
                key={category.key}
                className={clsx(
                  isSelect(category.key)
                    ? "bg-black text-white"
                    : "border-black",
                  "py-2 px-12 border rounded-2xl"
                )}
                onClick={() => {
                  !isMulti && onOpenChange();

                  if (isSelect(category.key)) {
                    setSelectedCategoryIds(
                      selectedCategoryIds.filter(
                        (id) => id !== Number(category.key)
                      )
                    );
                    return;
                  }

                  setSelectedCategoryIds(
                    isMulti
                      ? [...selectedCategoryIds, Number(category.key)]
                      : [Number(category.key)]
                  );
                }}
              >
                {category.label}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
      <Input
        label="カテゴリー"
        onClick={() => onOpen()}
        readOnly
        value={categories
          .filter((category) =>
            selectedCategoryIds.includes(Number(category.key))
          )
          .map((category) => category.label)
          .join(", ")}
        size="sm"
        classNames={classNames}
      />
    </>
  );
}
