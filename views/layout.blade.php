<link rel="stylesheet" href="{{ MODX_BASE_URL }}assets/modules/formbuild/css/bootstrap.min.css">
<link rel="stylesheet" href="{{ MODX_BASE_URL }}assets/modules/formbuild/css/bootstrap-icons.css">
<meta name="csrf-token" content="{{ csrf_token() }}">
@yield('buttons')
<nav class="navbar navbar-expand-lg navbar-dark">
    <div class="container">
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('Formbuild::index') }}">
                        <i class="bi bi-input-cursor-text me-2"></i>
                        Formbuildevo
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('Formbuild::bbevo') }}">
                        <i class="bi bi-bootstrap-fill me-2"></i>
                        Bootstrapbuildevo(alpha)
                    </a>
                </li>
            </ul>
        </div>
    </div>
</nav>

    @yield('body')

<script src="{{ MODX_BASE_URL }}assets/modules/formbuild/js/bootstrap.bundle.min.js"></script>