<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function getSingleAuthorProfile($authorId)
    {
        $author = Author::with('user')->find($authorId);

        if (!$author) {
            return response()->json(['error' => 'Author not found'], 404);
        }

        return response()->json($author);
    }


    public function getAuthorPosts($authorId)
    {
        $author = Author::find($authorId);

        if (!$author) {
            return response()->json(['error' => 'Author not found'], 404);
        }

        $posts = $author->contents;

        return response()->json($posts);
    }


}
