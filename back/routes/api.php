<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\HistoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/token', function() {
        return response()->json([
            'success' => true,
        ]);
    });
    Route::prefix('user')->group(function () {
        Route::post('/', [UserController::class, 'store']);
        Route::get('/', [UserController::class, 'index']);
        Route::delete('/{id}', [UserController::class, 'destory']);
    });
});

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/sign-up', [AuthController::class, 'signUp']);
});

Route::prefix('image')->group(function () {
    Route::get('/', [ImageController::class, 'index']);
});

Route::prefix('category')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
});

Route::prefix('history')->group(function () {
    Route::post('/', [HistoryController::class, 'store']);
    Route::get('/', [HistoryController::class, 'index']);
});