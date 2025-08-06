<?php

namespace App\Http\Controllers;

use App\Models\History;
use Illuminate\Http\Request;
use App\Http\Requests\HistoryStoreRequest;
use App\Http\Requests\HistoryIndexRequest;

class HistoryController extends Controller
{
    public function store(HistoryStoreRequest $request)
    {
        $data = $request->validated();

        $history = History::create([
            'is_google' => $data['isGoogle'],
            'url' => $data['url'],
            'location_id' => $data['locationId'],
        ]);

        return response()->json([
            'id' => $history->id,
            'success' => true,
        ], 201);
    }

    public function index(HistoryIndexRequest $request)
    {
        $histories = History::whereIn('id', $request->input('ids'))->get()->map(function ($history) {
            return [
                'id' => $history->id,
                'isGoogle' => $history->is_google,
                'url' => $history->url,
                'locationId' => $history->location_id,
            ];
        });

        return response()->json($histories);
    }
}
