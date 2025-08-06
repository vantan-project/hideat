"use client";

import { useState, useEffect } from "react";
import { keepIndex, type KeepRestaurant } from "@/api/keep-index";
import KeepHeader from "@/components/keep/keep-header";
import KeepCardGrid from "@/components/keep/keep-card-grid";
import KeepActionButtons from "@/components/keep/keep-action-buttons";
import KeepHomeButton from "@/components/keep/keep-home-button";

export default function KeepPage() {
  const [keptRestaurants, setKeptRestaurants] = useState<KeepRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);

  // データ取得
  useEffect(() => {
    const fetchKeepData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await keepIndex();
        
        if (response.success) {
          setKeptRestaurants(response.data);
        } else {
          setError(response.message || "データの取得に失敗しました");
        }
      } catch (err) {
        setError("データの取得中にエラーが発生しました");
        console.error("Keep data fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKeepData();
  }, []);

  const toggleSelectionMode = () => {
    if (isSelectionMode) {
      // 選択モードを終了
      setSelectedItems([]);
      setIsSelectionMode(false);
      setIsAllSelected(false);
    } else {
      // 選択モードを開始
      setIsSelectionMode(true);
      setIsAllSelected(false);
    }
  };

  const selectAll = () => {
    const allIds = keptRestaurants.map(item => item.id);
    setSelectedItems(allIds);
    setIsSelectionMode(true);
    setIsAllSelected(true);
  };

  const selectItem = (id: number) => {
    console.log(`selectItem called with id: ${id}`);
    const isSelected = selectedItems.includes(id);
    console.log(`isSelected: ${isSelected}, current selectedItems:`, selectedItems);
    
    if (isSelected) {
      // 選択解除
      const newSelectedItems = selectedItems.filter(itemId => itemId !== id);
      setSelectedItems(newSelectedItems);
      console.log(`Removed item ${id}, new selectedItems:`, newSelectedItems);
      
      // 全選択状態を解除
      if (isAllSelected) {
        setIsAllSelected(false);
        console.log('All selection state cleared');
      }
    } else {
      // 選択追加
      const newSelectedItems = [...selectedItems, id];
      setSelectedItems(newSelectedItems);
      console.log(`Added item ${id}, new selectedItems:`, newSelectedItems);
      
      // すべて選択されたかチェック
      const allIds = keptRestaurants.map(item => item.id);
      if (newSelectedItems.length === allIds.length) {
        setIsAllSelected(true);
        console.log('All items selected, setting isAllSelected to true');
      }
    }
  };

  const cancelSelection = () => {
    setSelectedItems([]);
    setIsSelectionMode(false);
    setIsAllSelected(false);
  };

  const deleteSelected = () => {
    // 削除処理（ここでは省略）
    setSelectedItems([]);
    setIsSelectionMode(false);
    setIsAllSelected(false);
  };

  const showButtons = !isLoading && !error && keptRestaurants.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <KeepHeader />
      
      <div className="bg-white px-4 py-6">
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
          restaurants={keptRestaurants}
          isLoading={isLoading}
          error={error}
          selectedItems={selectedItems}
          isSelectionMode={isSelectionMode}
          onSelect={selectItem}
        />
      </div>

      <KeepHomeButton />
    </div>
  );
}
