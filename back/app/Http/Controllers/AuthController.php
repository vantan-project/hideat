<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthLoginRequest;
use App\Http\Requests\AuthSignUpRequest;
use App\Models\Restaurant;
use App\Services\GoogleService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(AuthLoginRequest $request) {
        $email = $request->input('email');
        $passowrd = $request->input('password');

        if (Auth::attempt(['email' => $email, 'password' => $passowrd])) {
            $authUser = request()->user();

            return response()->json([
                'success' => true,
                'messages' => ['ログインに成功しました。'],
                'authToken' => $authUser->createToken('authToken')->plainTextToken,
            ]);
        }

        return response()->json([
            'success' => false,
            'messages' => ['メールアドレスかパスワードが正しくありません。'],
        ], 401);
    }

    public function signUp(AuthSignUpRequest $request) {
        $user = $request->input('user');
        $restaurant = $request->input('restaurant');

        $createdUser = DB::transaction(function () use ($user, $restaurant) {
            $googleService = new GoogleService();
            $place = $googleService->getPlaceCoordinates($restaurant["placeId"]);
            $categoryIds = $restaurant['categoryIds'];

            $createdRestaurant = Restaurant::create([
                'name' => $restaurant['name'],
                'map_url' => $googleService->getPlaceMapUrl($restaurant["placeId"]),
                'latitude' => $place['latitude'],
                'longitude' => $place['longitude'],
                'instagram_url' => data_get($restaurant, 'instagramUrl', null),
                'tiktok_url' => data_get($restaurant, 'tiktokUrl', null),
                'x_url' => data_get($restaurant, 'xUrl', null),
                'facebook_url' => data_get($restaurant, 'facebookUrl', null),
                'line_url' => data_get($restaurant, 'lineUrl', null),
                'tabelog_url' => data_get($restaurant, 'tabelogUrl', null),
                'gnavi_url' => data_get($restaurant, 'gnaviUrl', null),
            ]);

            $createdRestaurant->categories()->attach($categoryIds);

            return $createdRestaurant->users()->create([
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => Hash::make($user['password'])
            ]);
        });

        return response()->json([
            "success" => true,
            "messages" => ["登録が完了しました。"],
            "authToken" => $createdUser->createToken('authToken')->plainTextToken,
        ]);
    }

    public function destroy() {
        $restaurant = request()->user()->restaurant;

        if (!$restaurant) {
            return response()->json([
                "success" => false,
                "messages" => ["レストランが見つかりません。"]
            ], 404);
        }
        
        try {
            $restaurant->delete();

            return response()->json([
                "success" => true,
                "messages" => ["削除が完了しました。"]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "messages" => ["削除に失敗しました。"]
            ], 500);
        }
    }
}