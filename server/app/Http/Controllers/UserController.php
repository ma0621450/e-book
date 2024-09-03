<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Models\Author;
use App\Models\Content;
use App\Models\ContentAccess;
use App\Models\Purchase;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Notification;



class UserController extends Controller
{
    public function getPublishedContent()
    {
        $userId = Auth::id();

        $purchasedContentIds = Purchase::where('user_id', $userId)
            ->pluck('content_id')
            ->toArray();

        $content = Content::with([
            'author',
            'author.user' => function ($query) {
                $query->whereNull('deleted_at'); // Exclude soft-deleted users
            }
        ])
            ->where('is_published', true)
            ->whereNotIn('id', $purchasedContentIds)
            ->get()
            ->filter(function ($content) {
                // Ensure the author and user are not null
                return $content->author && $content->author->user;
            });

        return response()->json($content, 200);
    }




    public function getSinglePost($id)
    {
        $content = Content::with(['author', 'author.user'])
            ->findOrFail($id);

        return response()->json($content, 200);
    }

    public function purchaseContent(Request $request)
    {
        $userId = Auth::id();
        $contentId = $request->input('content_id');


        if (!$contentId) {
            return response()->json(['message' => 'Content ID is missing'], 400);
        }

        $content = Content::find($contentId);
        if (!$content) {
            return response()->json(['message' => 'Content not found'], 404);
        }

        $alreadyPurchased = Purchase::where('user_id', $userId)
            ->where('content_id', $contentId)
            ->exists();

        if ($alreadyPurchased) {
            return response()->json(['message' => 'Content already purchased'], 400);
        }

        Purchase::create([
            'user_id' => $userId,
            'content_id' => $contentId,
        ]);

        $author = Author::where('id', $content->author_id)->first();
        $user = User::find($userId);
        if ($author) {
            Notification::create([
                'user_id' => $userId,
                'author_id' => $author->id,
                'message' => "Your content has been purchased by {$user->username}",
                'is_read' => false,
            ]);
        }

        return response()->json(['message' => 'Purchase successful'], 200);
    }



    public function getPurchasedContent(Request $request)
    {
        $userId = Auth::id();

        // Fetch purchased content with non-deleted authors and their users
        $purchasedContent = Purchase::where('user_id', $userId)
            ->with([
                'content.author.user' => function ($query) {
                    $query->whereNull('deleted_at'); // Exclude soft-deleted users
                }
            ])
            ->get();

        // Fetch free access content with non-deleted authors and their users
        $freeAccessContent = ContentAccess::where('user_id', $userId)
            ->with([
                'content.author.user' => function ($query) {
                    $query->whereNull('deleted_at'); // Exclude soft-deleted users
                }
            ])
            ->get()
            ->pluck('content');

        // Merge purchased and free access content and remove duplicates
        $allContent = $purchasedContent->pluck('content')->merge($freeAccessContent)->unique('id');

        // Format content
        $formattedContent = $allContent->map(function ($content) {
            // Ensure the author and user are not null
            if ($content->author && $content->author->user) {
                return [
                    'id' => $content->id,
                    'author_id' => $content->author_id,
                    'title' => $content->title,
                    'body' => $content->body,
                    'type' => $content->type,
                    'price' => $content->price,
                    'is_published' => $content->is_published,
                    'created_at' => $content->created_at->toIso8601String(),
                    'updated_at' => $content->updated_at->toIso8601String(),
                    'author' => [
                        'id' => $content->author->id,
                        'user_id' => $content->author->user_id,
                        'is_verified' => $content->author->is_verified,
                        'bio' => $content->author->bio,
                        'created_at' => $content->author->created_at->toIso8601String(),
                        'updated_at' => $content->author->updated_at->toIso8601String(),
                        'user' => [
                            'id' => $content->author->user->id,
                            'username' => $content->author->user->username,
                            'email' => $content->author->user->email,
                            'role_id' => $content->author->user->role_id,
                            'created_at' => $content->author->user->created_at->toIso8601String(),
                            'updated_at' => $content->author->user->updated_at->toIso8601String()
                        ]
                    ]
                ];
            }

            // If the author or user is missing, return null
            return null;
        })->filter(); // Remove any null values

        return response()->json($formattedContent);
    }



}