<?php

namespace App\Http\Controllers;


use App\Models\Author;
use Auth;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users',
            'username' => 'required|string|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|integer|exists:roles,id'
        ]);

        try {
            $validated['password'] = bcrypt($validated['password']);
            $roleId = $validated['role'];

            $user = User::create([
                'email' => $validated['email'],
                'username' => $validated['username'],
                'password' => $validated['password'],
                'role_id' => $roleId
            ]);

            if ($roleId == 2) {
                Author::create([
                    'user_id' => $user->id,
                    'is_verified' => false,
                    'bio' => ''
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Registration failed: ' . $e->getMessage());
            return response()->json(['error' => 'Registration failed'], 500);
        }

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::withTrashed()->where('email', $request->email)->first();

        if ($user && $user->trashed()) {
            return response()->json(['message' => 'Your account has been blocked.'], 403);
        }

        if ($user && Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();
            $response = [
                'message' => 'Login successful',
                'user' => [
                    'role_id' => $user->role_id,
                ],
            ];

            if ($user->role_id === 2) {
                $author = Author::where('user_id', $user->id)->first();
                $response['author'] = $author ? [
                    'is_verified' => $author->is_verified,
                ] : [
                    'is_verified' => false,
                ];
            }

            return response()->json($response);
        }

        return response()->json(['message' => 'Login failed'], 401);
    }

    public function logout(Request $request)
    {
        if (Auth::check()) {
            Auth::logout();
            return response()->json(['message' => 'Logged out successfully'], 200);
        }
        return response()->json(['error' => 'Not authenticated'], 401);
    }
}