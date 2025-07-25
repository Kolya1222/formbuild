<?php

namespace Kolya1222\Formbuild\Controllers;

use Kolya1222\Formbuild\Services\{Module};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\DB;

class FormbuildController
{
    protected $module;

    public function __construct(Module $module)
    {
        $this->module = $module;

        // Делаем модуль доступным для всех представлений
        View::share([
            'module' => $module,
        ]);
    }

    // Главная страница
    public function index(Request $request)
    {
        return response()->view('Formbuild::index');
    }

    // Генерация файла формы
    public function generateFormFile(Request $request)
    {
        try {
            $data = $request;

            // Путь для сохранения файла формы
            $path = MODX_BASE_PATH . "core/custom/forms/{$data['formId']}.php";
            
            // Создаем директорию, если она не существует
            if (!file_exists(dirname($path))) {
                mkdir(dirname($path), 0755, true);
            }

            // Сохраняем содержимое формы в файл
            file_put_contents($path, $data['content']);
            
            return response()->json([
                'success' => true,
                'path' => $path
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Сохранение формы
    public function saveForm(Request $request)
    {
        try {
            // Валидация входных данных
            $validated = $request;

            // Подготовка данных для сохранения
            $data = [
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'form_data' => json_encode([
                    'fields' => $validated['fields'],
                    'settings' => $validated['settings']
                ]),
                'created_at' => now(),
                'updated_at' => now()
            ];

            // Проверка корректности JSON
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \RuntimeException('Неверные данные JSON: ' . json_last_error_msg());
            }

            // Сохранение в базу данных
            $id = DB::table('form_build_items')->insertGetId($data);

            return response()->json([
                'success' => true,
                'message' => 'Форма успешно сохранена',
                'id' => $id
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при сохранении формы: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Получение сохраненных форм
    public function getSavedForms()
    {
        try {
            $forms = DB::table('form_build_items')
                ->orderBy('created_at', 'desc')
                ->get(['id', 'name', 'description', 'created_at']);

            return response()->json([
                'success' => true,
                'forms' => $forms
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при загрузке форм: ' . $e->getMessage()
            ], 500);
        }
    }

    // Получение конкретной формы
    public function getForm(Request $request)
    {
        try {
            $form = DB::table('form_build_items')
                ->where('id', $request->input('id'))
                ->first();

            if (!$form) {
                return response()->json([
                    'success' => false,
                    'message' => 'Форма не найдена'
                ], 404);
            }

            $formData = json_decode($form->form_data, true);

            return response()->json([
                'success' => true,
                'form' => [
                    'settings' => $formData['settings'] ?? [],
                    'fields' => $formData['fields'] ?? []
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при загрузке формы: ' . $e->getMessage()
            ], 500);
        }
    }

    // Удаление формы
    public function deleteForm(Request $request)
    {
        try {
            $deleted = DB::table('form_build_items')
                ->where('id', $request->input('id'))
                ->delete();

            return response()->json([
                'success' => (bool)$deleted,
                'message' => $deleted ? 'Форма успешно удалена' : 'Форма не найдена'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при удалении формы: ' . $e->getMessage()
            ], 500);
        }
    }
}