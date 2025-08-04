<?php

namespace App\Services;

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
                'url' => "https://places.googleapis.com/v1/{$photoResourceName}/media?key={$this->apiKey}&maxWidthPx=400",
            ];
        }

        return $photos;
    }
}
