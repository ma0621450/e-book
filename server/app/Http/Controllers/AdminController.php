<?php

namespace App\Http\Controllers;

use App\Models\Author;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getAuthors()
    {
        $authors = Author::with([
            'user' => function ($query) {
                $query->withTrashed();
            }
        ])->get();

        return response()->json($authors);
    }

    public function verifyAuthor($id)
    {
        $author = Author::find($id);

        if (!$author) {
            return response()->json(['error' => 'Author not found'], 404);
        }

        $author->is_verified = true;
        $author->save();

        return response()->json(['success' => 'Author verified successfully']);
    }

    public function blockUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'User blocked successfully']);
    }

    public function unblockUser($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->restore();
        return response()->json(['message' => 'User unblocked successfully']);
    }

}