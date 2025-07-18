<?php

use Kolya1222\Formbuild\Controllers\FormbuildController;
use Illuminate\Support\Facades\Route;

Route::get('', [FormbuildController::class, 'index'])
    ->name('formbuild::index');