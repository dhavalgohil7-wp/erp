<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('db:create {name?}', function ($name = null) {
    $database = $name ?: config('database.connections.mysql.database');
    config(['database.connections.mysql.database' => null]);
    \Illuminate\Support\Facades\DB::purge('mysql');
    \Illuminate\Support\Facades\DB::statement("CREATE DATABASE IF NOT EXISTS `{$database}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    $this->info("Database `{$database}` created or already exists.");
})->purpose('Create a database using Laravel DB facade');

