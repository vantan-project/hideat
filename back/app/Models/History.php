<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class History extends Model
{
    //
    protected $fillable = [
        'name',
        'is_google',
        'url',
        'location_id',
    ];
}
