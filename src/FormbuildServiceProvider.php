<?php namespace EvolutionCMS\Formbuild;

use EvolutionCMS\ServiceProvider;

class FormbuildServiceProvider extends ServiceProvider
{
    protected $namespace = 'Formbuild';
    public function register()
    {
        $this->app->registerRoutingModule(
            'Formbuild module',
            __DIR__ . '/../routes.php'
        );

        $this->publishes([
            __DIR__ . '/../publishable/assets'  => MODX_BASE_PATH . 'assets',
        ]);
    }
    public function boot()
    {
        $this->loadViewsFrom(__DIR__ . '/../views', $this->namespace);
        $this->loadTranslationsFrom(__DIR__ . '/../lang', $this->namespace);
    }
}