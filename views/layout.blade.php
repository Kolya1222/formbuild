<link rel="stylesheet" href="{{ MODX_BASE_URL }}assets/modules/formbuild/css/bootstrap.min.css">
<link rel="stylesheet" href="{{ MODX_BASE_URL }}assets/modules/formbuild/css/bootstrap-icons.css">
<meta name="csrf-token" content="{{ csrf_token() }}">
@yield('buttons')
@yield('body')
<script src="{{ MODX_BASE_URL }}assets/modules/formbuild/js/bootstrap.bundle.min.js"></script>