<link rel="stylesheet" href="{{ MODX_BASE_URL }}assets/modules/Formbuild/css/bootstrap.min.css">
<link rel="stylesheet" href="{{ MODX_BASE_URL }}assets/modules/Formbuild/css/bootstrap-icons.css">
<link rel="stylesheet" href="{{ MODX_BASE_URL }}assets/modules/Formbuild/css/style.css">
<meta name="csrf-token" content="{{ csrf_token() }}">
<div class="sectionBody">
    @yield('body')
</div>
<script src="{{ MODX_BASE_URL }}assets/modules/Formbuild/js/bootstrap.bundle.min.js"></script>
<script type="module" src="{{ MODX_BASE_URL }}assets/modules/Formbuild/js/main.js"></script>