<?php

use Kolya1222\Formbuild\Controllers\FormbuildController;
use Illuminate\Support\Facades\Route;

Route::get('', [FormbuildController::class, 'index'])
    ->name('Formbuild::index');
Route::post('generate-form-file', [FormbuildController::class, 'generateFormFile'])
    ->name('Formbuild::generate-file');
// Для сохранения формы
Route::post('/save-form', [FormbuildController::class, 'saveForm'])
    ->name('Formbuild::save-form');

// Для получения списка сохраненных форм
Route::get('/get-saved-forms', [FormbuildController::class, 'getSavedForms'])
    ->name('Formbuild::get-saved-forms');

// Для загрузки конкретной формы
Route::get('/get-form', [FormbuildController::class, 'getForm'])
    ->name('Formbuild::get-form');

// Для удаления формы
Route::post('/delete-form', [FormbuildController::class, 'deleteForm'])
    ->name('Formbuild::delete-form');

Route::get('/bbevo', [FormbuildController::class, 'bbevo'])
    ->name('Formbuild::bbevo');