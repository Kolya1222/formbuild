@extends('formbuild::layout')

@section('buttons')
    <div id="actions">
        <div class="btn-group">
            <a href="javascript:;" class="btn btn-success" onclick="location.reload();">
                <i class="fa fa-refresh"></i><span>@lang('formbuild::global.refresh')</span>
            </a>
        </div>
    </div>
@endsection

@section('body')
    <div class="app-container">
        <header class="app-header text-center">
            <h1><i class="bi bi-input-cursor-text"></i> Генератор форм с FormLister</h1>
            <p class="lead">Создавайте профессиональные формы с валидацией для Evolution CMS</p>
        </header>
        
        <div class="row">
            <div class="col-lg-8">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span><i class="bi bi-pencil-square"></i> Конструктор формы</span>
                        <div>
                            <button class="btn btn-sm btn-primary me-2" onclick="addField()">
                                <i class="bi bi-plus-circle"></i> Добавить поле
                            </button>
                            <button class="btn btn-sm btn-success" onclick="generateMarkup()">
                                <i class="bi bi-magic"></i> Сгенерировать
                            </button>
                        </div>
                    </div>
                    
                    <!-- Добавляем панель с типами полей -->
                    <div class="card-body py-2 border-bottom">
                        <div class="d-flex flex-wrap gap-2" id="fieldTypesPanel">
                            <div class="field-type" draggable="true" data-type="text">
                                <i class="bi bi-input-cursor-text"></i> Текстовое поле
                            </div>
                            <div class="field-type" draggable="true" data-type="email">
                                <i class="bi bi-envelope"></i> Email
                            </div>
                            <div class="field-type" draggable="true" data-type="tel">
                                <i class="bi bi-telephone"></i> Телефон
                            </div>
                            <div class="field-type" draggable="true" data-type="password">
                                <i class="bi bi-lock"></i> Пароль
                            </div>
                            <div class="field-type" draggable="true" data-type="number">
                                <i class="bi bi-123"></i> Число
                            </div>
                            <div class="field-type" draggable="true" data-type="textarea">
                                <i class="bi bi-text-paragraph"></i> Текстовая область
                            </div>
                            <div class="field-type" draggable="true" data-type="select">
                                <i class="bi bi-menu-button"></i> Выпадающий список
                            </div>
                            <div class="field-type" draggable="true" data-type="checkbox">
                                <i class="bi bi-check-square"></i> Чекбокс
                            </div>
                            <div class="field-type" draggable="true" data-type="radio">
                                <i class="bi bi-ui-radios"></i> Радиокнопки
                            </div>
                            <div class="field-type" draggable="true" data-type="file">
                                <i class="bi bi-file-earmark-arrow-up"></i> Файл
                            </div>
                            <div class="field-type" draggable="true" data-type="hidden">
                                <i class="bi bi-eye-slash"></i> Скрытое поле
                            </div>
                            <div class="field-type" draggable="true" data-type="date">
                                <i class="bi bi-calendar"></i> Дата
                            </div>
                        </div>
                    </div>
                    
                    <div class="card-body">
                        <div id="formFields">
                            <div class="empty-state" id="emptyState">
                                <i class="bi bi-input-cursor-text"></i>
                                <h4>Нет полей в форме</h4>
                                <p>Перетащите сюда поля из панели выше или нажмите "Добавить поле"</p>
                                <button class="btn btn-primary" onclick="addField()">
                                    <i class="bi bi-plus-circle fs-6"></i> Добавить поле
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <i class="bi bi-gear"></i> Настройки формы
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">ID формы</label>
                                    <input type="text" class="form-control" id="formId" value="myForm">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Метод отправки</label>
                                    <select class="form-select" id="formMethod">
                                        <option value="post">POST</option>
                                        <option value="get">GET</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Действие формы (action)</label>
                            <input type="text" class="form-control" id="formAction" value="">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Почта куда приходят письма</label>
                            <input type="text" class="form-control" id="formEmail" value="">
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3 form-check">
                                    <input type="checkbox" class="form-check-input" id="formMultipart">
                                    <label class="form-check-label" for="formMultipart">Форма содержит файловые поля (multipart)</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3 form-check">
                                    <input type="checkbox" class="form-check-input" id="formSender">
                                    <label class="form-check-label" for="formSender">Форма отправляется без перезагрузки</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-4">
                <div class="card">
                    <div class="card-header">
                        <i class="bi bi-code-slash"></i> Результат
                    </div>
                    <div class="card-body">
                        <ul class="nav nav-tabs" id="outputTabs" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="html-tab" data-bs-toggle="tab" data-bs-target="#html-tab-pane" type="button" role="tab">HTML</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="formlister-tab" data-bs-toggle="tab" data-bs-target="#formlister-tab-pane" type="button" role="tab">FormLister</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="preview-tab" data-bs-toggle="tab" data-bs-target="#preview-tab-pane" type="button" role="tab">Превью</button>
                            </li>
                        </ul>
                        <div class="tab-content" id="outputTabsContent">
                            <div class="tab-pane fade show active" id="html-tab-pane" role="tabpanel" aria-labelledby="html-tab">
                                <div class="position-relative">
                                    <div id="outputHtml" class="output-code">...</div>
                                    <i class="bi bi-clipboard copy-btn" title="Копировать" data-bs-toggle="tooltip" onclick="copyToClipboard('outputHtml')"></i>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="formlister-tab-pane" role="tabpanel" aria-labelledby="formlister-tab">
                                <div class="position-relative">
                                    <div id="outputParams" class="output-code">Параметры FormLister появятся здесь после генерации</div>
                                    <i class="bi bi-clipboard copy-btn" title="Копировать" onclick="copyToClipboard('outputParams')"></i>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="preview-tab-pane" role="tabpanel" aria-labelledby="preview-tab">
                                <div class="form-preview" id="formPreview">
                                    Превью формы будет отображено здесь
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card mt-4">
                    <div class="card-header">
                        <i class="bi bi-lightbulb"></i> Советы
                    </div>
                    <div class="card-body">
                        <div class="alert alert-info">
                            <h6><i class="bi bi-info-circle"></i> Подсказки по FormLister:</h6>
                            <ul>
                                <li>Для файловых полей не забудьте включить multipart</li>
                                <li>Используйте уникальные имена для полей формы</li>
                                <li><strong>Для отправки форм без перезагрузки используйте FormSender</strong></li>
                                <li>Для сложных правил валидации редактируйте параметры вручную</li>
                            </ul>
                        </div>
                        <button class="btn btn-outline-secondary w-100" data-bs-toggle="modal" data-bs-target="#helpModal">
                            <i class="bi bi-question-circle"></i> Помощь
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Modal -->
    <div class="modal fade" id="fieldSettingsModal" tabindex="-1" aria-labelledby="fieldSettingsModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="fieldSettingsModalLabel">Настройки поля</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="fieldSettingsModalBody">
                    <!-- Динамическое содержимое -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                    <button type="button" class="btn btn-primary" onclick="saveFieldSettings()">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Help Modal -->
    <div class="modal fade" id="helpModal" tabindex="-1" aria-labelledby="helpModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="helpModalLabel"><i class="bi bi-question-circle"></i> Помощь по генератору форм</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h6>Как использовать генератор:</h6>
                    <ol>
                        <li>Добавьте нужные поля формы с помощью кнопки "Добавить поле"</li>
                        <li>Настройте каждое поле, указав тип, название и параметры</li>
                        <li>Укажите общие настройки формы в нижней панели</li>
                        <li>Нажмите "Сгенерировать" для получения кода</li>
                        <li>Скопируйте HTML-код и параметры FormLister</li>
                    </ol>
                    
                    <h6 class="mt-4">Особенности:</h6>
                    <ul>
                        <li>Поддержка всех основных типов полей</li>
                        <li>Автоматическая генерация правил валидации</li>
                        <li>Превью формы в реальном времени</li>
                        <li>Копирование кода в один клик</li>
                    </ul>
                    
                    <div class="alert alert-warning mt-4">
                        <i class="bi bi-exclamation-triangle"></i> Для работы форм с файлами не забудьте:
                        <ul>
                            <li>Указать атрибут enctype="multipart/form-data"</li>
                            <li>Настроить параметры загрузки файлов в FormLister</li>
                            <li>Проверить права на запись в папку uploads</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Понятно</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Field Template (hidden) -->
    <div id="fieldTemplate" class="d-none">
        <div class="form-field" id="field-{id}" draggable="true">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="mb-0 d-flex align-items-center">
                    <i class="bi bi-grip-vertical me-2 drag-handle" style="cursor: move;"></i>
                    <span class="field-title">Поле #{number}</span>
                    <span class="badge bg-primary ms-2 field-type-badge">text</span>
                    <span class="badge badge-required ms-1 field-required-badge d-none">обязательное</span>
                </h5>
                <div>
                    <button class="btn btn-sm btn-outline-secondary me-1" onclick="editFieldSettings({id})" data-bs-toggle="tooltip" title="Настройки">
                        <i class="bi bi-gear"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="removeField({id})" 
                            data-bs-toggle="tooltip" data-bs-placement="top" title="Удалить"
                            onmouseleave="hideTooltip(this)">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
            
            <div class="field-summary">
                <div><strong>Имя:</strong> <span class="field-name-summary">field{id}</span></div>
                <div><strong>Название:</strong> <span class="field-label-summary">Поле #{number}</span></div>
            </div>
            
            <div class="field-options d-none" id="field-options-{id}">
                <!-- Дополнительные опции для разных типов полей -->
            </div>
        </div>
    </div>
    
@endsection
