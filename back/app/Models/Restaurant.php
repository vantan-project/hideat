<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    protected $fillable = [
        'name',
        'latitude',
        'longitude',
        'map_url',
        'instagram_url',
        'tiktok_url',
        'x_url',
        'facebook_url',
        'line_url',
        'tabelog_url',
        'gnavi_url',
    ];

    public function users() {
        return $this->hasMany(User::class);
    }

    public function categories() {
        return $this->belongsToMany(Category::class, 'restaurant_categories');
    }
}
