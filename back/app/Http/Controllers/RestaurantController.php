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
            $restaurant = Restaurant::find($id);
            if ($restaurant === null) {
                return response()->json(['error' => 'Restaurant not found'], 404);
            }
            $restaurantImages = $googleService->getPlacePhotos($restaurant->latitude, $restaurant->longitude, 5000, null, 10);
            return response()->json([
                'name' => $restaurant->name,
                'mapUrl' => $restaurant->map_url,
                'instagramUrl' => $restaurant->instagram_url,
                'tiktokUrl' => $restaurant->tiktok_url,
                'xUrl' => $restaurant->x_url,
                'facebookUrl' => $restaurant->facebook_url,
                'lineUrl' => $restaurant->line_url,
                'tabelogUrl' => $restaurant->tabelog_url,
                'gnaviUrl' => $restaurant->gnavi_url,
                'imageUrls' => $restaurantImages,
                'categoryIds' => $restaurant->categories->pluck('id')->toArray(),
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
