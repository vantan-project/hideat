<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use App\Services\GoogleService;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    public function show(Request $request, $id) {

        if ($request->boolean('isGoogle')) {
            $googleService = new GoogleService();
            $restaurant = $googleService->getPlaceDetails($id);
            return response()->json([
                'id' => $id,
                'name' => $restaurant['name'] ?? null,
                'mapUrl' => $googleService->getPlaceMapUrl($id),
                'latitude' => $restaurant['latitude'] ?? null,
                'longitude' => $restaurant['longitude'] ?? null,
                'instagramUrl' => $restaurant['instagram_url'] ?? null,
                'tiktokUrl' => $restaurant['tiktok_url'] ?? null,
                'xUrl' => $restaurant['x_url'] ?? null,
                'facebookUrl' => $restaurant['facebook_url'] ?? null,
                'lineUrl' => $restaurant['line_url'] ?? null,
                'tabelogUrl' => $restaurant['tabelog_url'] ?? null,
                'gnaviUrl' => $restaurant['gnavi_url'] ?? null,
                'imageUrls' => $restaurant['photos'] ?? [],
                'categoryIds' => $restaurant['categories'] ?? null,
            ]);
        } else {
            $restaurantData = Restaurant::find($id);
            return response()->json([
                'id' => $restaurantData->id,
                'name' => $restaurantData->name,
                'mapUrl' => $restaurantData->map_url,
                'latitude' => $restaurantData->latitude,
                'longitude' => $restaurantData->longitude,
                'instagramUrl' => $restaurantData->instagram_url,
                'tiktokUrl' => $restaurantData->tiktok_url,
                'xUrl' => $restaurantData->x_url,
                'facebookUrl' => $restaurantData->facebook_url,
                'lineUrl' => $restaurantData->line_url,
                'tabelogUrl' => $restaurantData->tabelog_url,
                'gnaviUrl' => $restaurantData->gnavi_url,
                'imageUrls' => $restaurantData->images()->pluck('url')->toArray(),
                'categoryIds' => $restaurantData->categories()->pluck('id')->toArray(),
            ]);
        }
    }
}
