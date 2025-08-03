<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::insert([
            ['id' => 1, 'name' => '和食'],
            ['id' => 2, 'name' => '洋食'],
            ['id' => 3, 'name' => '中華'],
            ['id' => 4, 'name' => 'イタリアン'],
            ['id' => 5, 'name' => 'フレンチ'],
            ['id' => 6, 'name' => '韓国料理'],
            ['id' => 7, 'name' => 'エスニック'],
            ['id' => 8, 'name' => 'カレー'],
            ['id' => 9, 'name' => 'ラーメン'],
            ['id' => 10, 'name' => 'そば・うどん'],
            ['id' => 11, 'name' => '焼肉・ホルモン'],
            ['id' => 12, 'name' => '居酒屋'],
            ['id' => 13, 'name' => '寿司'],
            ['id' => 14, 'name' => 'カフェ'],
            ['id' => 15, 'name' => 'スイーツ'],
            ['id' => 16, 'name' => 'バー'],
            ['id' => 17, 'name' => 'ファストフード'],
            ['id' => 18, 'name' => 'ベーカリー'],
            ['id' => 19, 'name' => 'テイクアウト'],
            ['id' => 20, 'name' => 'ビュッフェ'],
        ]);
    }
}
