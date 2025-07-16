<?php include_once MODX_MANAGER_PATH . 'includes/header.inc.php' ?>
<link rel="stylesheet" href="{{ MODX_BASE_URL }}assets/modules/formbuild/css/bootstrap.min.css">
<link rel="stylesheet" href="{{ MODX_BASE_URL }}assets/modules/formbuild/css/bootstrap-icons.css">
<div class="module-page">
    <h1>
        <i class="fa fa-list"></i>
        @yield('pagetitle', __('formbuild::global.main_caption'))
    </h1>

    @yield('buttons')

    <div class="sectionBody">
        @if (session('success'))
            <div class="alert alert-success" role="alert">
                {{ session('success') }}
            </div>
        @endif

        @if (session('error'))
            <div class="alert alert-danger" role="alert">
                {{ session('error') }}
            </div>
        @endif

        <div class="tab-pane" id="documentPane">
            <script type="text/javascript">
                var tpModule = new WebFXTabPane(document.getElementById('documentPane'), false);
            </script>

            @yield('body')
        </div>
    </div>
</div>
<script src="{{ MODX_BASE_URL }}assets/modules/formbuild/js/test-js/bootstrap.bundle.min.js"></script>
<link rel="stylesheet" href="{{ MODX_BASE_URL }}assets/modules/formbuild/css/style.css">
<script type="module" src="{{ MODX_BASE_URL }}assets/modules/formbuild/js/test-js/main.js">

@stack('scripts')

<?php include_once MODX_MANAGER_PATH . 'includes/footer.inc.php' ?>
