<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class RolesAndSuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insert roles into the roles table
        $roles = ['user', 'author', 'admin'];

        foreach ($roles as $role) {
            DB::table('roles')->updateOrInsert(
                ['role_name' => $role],
                ['role_name' => $role]
            );
        }

        // Retrieve the 'superadmin' role ID
        $adminRoleId = DB::table('roles')->where('role_name', 'admin')->value('id');

        // Insert the superadmin user into the users table
        DB::table('users')->updateOrInsert(
            ['email' => 'superadmin@example.com'],
            [
                'username' => 'admin',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('admin123'),
                'role_id' => $adminRoleId,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );


    }
}