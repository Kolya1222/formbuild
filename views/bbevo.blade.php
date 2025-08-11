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
                        <button class="btn btn-sm btn-outline-secondary" id="copy-html">
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
    <div class="properties-panel" id="propertiesPanel">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="panel-title mb-0">
                <i class="bi bi-sliders"></i>Свойства элемента
            </h5>
            <span class="badge bg-secondary" id="selected-element-type">Не выбран</span>
        </div>
        <div id="properties-form">
            <div class="property-control">
                <label for="element-id">ID элемента</label>
                <input type="text" class="form-control form-control-sm" id="element-id"
                    placeholder="Уникальный идентификатор">
            </div>

            <div class="property-control">
                <label for="element-classes">Классы</label>
                <input type="text" class="form-control form-control-sm" id="element-classes"
                    placeholder="class1 class2">
            </div>

            <div class="accordion mb-3" id="propertiesAccordion">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#layout-properties">
                            <i class="bi bi-layout-text-sidebar me-2"></i>Расположение
                        </button>
                    </h2>
                    <div id="layout-properties" class="accordion-collapse collapse"
                        data-bs-parent="#propertiesAccordion">
                        <div class="accordion-body">
                            <div class="property-control">
                                <label for="display-type">Display</label>
                                <select class="form-select form-select-sm" id="display-type">
                                    <option value="">(по умолчанию)</option>
                                    <option value="block">block</option>
                                    <option value="flex">flex</option>
                                    <option value="inline">inline</option>
                                    <option value="inline-block">inline-block</option>
                                    <option value="none">none</option>
                                </select>
                            </div>

                            <div class="property-control">
                                <label for="flex-direction">Направление flex</label>
                                <select class="form-select form-select-sm" id="flex-direction">
                                    <option value="">(по умолчанию)</option>
                                    <option value="row">row</option>
                                    <option value="row-reverse">row-reverse</option>
                                    <option value="column">column</option>
                                    <option value="column-reverse">column-reverse</option>
                                </select>
                            </div>

                            <div class="property-control">
                                <label for="justify-content">Выравнивание по главной оси</label>
                                <select class="form-select form-select-sm" id="justify-content">
                                    <option value="">(по умолчанию)</option>
                                    <option value="flex-start">flex-start</option>
                                    <option value="flex-end">flex-end</option>
                                    <option value="center">center</option>
                                    <option value="space-between">space-between</option>
                                    <option value="space-around">space-around</option>
                                    <option value="space-evenly">space-evenly</option>
                                </select>
                            </div>

                            <div class="property-control">
                                <label for="align-items">Выравнивание по поперечной оси</label>
                                <select class="form-select form-select-sm" id="align-items">
                                    <option value="">(по умолчанию)</option>
                                    <option value="flex-start">flex-start</option>
                                    <option value="flex-end">flex-end</option>
                                    <option value="center">center</option>
                                    <option value="baseline">baseline</option>
                                    <option value="stretch">stretch</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#size-properties">
                            <i class="bi bi-arrows-angle-expand me-2"></i>Размеры
                        </button>
                    </h2>
                    <div id="size-properties" class="accordion-collapse collapse" data-bs-parent="#propertiesAccordion">
                        <div class="accordion-body">
                            <div class="row g-2">
                                <div class="col-6">
                                    <label for="element-width">Ширина</label>
                                    <input type="text" class="form-control form-control-sm" id="element-width"
                                        placeholder="auto">
                                </div>
                                <div class="col-6">
                                    <label for="element-height">Высота</label>
                                    <input type="text" class="form-control form-control-sm" id="element-height"
                                        placeholder="auto">
                                </div>
                            </div>

                            <div class="property-control mt-2">
                                <label for="element-padding">Внутренний отступ</label>
                                <input type="text" class="form-control form-control-sm" id="element-padding"
                                    placeholder="10px">
                            </div>

                            <div class="property-control">
                                <label for="element-margin">Внешний отступ</label>
                                <input type="text" class="form-control form-control-sm" id="element-margin"
                                    placeholder="10px">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#style-properties">
                            <i class="bi bi-palette me-2"></i>Стили
                        </button>
                    </h2>
                    <div id="style-properties" class="accordion-collapse collapse" data-bs-parent="#propertiesAccordion">
                        <div class="accordion-body">
                            <div class="property-control">
                                <label for="element-bgcolor">Цвет фона</label>
                                <input type="color" class="form-control form-control-sm p-1" id="element-bgcolor">
                            </div>

                            <div class="property-control">
                                <label for="element-color">Цвет текста</label>
                                <input type="color" class="form-control form-control-sm p-1" id="element-color">
                            </div>

                            <div class="property-control">
                                <label for="element-border">Граница</label>
                                <input type="text" class="form-control form-control-sm" id="element-border"
                                    placeholder="1px solid #000">
                            </div>

                            <div class="property-control">
                                <label for="element-border-radius">Скругление углов</label>
                                <input type="text" class="form-control form-control-sm" id="element-border-radius"
                                    placeholder="4px">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#content-properties">
                            <i class="bi bi-file-earmark-text me-2"></i>Содержимое
                        </button>
                    </h2>
                    <div id="content-properties" class="accordion-collapse collapse"
                        data-bs-parent="#propertiesAccordion">
                        <div class="accordion-body">
                            <div class="property-control">
                                <label for="element-text">Текст</label>
                                <textarea class="form-control form-control-sm" id="element-text" rows="3"></textarea>
                            </div>

                            <div class="property-control">
                                <label for="element-src">URL изображения</label>
                                <input type="text" class="form-control form-control-sm" id="element-src"
                                    placeholder="https://example.com/image.jpg">
                            </div>

                            <div class="property-control">
                                <label for="element-href">Ссылка</label>
                                <input type="text" class="form-control form-control-sm" id="element-href"
                                    placeholder="https://example.com">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button class="btn btn-danger w-100 mt-2" id="remove-element">
                <i class="bi bi-trash me-1"></i>Удалить элемент
            </button>

            <button class="btn btn-outline-secondary w-100 mt-2" id="duplicate-element">
                <i class="bi bi-files me-1"></i>Дублировать
            </button>
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
