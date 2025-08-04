<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Image;
use App\Models\Restaurant;
use App\Services\GoogleService;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function index(Request $request) {
        $latitude = $request->input('latitude');
        $longitude = $request->input('longitude');
        $categoryId = $request->input('categoryId', null);
        $radius = $request->input('radius');
        $limit = $request->input('limit');

        $radiusKm = $radius / 1000; // キロ変換
        $latDiff = $radiusKm / 111; // 緯度方向の差
        $lonDiff = $radiusKm / (111 * cos(deg2rad($latitude))); // 経度方向の差

        $query = Restaurant::selectRaw(
                '*, (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance',
                [$latitude, $longitude, $latitude]
            )
            ->whereBetween('latitude', [$latitude - $latDiff, $latitude + $latDiff])
            ->whereBetween('longitude', [$longitude - $lonDiff, $longitude + $lonDiff])
            ->having('distance', '<=', $radiusKm);

        if ($categoryId) {
            $query->whereHas('categories', function ($q) use ($categoryId) {
                $q->where('categories.id', $categoryId);
            });
        }

        $restaurantIds = $query->pluck('id')->toArray();
        $images = Image::whereIn('restaurant_id', $restaurantIds)
            ->inRandomOrder()
            ->limit($limit)
            ->get(['id', 'url'])
            ->map(function($item) {
                return [
                    'id' => $item->id,
                    'url' => $item->url,
                    'isGoogle' => false,
                ];
            })
            ->toArray();

        if (count($images) < $limit) {
            $need = $limit - count($images);

            $categoryName = null;
            if ($categoryId) {
                $categoryName = Category::find($categoryId)->name;
            }

            $googleService = new GoogleService();
            $googleImages = collect(
                $googleService->getPlacePhotos($latitude, $longitude, $radius, $categoryName, $need)
            )->map(function ($googleImage) {
                return [
                    'id'       => $googleImage['id'],
                    'url'      => $googleImage['url'],
                    'isGoogle' => true,
                ];
            });

            $images = array_merge($images, $googleImages);
        }

        return response()->json($images);
    }
}
