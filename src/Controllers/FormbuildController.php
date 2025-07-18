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
        return response()->view('formbuild::index');
    }
}
