<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Image;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

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

            $googleImages = $this->fetchGooglePlacePhotos($latitude, $longitude, $radius, $categoryName, $need);

            $images = array_merge($images, $googleImages);
        }

        return response()->json($images);
    }

    private function fetchGooglePlacePhotos($lat, $lng, $radiusMeters, $keyword, $limit): array
    {
        $apiKey = config('services.google_maps.api_key');
        $response = Http::withHeaders([
            'Content-Type'    => 'application/json',
            'X-Goog-Api-Key'  => $apiKey,
            'X-Goog-FieldMask'=> 'places.id,places.photos',
        ])->post('https://places.googleapis.com/v1/places:searchText', [
            'textQuery'     => $keyword ?? null,
            'includedType'  => 'restaurant',
            'languageCode'  => 'ja',
            'locationBias'  => [
                'circle' => [
                    'center' => [
                        'latitude'  => $lat,
                        'longitude' => $lng,
                    ],
                    'radius' => $radiusMeters,
                ],
            ],
        ]);

        if ($response->failed()) {
            return [];
        }

        $places = collect($response->json('places'))->shuffle()->take($limit);
        $photos = [];
        foreach ($places as $place) {
            $photosList = $place['photos'];
            $randomIndex = array_rand($photosList);
            $photoResourceName = $photosList[$randomIndex]['name'] ?? null;

            if (!$photoResourceName) {
                continue;
            }

            $photos[] = [
                'id' => $place['id'],
                'url' => "https://places.googleapis.com/v1/{$photoResourceName}/media?key={$apiKey}&maxWidthPx=400",
                'isGoogle' => true,
            ];
        }

        return $photos;
    }
}
