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
        $images = Image::with(['restaurant', 'restaurant.images'])
            ->whereIn('restaurant_id', $restaurantIds)
            ->inRandomOrder()
            ->limit($limit)
            ->get()
            ->map(function($item) {
                return [
                    'url' => $item->url,
                    'isGoogle' => false,
                    'restaurant' => [
                        'id' => $item->restaurant->id,
                        'name' => $item->restaurant->name,
                        'mapUrl' => $item->restaurant->map_url,

                        'latitude' => $item->restaurant->latitude,
                        'longitude' => $item->restaurant->longitude,

                        'instagramUrl' => $item->restaurant->instagram_url,
                        'tiktokUrl'   => $item->restaurant->tiktok_url,
                        'xUrl' => $item->restaurant->x_url,
                        'facebookUrl' => $item->restaurant->facebook_url,
                        'lineUrl' => $item->restaurant->line_url,
                        'tabelogUrl' => $item->restaurant->tabelog_url,
                        'gnaviUrl' => $item->restaurant->gnavi_url,

                        'imageUrls' => $item->restaurant->images->pluck('url'),
                    ],
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
            );

            $coordinates = $googleService->getCoordinatesBatch($googleImages->pluck('id')->toArray());
            $googleImages = $googleImages->map(function ($googleImage) use ($googleService, $coordinates) {
                return [
                    'url' => $googleImage['url'],
                    'isGoogle' => true,
                    'restaurant' => [
                        'id' => $googleImage['id'],
                        'name' => $googleImage['name'],
                        'mapUrl' => $googleService->getPlaceMapUrl($googleImage['id']),

                        'latitude' => $coordinates[$googleImage['id']]['latitude'] ?? null,
                        'longitude' => $coordinates[$googleImage['id']]['longitude'] ?? null,

                        'instagramUrl' => null,
                        'tiktokUrl'   => null,
                        'xUrl' => null,
                        'facebookUrl' => null,
                        'lineUrl' => null,
                        'tabelogUrl' => null,
                        'gnaviUrl' => null,

                        'imageUrls' =>$googleImage['photos'],
                    ],
                ];
            })
            ->toArray();

            $images = array_merge($images, $googleImages);
        }

        return response()->json($images);
    }
}
