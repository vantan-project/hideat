<?php

namespace App\Services;

use Illuminate\Http\Client\Pool;
use Illuminate\Support\Facades\Http;

class GoogleService
{
    protected string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.google_maps.api_key');
    }

    public function getPlaceMapUrl(string $placeId): string {
        return "https://www.google.com/maps/place/?q=place_id:{$placeId}";
    }

    public function getPlaceCoordinates(string $placeId): array
    {
        $response = Http::withHeaders([
            'Content-Type'    => 'application/json',
            'X-Goog-Api-Key'  => $this->apiKey,
            'X-Goog-FieldMask'=> 'location.latitude,location.longitude',
        ])->get("https://places.googleapis.com/v1/places/{$placeId}");

        $placeData = $response->json();

        return [
            'latitude' => $placeData['location']['latitude'] ?? null,
            'longitude' => $placeData['location']['longitude'] ?? null,
        ];
    }

    public function getPlacePhotos(float $lat, float $lng, int $radiusMeters, ?string $keyword, int $limit = 10): array
    {
        $response = Http::withHeaders([
            'Content-Type'    => 'application/json',
            'X-Goog-Api-Key'  => $this->apiKey,
            'X-Goog-FieldMask'=> 'places.id,places.displayName,places.photos',
        ])->post('https://places.googleapis.com/v1/places:searchText', [
            'textQuery'     => $keyword ?? "飲食店",
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
            $photosList = $place['photos'] ?? [];
            if (empty($photosList)) {
                continue;
            }

            $randomIndex = array_rand($photosList);
            $photoResourceName = $photosList[$randomIndex]['name'] ?? null;

            if (!$photoResourceName) {
                continue;
            }

            $photos[] = [
                'id' => $place['id'],
                "name" => $place['displayName']['text'],
                'url' => "https://places.googleapis.com/v1/{$photoResourceName}/media?key={$this->apiKey}&maxWidthPx=400",
                'photos' => collect($place['photos'])->map(function($photo) {
                    return "https://places.googleapis.com/v1/{$photo['name']}/media?key={$this->apiKey}&maxWidthPx=400";
                }),
            ];
        }

        return $photos;
    }

    public function getPlaceDetails(string $placeId): array
    {
        $response = Http::withHeaders([
            'Content-Type'    => 'application/json',
            'X-Goog-Api-Key'  => $this->apiKey,
            'X-Goog-FieldMask'=> 'id,displayName,photos,location.latitude,location.longitude',
        ])->get("https://places.googleapis.com/v1/places/{$placeId}");

        if ($response->failed()) {
            return [];
        }

        $placeData = $response->json();
        return [
            'id' => $placeData['id'],
            'name' => $placeData['displayName']['text'],
            'photos' => collect($placeData['photos'])->map(function($photo) {
                return "https://places.googleapis.com/v1/{$photo['name']}/media?key={$this->apiKey}&maxWidthPx=400";
            }),
            'latitude' => $placeData['location']['latitude'],
            'longitude' => $placeData['location']['longitude'],
        ];
    }

    public function getCoordinatesBatch(array $placeIds): array
    {
        $responses = Http::pool(fn (Pool $pool) => [
            ...array_map(fn ($placeId) =>
                $pool->withHeaders([
                    'Content-Type'    => 'application/json',
                    'X-Goog-Api-Key'  => $this->apiKey,
                    'X-Goog-FieldMask'=> 'location.latitude,location.longitude',
                ])->get("https://places.googleapis.com/v1/places/{$placeId}"),
            $placeIds)
        ]);

        return collect($responses)->mapWithKeys(function ($response, $index) use ($placeIds) {
            $placeId = $placeIds[$index];
            $data = $response->json();

            return [$placeId => [
                'latitude' => $data['location']['latitude'] ?? null,
                'longitude' => $data['location']['longitude'] ?? null,
            ]];
        })->toArray();
    }
}
