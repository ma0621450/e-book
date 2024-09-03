<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = ['username', 'email', 'password', 'role_id'];

    protected $hidden = ['password'];
    protected $dates = ['deleted_at'];

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function author()
    {
        return $this->hasOne(Author::class);
    }

    public function purchases()
    {
        return $this->hasMany(Purchase::class);
    }

    public function contentAccess()
    {
        return $this->hasMany(ContentAccess::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}
