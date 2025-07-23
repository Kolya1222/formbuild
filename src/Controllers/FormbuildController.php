<?php

namespace Kolya1222\Formbuild\Controllers;

use Kolya1222\Formbuild\Services\{Module};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\DB;
//use EvolutionCMS\Models\SiteModule;

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
            $data = [
                'name' => $request->input('name'),
                'description' => $request->input('description'),
                'form_data' => json_encode([
                    'fields' => $request->input('fields'),
                    'settings' => $request->input('settings')
                ]),
                'created_at' => now(),
                'updated_at' => now()
            ];

            // Сохраняем в базу данных
            $id = DB::table('form_builder_forms')->insertGetId($data);

            return response()->json([
                'success' => true,
                'message' => 'Form saved successfully',
                'id' => $id
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error saving form: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getSavedForms()
    {
        try {
            $forms = DB::table('form_builder_forms')
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
            $form = DB::table('form_builder_forms')
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
            $deleted = DB::table('form_builder_forms')
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
