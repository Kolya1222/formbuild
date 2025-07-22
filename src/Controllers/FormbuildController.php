<?php

namespace Kolya1222\Formbuild\Controllers;

use Kolya1222\Formbuild\Services\{Module};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;

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
}
