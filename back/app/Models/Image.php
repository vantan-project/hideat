<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $fillable = [
        'restaurant_id',
        'url',
    ];

    public function restaurant() {
        return $this->belongsTo(Restaurant::class);
    }
}
