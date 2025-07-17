<?php include_once MODX_MANAGER_PATH . 'includes/header.inc.php' ?>
<link rel="stylesheet" href="{{ MODX_BASE_URL }}assets/modules/formbuild/css/bootstrap.min.css">
<link rel="stylesheet" href="{{ MODX_BASE_URL }}assets/modules/formbuild/css/bootstrap-icons.css">
@yield('buttons')
<div class="sectionBody">
    @yield('body')
</div>
<script src="{{ MODX_BASE_URL }}assets/modules/formbuild/js/test-js/bootstrap.bundle.min.js"></script>
<link rel="stylesheet" href="{{ MODX_BASE_URL }}assets/modules/formbuild/css/style.css">
<script type="module" src="{{ MODX_BASE_URL }}assets/modules/formbuild/js/test-js/main.js">

@stack('scripts')
<?php include_once MODX_MANAGER_PATH . 'includes/footer.inc.php' ?>
