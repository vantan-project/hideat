<?php

namespace App\Http\Controllers;
use App\Models\Keep;
use Illuminate\Http\Request;
use App\Http\Requests\KeepStoreRequest;
use App\Http\Requests\KeepIndexRequest;

class KeepController extends Controller
{
    public function store(KeepStoreRequest $request)
    {
        $data = $request->validated();

        $keep = Keep::create([
            'name' => $data['name'],
            'is_google' => $data['isGoogle'],
            'url' => $data['url'],
            'location_id' => $data['locationId'],
        ]);

        return response()->json([
            'id' => $history->id,
            'success' => true,
        ], 201);
    }

    public function index(KeepIndexRequest $request)
    {
        $ids = $request->input('ids');
        $keeps = Keep::whereIn('id', $ids)->get()->keyBy('id');
        $sorted = collect($ids)->map(function ($id) use ($keeps) {
            $keep = $keeps->get($id);
            return [
                'id' => $keep->id,
                'name' => $keep->name,
                'isGoogle' => $keep->is_google,
                'url' => $keep->url,
                'locationId' => $keep->location_id,
            ];
        });

        return response()->json($sorted);
    }
}
