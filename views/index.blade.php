@extends('Formbuild::layout')

@section('buttons')
    <div id="actions">
        <div class="btn-group">
            <a href="javascript:;" class="btn btn-success" onclick="location.reload();">
                <i class="fa fa-refresh"></i><span>@lang('Formbuild::global.refresh')</span>
            </a>
        </div>
    </div>
@endsection

@section('body')
    <div class="app-container">
        <header class="app-header text-center">
            <h1><i class="bi bi-input-cursor-text"></i> @lang('Formbuild::form.generator_title')</h1>
            <p class="lead">@lang('Formbuild::form.generator_subtitle')</p>
        </header>
        
        <div class="row">
            <div class="col-lg-8">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span><i class="bi bi-pencil-square"></i> @lang('Formbuild::form.form_builder')</span>
                        <div>
                            <button class="btn btn-sm btn-primary me-2" onclick="addField()">
                                <i class="bi bi-plus-circle"></i> @lang('Formbuild::form.add_field')
                            </button>
                            <button class="btn btn-sm btn-success" onclick="generateMarkup()">
                                <i class="bi bi-magic"></i> @lang('Formbuild::form.generate')
                            </button>
                        </div>
                    </div>
                    
                    <!-- Панель с типами полей -->
                    <div class="card-body py-2 border-bottom">
                        <div class="d-flex flex-wrap gap-2" id="fieldTypesPanel">
                            <div class="field-type" draggable="true" data-type="text">
                                <i class="bi bi-input-cursor-text"></i> @lang('Formbuild::field_types.text')
                            </div>
                            <div class="field-type" draggable="true" data-type="email">
                                <i class="bi bi-envelope"></i> @lang('Formbuild::field_types.email')
                            </div>
                            <div class="field-type" draggable="true" data-type="tel">
                                <i class="bi bi-telephone"></i> @lang('Formbuild::field_types.tel')
                            </div>
                            <div class="field-type" draggable="true" data-type="password">
                                <i class="bi bi-lock"></i> @lang('Formbuild::field_types.password')
                            </div>
                            <div class="field-type" draggable="true" data-type="number">
                                <i class="bi bi-123"></i> @lang('Formbuild::field_types.number')
                            </div>
                            <div class="field-type" draggable="true" data-type="textarea">
                                <i class="bi bi-text-paragraph"></i> @lang('Formbuild::field_types.textarea')
                            </div>
                            <div class="field-type" draggable="true" data-type="select">
                                <i class="bi bi-menu-button"></i> @lang('Formbuild::field_types.select')
                            </div>
                            <div class="field-type" draggable="true" data-type="checkbox">
                                <i class="bi bi-check-square"></i> @lang('Formbuild::field_types.checkbox')
                            </div>
                            <div class="field-type" draggable="true" data-type="radio">
                                <i class="bi bi-ui-radios"></i> @lang('Formbuild::field_types.radio')
                            </div>
                            <div class="field-type" draggable="true" data-type="file">
                                <i class="bi bi-file-earmark-arrow-up"></i> @lang('Formbuild::field_types.file')
                            </div>
                            <div class="field-type" draggable="true" data-type="hidden">
                                <i class="bi bi-eye-slash"></i> @lang('Formbuild::field_types.hidden')
                            </div>
                            <div class="field-type" draggable="true" data-type="date">
                                <i class="bi bi-calendar"></i> @lang('Formbuild::field_types.date')
                            </div>
                        </div>
                    </div>
                    
                    <div class="card-body">
                        <div class="form-fields-container">
                            <div id="formFields">
                                <div class="empty-state" id="emptyState">
                                    <i class="bi bi-input-cursor-text"></i>
                                    <h4>@lang('Formbuild::form.no_fields_title')</h4>
                                    <p>@lang('Formbuild::form.no_fields_description')</p>
                                    <button class="btn btn-primary" onclick="addField()">
                                        <i class="bi bi-plus-circle fs-6"></i> @lang('Formbuild::form.add_field')
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <i class="bi bi-gear"></i> @lang('Formbuild::form.form_settings')
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">@lang('Formbuild::form.form_id')</label>
                                    <input type="text" class="form-control" id="formId" value="myForm">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">@lang('Formbuild::form.method')</label>
                                    <div class="custom-select">
                                        <div class="custom-select__selected" id="formMethodSelected">
                                            POST
                                        </div>
                                        <div class="custom-select__options">
                                            <div class="custom-select__option" data-value="POST">POST</div>
                                            <div class="custom-select__option" data-value="GET">GET</div>
                                        </div>
                                    </div>
                                    <select id="formMethod" name="formMethod" class="d-none">
                                        <option value="POST" selected>POST</option>
                                        <option value="GET">GET</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">@lang('Formbuild::form.action')</label>
                            <input type="text" class="form-control" id="formAction" value="">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">@lang('Formbuild::form.email')</label>
                            <input type="text" class="form-control" id="formEmail" value="">
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3 form-check">
                                    <input type="checkbox" class="form-check-input" id="formMultipart">
                                    <label class="form-check-label" for="formMultipart">@lang('Formbuild::form.multipart')</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3 form-check">
                                    <input type="checkbox" class="form-check-input" id="formSender">
                                    <label class="form-check-label" for="formSender">@lang('Formbuild::form.ajax_send')</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-4">
                <div class="card">
                    <div class="card-header">
                        <i class="bi bi-code-slash"></i> @lang('Formbuild::form.result')
                    </div>
                    <div class="card-body">
                        <ul class="nav nav-tabs" id="outputTabs" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="html-tab" data-bs-toggle="tab" data-bs-target="#html-tab-pane" type="button" role="tab">HTML</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="formlister-tab" data-bs-toggle="tab" data-bs-target="#formlister-tab-pane" type="button" role="tab">FormLister/Sender</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="preview-tab" data-bs-toggle="tab" data-bs-target="#preview-tab-pane" type="button" role="tab">@lang('Formbuild::form.preview')</button>
                            </li>
                        </ul>
                        <div class="tab-content" id="outputTabsContent">
                            <div class="tab-pane fade show active" id="html-tab-pane" role="tabpanel" aria-labelledby="html-tab">
                                <div class="position-relative">
                                    <div id="outputHtml" class="output-code">...</div>
                                    <i class="bi bi-clipboard copy-btn" title="@lang('Formbuild::form.copy')" data-bs-toggle="tooltip" onclick="copyToClipboard('outputHtml')"></i>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="formlister-tab-pane" role="tabpanel" aria-labelledby="formlister-tab">
                                <div class="position-relative">
                                    <div id="outputParams" class="output-code">@lang('Formbuild::form.params_placeholder')</div>
                                    <i class="bi bi-clipboard copy-btn" title="@lang('Formbuild::form.copy')" onclick="copyToClipboard('outputParams')"></i>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="preview-tab-pane" role="tabpanel" aria-labelledby="preview-tab">
                                <div class="form-preview" id="formPreview">
                                    @lang('Formbuild::form.preview_placeholder')
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card mt-4">
                    <div class="card-header">
                        <i class="bi bi-lightbulb"></i> @lang('Formbuild::form.tips')
                    </div>
                    <div class="card-body">
                        <div class="alert alert-info">
                            <h6><i class="bi bi-info-circle"></i> @lang('Formbuild::form.tips_title'):</h6>
                            <ul>
                                <li>@lang('Formbuild::form.tip_multipart')</li>
                                <li>@lang('Formbuild::form.tip_unique_names')</li>
                                <li><strong>@lang('Formbuild::form.tip_ajax_send')</strong></li>
                                <li>@lang('Formbuild::form.tip_validation_rules')</li>
                            </ul>
                        </div>
                        <button class="btn btn-outline-secondary w-100" data-bs-toggle="modal" data-bs-target="#helpModal">
                            <i class="bi bi-question-circle"></i> @lang('Formbuild::form.help')
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
                    <h5 class="modal-title" id="fieldSettingsModalLabel">@lang('Formbuild::form.field_settings')</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="fieldSettingsModalBody">
                    <!-- Динамическое содержимое -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">@lang('Formbuild::form.close')</button>
                    <button type="button" class="btn btn-primary" onclick="saveFieldSettings()">@lang('Formbuild::form.save')</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Help Modal -->
    <div class="modal fade" id="helpModal" tabindex="-1" aria-labelledby="helpModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="helpModalLabel"><i class="bi bi-question-circle"></i> @lang('Formbuild::form.help_title')</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h6>@lang('Formbuild::form.how_to_use'):</h6>
                    <ol>
                        <li>@lang('Formbuild::form.step1')</li>
                        <li>@lang('Formbuild::form.step2')</li>
                        <li>@lang('Formbuild::form.step3')</li>
                        <li>@lang('Formbuild::form.step4')</li>
                        <li>@lang('Formbuild::form.step5')</li>
                    </ol>
                    
                    <h6 class="mt-4">@lang('Formbuild::form.features'):</h6>
                    <ul>
                        <li>@lang('Formbuild::form.feature1')</li>
                        <li>@lang('Formbuild::form.feature2')</li>
                        <li>@lang('Formbuild::form.feature3')</li>
                        <li>@lang('Formbuild::form.feature4')</li>
                    </ul>
                    
                    <div class="alert alert-warning mt-4">
                        <i class="bi bi-exclamation-triangle"></i> @lang('Formbuild::form.file_warning'):
                        <ul>
                            <li>@lang('Formbuild::form.file_warning1')</li>
                            <li>@lang('Formbuild::form.file_warning2')</li>
                            <li>@lang('Formbuild::form.file_warning3')</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">@lang('Formbuild::form.understand')</button>
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
                    <span class="field-title">@lang('Formbuild::form.field') #{number}</span>
                    <span class="badge bg-primary ms-2 field-type-badge">text</span>
                    <span class="badge badge-required ms-1 field-required-badge d-none">@lang('Formbuild::form.required')</span>
                </h5>
                <div>
                    <button class="btn btn-sm btn-outline-secondary me-1" onclick="editFieldSettings({id})" data-bs-toggle="tooltip" title="@lang('Formbuild::form.settings')">
                        <i class="bi bi-gear"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="removeField({id})" 
                            data-bs-toggle="tooltip" title="@lang('Formbuild::form.delete')"
                            onmouseleave="hideTooltip(this)">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
            
            <div class="field-summary">
                <div><strong>@lang('Formbuild::form.name'):</strong> <span class="field-name-summary">field{id}</span></div>
                <div><strong>@lang('Formbuild::form.label'):</strong> <span class="field-label-summary">@lang('Formbuild::form.field') #{number}</span></div>
            </div>
            
            <div class="field-options d-none" id="field-options-{id}">
                <!-- Дополнительные опции для разных типов полей -->
            </div>
        </div>
    </div>
    
@endsection