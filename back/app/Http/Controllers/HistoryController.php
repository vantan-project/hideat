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

    public function index(HistoryIndexRequest $request)
    {
        $ids = $request->input('ids');
        $histories = History::whereIn('id', $ids)->get()->keyBy('id');
        $sorted = collect($ids)->map(function ($id) use ($histories) {
            $history = $histories->get($id);
            return [
                'id' => $history->id,
                'name' => $history->name,
                'isGoogle' => $history->is_google,
                'url' => $history->url,
                'locationId' => $history->location_id,
            ];
        });

        return response()->json($sorted);
    }

    public function keep($id)
    {
        $history = History::findOrFail($id);

        $history->is_keeped = true;
        $history->save();
    }
}
