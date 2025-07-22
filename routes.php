<?php

use Kolya1222\Formbuild\Controllers\FormbuildController;
use Illuminate\Support\Facades\Route;

Route::get('', [FormbuildController::class, 'index'])
    ->name('Formbuild::index');
Route::post('generate-form-file', [FormbuildController::class, 'generateFormFile'])
    ->name('Formbuild::generate-file');