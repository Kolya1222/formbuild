@extends('Formbuild::layout')

@section('buttons')
    <div id="actions" class="fixed-actions-panel">
        <div class="btn-group shadow-sm">
            <button class="btn btn-outline-secondary" onclick="location.reload();" data-bs-toggle="tooltip"
                title="@lang('Formbuild::global.refresh')">
                <i class="bi bi-arrow-clockwise"></i>
            </button>
            <button class="btn btn-outline-primary" id="export-html">
                <i class="bi bi-download me-1"></i>
            </button>
            <button class="btn btn-outline-danger" id="clear-workspace">
                <i class="bi bi-trash me-1"></i>
            </button>
        </div>
    </div>
@endsection

@section('body')
    <link rel="stylesheet" href="{{ MODX_BASE_URL }}assets/modules/formbuild/css/style.css">
    <link rel="stylesheet" href="{{ MODX_BASE_URL }}assets/modules/formbuild/css/bbevo/main.css">

    <!-- Боковая панель элементов -->
    <div class="elements-sidebar">
        <div class="elements-icons">
            <!-- Иконки элементов -->
            <div class="element-icon" draggable="true" data-type="text" title="Текстовый блок">
                <i class="bi bi-text-paragraph"></i>
                <span class="element-label">Текст</span>
            </div>
            <div class="element-icon" draggable="true" data-type="button" title="Кнопка">
                <i class="bi bi-menu-button-wide-fill"></i>
                <span class="element-label">Кнопка</span>
            </div>
            <div class="element-icon" draggable="true" data-type="image" title="Изображение">
                <i class="bi bi-image"></i>
                <span class="element-label">Изображение</span>
            </div>
            <div class="element-icon" draggable="true" data-type="section" title="Секция">
                <i class="bi bi-collection"></i>
                <span class="element-label">Секция</span>
            </div>
            <div class="element-icon" draggable="true" data-type="row" title="Строка">
                <i class="bi bi-layout-split"></i>
                <span class="element-label">Строка</span>
            </div>
            <div class="element-icon" draggable="true" data-type="column" title="Колонка">
                <i class="bi bi-layout-sidebar-inset"></i>
                <span class="element-label">Колонка</span>
            </div>
        </div>
    </div>

    <!-- Основная рабочая область -->
    <div class="workspace-container">
        <div class="split-view">
            <!-- Левая панель - рабочая область -->
            <div class="split-panel">
                <div class="panel-header">
                    <i class="bi bi-layout-wtf"></i>Рабочая область
                </div>
                <div class="workspace" id="workspace">
                    <!-- Здесь будут добавляться элементы -->
                </div>
            </div>

            <!-- Правая панель - предпросмотр -->
            <div class="split-panel">
                <div class="panel-header">
                    <i class="bi bi-eye"></i>Предпросмотр
                    <div class="ms-auto">
                        <button class="btn btn-sm btn-outline-secondary" id="copy-html" style="padding: 0;">
                            <i class="bi bi-clipboard"></i> Копировать
                        </button>
                    </div>
                </div>
                <div id="html-output">
                    <!-- Тут будет генерироваться HTML -->
                </div>
            </div>
        </div>
    </div>

    <!-- Панель свойств -->
    <div class="properties-panel" id="properties-panel">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="panel-title mb-0">
                <i class="bi bi-sliders"></i>Свойства элемента
            </h5>
            <span class="badge bg-secondary" id="selected-element-type">Не выбран</span>
        </div>
        <div id="properties-form">
            <p class="text-muted">Выберите элемент для редактирования</p>
        </div>
    </div>

    <!-- Контекстное меню -->
    <div class="context-menu" id="context-menu">
        <div class="context-menu-item" data-action="copy"><i class="bi bi-files"></i> Копировать</div>
        <div class="context-menu-item" data-action="cut"><i class="bi bi-scissors"></i> Вырезать</div>
        <div class="context-menu-item" data-action="paste"><i class="bi bi-clipboard"></i> Вставить</div>
        <div class="context-menu-item" data-action="duplicate"><i class="bi bi-plus-square"></i> Дублировать</div>
        <div class="context-menu-item" data-action="delete"><i class="bi bi-trash"></i> Удалить</div>
        <hr class="my-1">
        <div class="context-menu-item" data-action="move-up"><i class="bi bi-arrow-up"></i> Переместить выше</div>
        <div class="context-menu-item" data-action="move-down"><i class="bi bi-arrow-down"></i> Переместить ниже</div>
    </div>
    <script type="module" src="{{ MODX_BASE_URL }}assets/modules/formbuild/js/bbevo/main.js"></script>
@endsection
