<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Content extends Model
{
    use Searchable;
    use HasFactory;

    protected $fillable = ['author_id', 'title', 'body', 'type', 'price', 'is_published', 'cover_img'];

    public function author()
    {
        return $this->belongsTo(Author::class);
    }

    public function purchases()
    {
        return $this->hasMany(Purchase::class);
    }

    public function contentAccess()
    {
        return $this->hasMany(ContentAccess::class);
    }
}
