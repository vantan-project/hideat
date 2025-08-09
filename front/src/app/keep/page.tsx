"use client";

import { useState, useEffect } from "react";
import KeepCardGrid from "@/components/keep/keep-card-grid";
import KeepActionButtons from "@/components/keep/keep-action-buttons";
import Cookies from "js-cookie";
import { keepIndex, KeepIndexResponse } from "@/api/keep-index";

export default function KeepPage() {
  const [isLoading, setIsLoading] = useState(true);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [keepIds, setKeepIds] = useState<number[]>([]);
  const [keeps, setKeeps] = useState<KeepIndexResponse>([]);

  // データ取得
  useEffect(() => {
    const fetchKeepData = () => {
      try {
        setIsLoading(true);

        const keepIds = Cookies.get("keep");
        if (keepIds) {
          const parsedKeep = JSON.parse(keepIds);
          setKeepIds(parsedKeep);
        }
      } catch (err) {
        console.error("Keep data fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKeepData();
  }, []);

  useEffect(() => {
    const indexApi = async () => {
      const res = await keepIndex({ ids: keepIds });
      if (res) setKeeps(res);
    };

    indexApi();
  }, [keepIds]);

  useEffect(() => {
    if (keepIds.length === 0) return;
    const indexApi = async () => {
      try {
        const res = await keepIndex({ ids: keepIds });
        if (res) setKeeps(res);
      } catch (err) {
        console.error("History index fetch error:", err);
      }
    };

    indexApi();
  }, [keepIds]);

  const toggleSelectionMode = () => {
    // 選択削除モードは移行のみ（キャンセルはキャンセルボタンのみ）
    setIsSelectionMode(true);
    setIsAllSelected(false);
  };

  const selectAll = () => {
    const allIds = keeps.map((item) => item.id);
    setSelectedItems(allIds);
    setIsSelectionMode(true);
    setIsAllSelected(true);
  };

  const selectItem = (id: number) => {
    console.log(`selectItem called with id: ${id}`);
    const isSelected = selectedItems.includes(id);
    console.log(
      `isSelected: ${isSelected}, current selectedItems:`,
      selectedItems
    );

    if (isSelected) {
      // 選択解除
      const newSelectedItems = selectedItems.filter((itemId) => itemId !== id);
      setSelectedItems(newSelectedItems);
      console.log(`Removed item ${id}, new selectedItems:`, newSelectedItems);

      // 全選択状態を解除
      if (isAllSelected) {
        setIsAllSelected(false);
        console.log("All selection state cleared");
      }
    } else {
      // 選択追加
      const newSelectedItems = [...selectedItems, id];
      setSelectedItems(newSelectedItems);
      console.log(`Added item ${id}, new selectedItems:`, newSelectedItems);

      // すべて選択されたかチェック
      const allIds = keeps.map((item) => item.id);
      if (newSelectedItems.length === allIds.length) {
        setIsAllSelected(true);
        console.log("All items selected, setting isAllSelected to true");
      }
    }
  };

  const cancelSelection = () => {
    setSelectedItems([]);
    setIsSelectionMode(false);
    setIsAllSelected(false);
  };

  const deleteSelected = () => {
    const updatedKeptRestaurants = keeps
      .filter((item) => !selectedItems.includes(item.id))
      .map((item) => item.id);
    Cookies.set("keep", JSON.stringify(updatedKeptRestaurants));
    setKeepIds(updatedKeptRestaurants);

    setSelectedItems([]);
    setIsSelectionMode(false);
    setIsAllSelected(false);
  };

  const showButtons = !isLoading && keepIds.length > 0;

  return (
    <div className="min-h-screen">
      <div className="px-4 pt-20 pb-6">
        <p className="text-sm text-gray-600 mb-6">
          ※キープ一覧に追加したカードは1日で削除されます。
        </p>

        <KeepActionButtons
          isSelectionMode={isSelectionMode}
          isAllSelected={isAllSelected}
          selectedItems={selectedItems}
          onToggleSelectionMode={toggleSelectionMode}
          onSelectAll={selectAll}
          onCancelSelection={cancelSelection}
          onDeleteSelected={deleteSelected}
          showButtons={showButtons}
        />

        <KeepCardGrid
          restaurants={keeps}
          isLoading={isLoading}
          selectedItems={selectedItems}
          isSelectionMode={isSelectionMode}
          onSelect={selectItem}
        />
      </div>
    </div>
  );
}
