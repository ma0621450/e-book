<?php

namespace App\Http\Controllers;
use App\Models\Author;
use App\Models\Content;
use App\Models\ContentAccess;
use App\Models\Notification;
use App\Models\User;
use Auth;
use Illuminate\Http\Request;
use Storage;
use Validator;



class AuthorController extends Controller
{

    public function createContent(Request $request)
    {
        $request->validate([
            'title' => 'required|string|min:3|unique:contents',
            'body' => 'required|string|min:200',
            'type' => 'required|string|in:Article,Novel,Digest',
            'price' => 'required|numeric',
            'cover_img' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $userId = Auth::id();
        $author = Author::where('user_id', $userId)->first();

        if (!$author) {
            return response()->json(['error' => 'Author not found'], 404);
        }
        if (!$author->is_verified) {
            return response()->json(['error' => 'Author not verified'], 403);
        }

        $content = Content::create([
            'author_id' => $author->id,
            'title' => $request->title,
            'body' => $request->body,
            'type' => $request->type,
            'price' => $request->price,
            'is_published' => false,
        ]);

        if ($request->hasFile('cover_img')) {
            $coverImagePath = $request->file('cover_img')->store('cover_images', 'public');
            $content->cover_img = $coverImagePath;
            $content->save();
        }

        return response()->json(['message' => 'Content created successfully', 'content' => $content], 201);
    }

    public function updateContent(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'type' => 'required|string|in:Article,Digest,Novel',
            'price' => 'required|numeric|min:0',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        try {
            $content = Content::findOrFail($id);

            $content->title = $request->input('title');
            $content->body = $request->input('body');
            $content->type = $request->input('type');
            $content->price = $request->input('price');

            if ($request->hasFile('cover_image')) {
                if ($content->cover_image) {
                    Storage::disk('public')->delete($content->cover_image);
                }

                $coverImagePath = $request->file('cover_image')->store('cover_images', 'public');
                $content->cover_image = $coverImagePath;
            }

            $content->save();

            return response()->json([
                'message' => 'Content updated successfully',
                'content' => $content
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update content'
            ], 500);
        }
    }


    public function editBio(Request $request)
    {
        $request->validate([
            'bio' => 'required|string|min:200',
            'pfp' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = Auth::user();
        $author = Author::where('user_id', $user->id)->first();

        if ($author) {
            $author->bio = $request->bio;

            if ($request->hasFile('pfp')) {
                if ($author->pfp) {
                    Storage::disk('public')->delete($author->pfp);
                }

                $pfpPath = $request->file('pfp')->store('profile_photos', 'public');
                $author->pfp = $pfpPath;
            }

            $author->save();
        }

        return response()->json([
            'message' => 'Profile updated successfully',
            'bio' => $author->bio,
            'pfp' => $author->pfp
        ], 200);
    }


    public function getAuthorProfile()
    {
        $user = Auth::user();
        $author = Author::where('user_id', $user->id)->first();

        if ($author) {
            return response()->json([
                'bio' => $author->bio,
                'is_verified' => $author->is_verified,
            ], 200);
        }

        return response()->json(['message' => 'Author not found'], 404);
    }

    public function getMyContent()
    {
        $userId = Auth::id();
        $author = Author::where('user_id', $userId)->first();

        $content = Content::with('author')
            ->where('author_id', $author->id)
            ->get();
        return response()->json($content, 200);
    }

    public function ispublished($id)
    {
        $content = Content::find($id);

        if (!$content) {
            return response()->json(['error' => 'Content not found'], 404);
        }
        //toggling 
        if ($content->is_published) {
            $content->is_published = false;
            $message = 'Content unpublished successfully';
        } else {
            $content->is_published = true;
            $message = 'Content published successfully';
        }

        $content->save();

        return response()->json(['message' => $message], 200);
    }


    public function markAsRead($id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json(['error' => 'Notification not found'], 404);
        }

        $notification->update(['is_read' => true]);

        return response()->json(['success' => 'Notification marked as read'], 200);
    }

    public function getNotifications()
    {
        $userId = Auth::id();
        $author = Author::where('user_id', $userId)->first();

        $notifications = Notification::where('author_id', $author->id)
            ->where('is_read', false)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notifications);
    }



    public function getUserIds(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'emails' => 'required|array|max:5',
            'emails.*' => 'email|distinct'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

        $emails = $request->input('emails');
        $users = User::whereIn('email', $emails)->get(['id', 'email']);

        return response()->json([
            'userIds' => $users->pluck('id')->toArray(),
            'errors' => $users->count() !== count($emails) ? ['Some emails are not registered.'] : []
        ]);
    }

    public function grantAccess(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'userIds' => 'required|array',
            'userIds.*' => 'exists:users,id',
            'contentId' => 'required|exists:contents,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }

        $existingAccess = ContentAccess::where('content_id', $request->input('contentId'))
            ->whereIn('user_id', $request->input('userIds'))
            ->pluck('user_id')
            ->toArray();

        $newUserIds = array_diff($request->input('userIds'), $existingAccess);

        if (empty($newUserIds)) {
            return response()->json([
                'errors' => ['All users already have access.']
            ], 422);
        }

        foreach ($newUserIds as $userId) {
            ContentAccess::create([
                'content_id' => $request->input('contentId'),
                'user_id' => $userId
            ]);
        }

        return response()->json(['message' => 'Access granted successfully!']);
    }

}


