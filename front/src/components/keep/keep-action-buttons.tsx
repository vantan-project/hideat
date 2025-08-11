import { Button } from "@heroui/react";
import { MousePointer, Trash2, X } from "lucide-react";

interface KeepActionButtonsProps {
  isSelectionMode: boolean;
  isAllSelected: boolean;
  selectedItems: number[];
  onToggleSelectionMode: () => void;
  onSelectAll: () => void;
  onCancelSelection: () => void;
  onDeleteSelected: () => void;
  showButtons: boolean;
}

export default function KeepActionButtons({
  isSelectionMode,
  isAllSelected,
  selectedItems,
  onToggleSelectionMode,
  onSelectAll,
  onCancelSelection,
  onDeleteSelected,
  showButtons,
}: KeepActionButtonsProps) {
  if (!showButtons) {
    return null;
  }

  return (
    <>
      {/* モード切替 & 全選択 */}
      <div className="flex gap-3 mb-6 fixed top-20 left-0 w-full px-4 z-30">
        <Button
          variant="bordered"
          className="flex-1 font-bold border-gray-300 text-gray-700 bg-white"
          isDisabled={isSelectionMode}
          startContent={<MousePointer className="w-4 h-4" />}
          onPress={onToggleSelectionMode}
        >
          選択削除モード
        </Button>
        <Button
          color="danger"
          className={`flex-1 font-bold ${
            isAllSelected ? "bg-green-500 text-white" : ""
          }`}
          startContent={<Trash2 className="w-4 h-4" />}
          onPress={onSelectAll}
        >
          {isAllSelected ? "全選択済み" : "全選択"}
        </Button>
      </div>

      {/* 選択アクション */}
      {isSelectionMode && (
        <div className="fixed bottom-20 left-4 right-4 z-40">
          <div className="flex gap-3">
            <Button
              variant="bordered"
              className="flex-1 border-red-500 text-red-500 bg-white font-bold"
              startContent={<X className="w-4 h-4" />}
              onPress={onCancelSelection}
            >
              キャンセル
            </Button>
            <Button
              color="danger"
              className={`flex-1 font-bold ${
                selectedItems.length === 0 ? "opacity-50" : ""
              }`}
              startContent={<Trash2 className="w-4 h-4" />}
              onPress={onDeleteSelected}
              disabled={selectedItems.length === 0}
            >
              削除 ({selectedItems.length})
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
