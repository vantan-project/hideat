<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(){
        $restaurantId = request()->user()->restaurant_id;
        $users = User::where('restaurant_id', $restaurantId)->get()->map(function($user) {
            return [
                "name" => $user["name"],
                "email" => $user["email"]
            ];
        });

        return response() -> json(
            $users
        );

    }

    public function destory($id) {
        $user = request()->user();

        if ($user->id === $id) {
            return response()->json([
                'success' => false,
                'messages' => ["自分自身を削除することはできません。"]
            ], 403);
        }
        $targetUser = User::where('id', $id)->where('restaurant_id', $user->restaurantId);

        $targetUser->delete();
        return response()->json([
            'success' => true,
            'messages' => ["ユーザーを削除しました。"]
        ], 200);
    }

    public function store(StoreUserRequest $request){
        $restaurantId = request()->user()->restaurant_id;

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'restaurant_id' => $restaurantId,
        ]);

        return response()->json([
            'success' => true,
            'messages' => 'ユーザーを登録しました。'
        ], 201);
    }
}
