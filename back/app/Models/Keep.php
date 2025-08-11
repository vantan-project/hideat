<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Keep extends Model
{
    //
    protected $fillable = [
        'name',
        'is_google',
        'url',
        'location_id',
        'latitude',
        'longitude',
    ];
}
