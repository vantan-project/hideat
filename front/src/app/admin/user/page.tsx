"use client";

import { useEffect, useState } from "react";
import { userIndex, UserIndexResponse } from "@/api/user-index";
import { userDestroy } from "@/api/user-destroy";
import { userStore } from "@/api/user-store";
import { addToast, Input, Spinner } from "@heroui/react";
import { PasswordInput } from "@/components/shared/password-input";
import { Trash2 } from "lucide-react";

export default function UserPage() {
  const [users, setUsers] = useState<UserIndexResponse>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: number; name: string } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", passwordConfirm: "" });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const userData = await userIndex();
      setUsers(userData);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      addToast({
        title: "ユーザー一覧の取得に失敗しました",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user: { id: number; name: string }) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete || isProcessing) return;
    setIsProcessing(true);
    try {
      const result = await userDestroy(userToDelete.id);
      if (result.success) {
        setUsers(users.filter(user => user.id !== userToDelete.id));
        addToast({
          title: "ユーザーを削除しました",
          color: "success",
        });
      } else {
        result.messages.forEach((message) => {
          addToast({
            title: message,
            color: "danger",
          });
        });
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      addToast({
        title: "ユーザーの削除に失敗しました",
        color: "danger",
      });
    } finally {
      setIsProcessing(false);
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleAddUser = () => {
    setShowAddModal(true);
  };

  const handleAddConfirm = async () => {
    if (isProcessing) return;
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.passwordConfirm) {
      addToast({
        title: "ユーザー名、メールアドレス、パスワードを入力してください",
        color: "danger",
      });
      return;
    }

    if (newUser.password !== newUser.passwordConfirm) {
      addToast({
        title: "パスワードが一致しません",
        color: "danger",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await userStore({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
      });
      
      if (result.success) {
        await fetchUsers(); // Refresh the user list
        addToast({
          title: "ユーザーを追加しました",
          color: "success",
        });
      } else {
        result.messages.forEach((message) => {
          addToast({
            title: message,
            color: "danger",
          });
        });
      }
    } catch (error) {
      console.error("Failed to add user:", error);
      addToast({
        title: "ユーザーの追加に失敗しました",
        color: "danger",
      });
    } finally {
      setIsProcessing(false);
      setShowAddModal(false);
      setNewUser({ name: "", email: "", password: "", passwordConfirm: "" });
    }
  };

  const handleAddCancel = () => {
    setShowAddModal(false);
    setNewUser({ name: "", email: "", password: "", passwordConfirm: "" });
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (showDeleteModal) {
        handleDeleteCancel();
      } else if (showAddModal) {
        handleAddCancel();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">ユーザーリスト</h1>
      
      <div className="grid grid-cols-3 gap-4">
        {/* Add New User Card */}
        <div
          onClick={handleAddUser}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          <span className="text-gray-600 font-medium">新規追加</span>
        </div>

        {/* User Cards */}
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 relative"
          >
            <div className="mb-2">
              <h3 className="font-medium text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            
            <button
              onClick={() => handleDeleteClick(user)}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-red-500 hover:bg-red-600 text-white rounded-md w-10 h-10 flex items-center justify-center transition-colors shadow"
              title="ユーザーを削除"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div 
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={handleBackgroundClick}
        >
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 relative border border-blue-300">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleDeleteConfirm();
              }}
            >
              <div className="text-center mb-6">
                <p className="text-gray-900 text-lg">
                  {userToDelete.name}を削除しますか？
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  type="submit"
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center min-w-[80px]"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Spinner size="sm" color="white" className="mr-2" />
                  ) : null}
                  削除
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCancel}
                  className="border border-blue-500 text-blue-500 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                  disabled={isProcessing}
                >
                  戻る
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={handleBackgroundClick}
        >
          <div className="bg-white rounded-lg p-6 w-1/3 mx-4 shadow-lg">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddConfirm();
              }}
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">新規追加</h2>
              </div>
              <div className="space-y-4 mb-6">
                <Input
                  type="text"
                  label="ユーザー名"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
                <Input
                  type="email"
                  label="メールアドレス"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                <PasswordInput
                  label="パスワード"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
                <PasswordInput
                  label="パスワード（確認）"
                  value={newUser.passwordConfirm}
                  onChange={(e) => setNewUser({ ...newUser, passwordConfirm: e.target.value })}
                />
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center min-w-[80px]"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Spinner size="sm" color="white" className="mr-2" />
                  ) : null}
                  追加
                </button>
                <button
                  type="button"
                  onClick={handleAddCancel}
                  className="border border-blue-500 text-blue-500 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                  disabled={isProcessing}
                >
                  戻る
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
