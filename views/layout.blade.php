<link rel="stylesheet" href="{{ MODX_BASE_URL }}assets/modules/formbuild/css/bootstrap.min.css">
<link rel="stylesheet" href="{{ MODX_BASE_URL }}assets/modules/formbuild/css/bootstrap-icons.css">
<link rel="stylesheet" href="{{ MODX_BASE_URL }}assets/modules/formbuild/css/style.css">
<meta name="csrf-token" content="{{ csrf_token() }}">
@yield('buttons')
<div class="sectionBody">
    @yield('body')
</div>
<script src="{{ MODX_BASE_URL }}assets/modules/formbuild/js/bootstrap.bundle.min.js"></script>
<script type="module" src="{{ MODX_BASE_URL }}assets/modules/formbuild/js/main.js"></script>
