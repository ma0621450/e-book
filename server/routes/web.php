<?php

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;

//auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

//user role_id : 1
Route::middleware('checkRole:1')->group(function () {
    Route::get('/content', [UserController::class, 'getPublishedContent']);
    Route::post('/purchase', [UserController::class, 'purchaseContent']);
    Route::get('/purchased-content', [UserController::class, 'getPurchasedContent']);
});

//author role_id : 2
Route::middleware('checkRole:2')->group(function () {
    Route::post('/createContent', [AuthorController::class, 'createContent']);
    Route::get('/publications', [AuthorController::class, 'getMyContent']);
    Route::patch('/content/{id}/publish', [AuthorController::class, 'ispublished']);
    Route::post('/get-user-ids', [AuthorController::class, 'getUserIds']);
    Route::post('/grant-access', [AuthorController::class, 'grantAccess']);
    Route::post('/editBio', [AuthorController::class, 'editBio']);
    Route::get('/notifications', [AuthorController::class, 'getNotifications']);
    Route::patch('/notifications/{id}/mark-read', [AuthorController::class, 'markAsRead']);
    Route::put('/updateContent/{id}', [AuthorController::class, 'updateContent']);
});

//admin role_id : 3
Route::middleware('checkRole:3')->group(function () {
    Route::get('/admin/authors', [AdminController::class, 'getAuthors']);
    Route::post('/admin/verify-author/{id}', [AdminController::class, 'verifyAuthor']);
    Route::post('/block-user/{id}', [AdminController::class, 'blockUser'])->name('admin.block-user');
    Route::post('/unblock-user/{id}', [AdminController::class, 'unblockUser'])->name('admin.unblock-user');
});

// role_id : 1,2,3 (accessible by all roles)
Route::get('/post/{id}', [UserController::class, 'getSinglePost']);
Route::get('/author-profile', [AuthorController::class, 'getAuthorProfile']);
Route::get('/author/{id}/posts', [Controller::class, 'getAuthorPosts']);
Route::get('/author/{id}', [Controller::class, 'getSingleAuthorProfile']);