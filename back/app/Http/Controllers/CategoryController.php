<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index() {
        $categories = Category::all() -> map(function($category) {
            return [
                "id" => $category["id"],
                "name" => $category["name"]
            ];
        });
        // dd($categories -> toArray());

        return response() -> json(
            $categories
        );
    }
}
