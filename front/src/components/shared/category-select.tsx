import { categoryIndex } from "@/api/category-index";
import { Drawer, DrawerContent, Input, useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";

type Props = {
  selectedCategoryId: number | null;
  setSelectedCategoryId: (ids: number | null) => void;
};

export function CategorySelect({
  selectedCategoryId,
  setSelectedCategoryId,
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

  return (
    <>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="bottom">
        <DrawerContent className="h-[50vh]">
          <div className="p-4 flex flex-wrap gap-4">
            {categories.map((category) => (
              <button
                className="py-2 px-12 border border-black rounded-2xl"
                onClick={() => {
                  setSelectedCategoryId(Number(category.key));
                  onOpenChange();
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
        value={
          categories.find((c) => c.key === String(selectedCategoryId))?.label ||
          ""
        }
        size="sm"
      />
    </>
  );
}
