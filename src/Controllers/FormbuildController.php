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

        View::share([
            'module' => $module,
        ]);
    }

    public function index(Request $request)
    {
        return response()->view('Formbuild::index');
    }
    public function generateFormFile(Request $request)
    {
        try {
            $data = $request;

            $path = MODX_BASE_PATH . "core/custom/forms/{$data['formId']}.php";
            
            if (!file_exists(dirname($path))) {
                mkdir(dirname($path), 0755, true);
            }

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

            // Проверка, что JSON корректно сформирован
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \RuntimeException('Invalid JSON data: ' . json_last_error_msg());
            }

            // Сохраняем в базу данных
            $id = DB::table('form_build_items')->insertGetId($data);

            return response()->json([
                'success' => true,
                'message' => 'Form saved successfully',
                'id' => $id
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error saving form: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString() // Только для разработки!
            ], 500);
        }
    }

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
                'message' => 'Error loading forms: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getForm(Request $request)
    {
        try {
            $form = DB::table('form_build_items')
                ->where('id', $request->input('id'))
                ->first();

            if (!$form) {
                return response()->json([
                    'success' => false,
                    'message' => 'Form not found'
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
                'message' => 'Error loading form: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteForm(Request $request)
    {
        try {
            $deleted = DB::table('form_build_items')
                ->where('id', $request->input('id'))
                ->delete();

            return response()->json([
                'success' => (bool)$deleted,
                'message' => $deleted ? 'Form deleted successfully' : 'Form not found'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting form: ' . $e->getMessage()
            ], 500);
        }
    }
}
