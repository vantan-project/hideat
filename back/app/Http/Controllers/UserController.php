<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    //
    public function store(StoreUserRequest $request){
        $restaurantId = Auth::user()->restaurant_id;

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'restaurant_id' => $restaurantId,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'ユーザーを登録しました。'
        ], 201);
    }
}