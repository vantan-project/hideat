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
            $place = $googleService->getPlaceCoordinates($id);
            $map = $googleService->getPlaceMapUrl($id);
            $restaurant = $googleService->getPlacePhotos($place['latitude'], $place['longitude'], 0, null, 1);
            return response()->json([
                'name' => $restaurant[0]['name'] ?? null,
                'mapUrl' => $map,
                'instagramUrl' => $restaurant[0]['instagram_url'] ?? null,
                'tiktokUrl' => $restaurant[0]['tiktok_url'] ?? null,
                'xUrl' => $restaurant[0]['x_url'] ?? null,
                'facebookUrl' => $restaurant[0]['facebook_url'] ?? null,
                'lineUrl' => $restaurant[0]['line_url'] ?? null,
                'tabelogUrl' => $restaurant[0]['tabelog_url'] ?? null,
                'gnaviUrl' => $restaurant[0]['gnavi_url'] ?? null,
                'imageUrls' => $restaurant[0]['photos'] ?? [],
                'categoryIds' => $restaurant[0]['categories'] ?? null,
            ]);
        } else {
            $restaurantData = Restaurant::find($id);
            return response()->json([
                'name' => $restaurantData->name,
                'mapUrl' => $restaurantData->map_url,
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
