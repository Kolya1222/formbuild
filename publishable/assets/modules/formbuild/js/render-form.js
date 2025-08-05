import { showToast } from './form-utils.js';
export function generateMarkup() {
    try {
        const fields = document.querySelectorAll('#formFields > div > .form-field');
        const formId = document.getElementById('formId').value || 'myForm';
        const formMethod = document.getElementById('formMethod').value || 'post';
        const formAction = document.getElementById('formAction').value || '';
        const formMultipart = document.getElementById('formMultipart').checked;
        const formSender = document.getElementById('formSender').checked;
        const formEmail = document.getElementById('formEmail').value || '';
        window.currentFormId = formId;
        
        let htmlOutput = '';
        let previewOutput = '';
        let paramsOutput = '';
        if (formSender) {
            paramsOutput = '<?php\n';
        }
        paramsOutput += formSender ? 'return [\n' : 'public function setData() {\n';
        paramsOutput += formSender ? `    'api' => 2,\n` : `    \$this->data['${formId}_form'] = evolutionCMS()->runSnippet('FormLister', [\n`;

        // Обертка для formSender
        if (formSender) {
            htmlOutput += '<div class="form-wrapper">\n';
            previewOutput += '<div class="form-wrapper">\n';
        }

        // Начало формы
        htmlOutput += `    <form id="${formId}" name="${formId}" method="${formMethod}"${formAction ? ` action="${formAction}"` : ''}${formMultipart ? ' enctype="multipart/form-data"' : ''}>\n`;
        htmlOutput += `        <input type="hidden" name="formid" value="${formId}">\n`;

        previewOutput += `        <form id="previewForm" class="needs-validation" novalidate>\n`;
        previewOutput += `            <input type="hidden" name="formid" value="${formId}">\n`;

        paramsOutput += `    'formid' => '${formId}',\n`;
        paramsOutput += `    'rules' => [\n`;
            
        // Собираем правила валидации
        let validationRules = [];
        let hasFileFields = false;
        let fileFields = [];

        fields.forEach((field, index) => {
            
            const type = field.dataset.type || 'text';
            const label = field.dataset.label || `Поле ${index + 1}`;
            const name = field.dataset.name || `field${index + 1}`;
            if (!name && !label) return;
            
            const fieldId = field.dataset.fieldId || name;
            const required = field.dataset.required === 'true';
            const placeholder = field.dataset.placeholder || '';
            const minLength = field.dataset.minLength || '';
            const maxLength = field.dataset.maxLength || '';
            
            // Генерация HTML
            htmlOutput += `        <!-- ${label} -->\n`;
            if (formSender) {
                htmlOutput += `        <div class="form-group" data-field="${fieldId}">\n`;
                previewOutput += `        <div class="form-group" data-field="${fieldId}">\n`;
            } else {
                htmlOutput += `        <div class="mb-3">\n`;
                previewOutput += `        <div class="mb-3">\n`;
            }
            
            if (type !== 'hidden' && type !== 'checkbox') {
                htmlOutput += `            <label for="${fieldId}" class="form-label">${label}</label>\n`;
                previewOutput += `            <label for="preview-${fieldId}" class="form-label">${label}</label>\n`;
            }
            
            switch(type) {
                case 'text':
                case 'email':
                case 'tel':
                case 'password':
                case 'number':
                case 'date':
                    htmlOutput += `            <input type="${type}" name="${name}" id="${fieldId}" class="form-control"${placeholder ? ` placeholder="${placeholder}"` : ''}${required ? ' required' : ''}>\n`;
                    previewOutput += `            <input type="${type}" class="form-control" id="preview-${fieldId}"${placeholder ? ` placeholder="${placeholder}"` : ''}${required ? ' required' : ''}>\n`;
                    break;
                    
                case 'textarea':
                    const rows = field.dataset.rows || 3;
                    htmlOutput += `            <textarea name="${name}" id="${fieldId}" class="form-control" rows="${rows}"${placeholder ? ` placeholder="${placeholder}"` : ''}${required ? ' required' : ''}></textarea>\n`;
                    previewOutput += `            <textarea class="form-control" id="preview-${fieldId}" rows="${rows}"${placeholder ? ` placeholder="${placeholder}"` : ''}${required ? ' required' : ''}></textarea>\n`;
                    break;
                    
                case 'select':
                    const optionsText = field.dataset.options || '';
                    const options = optionsText.split('\n').filter(opt => opt.trim() !== '');
                    
                    htmlOutput += `            <select name="${name}" id="${fieldId}" class="form-select"${required ? ' required' : ''}>\n`;
                    previewOutput += `            <select class="form-select" id="preview-${fieldId}"${required ? ' required' : ''}>\n`;
                    
                    options.forEach(opt => {
                        const parts = opt.split(':').map(p => p.trim());
                        const value = parts.length > 1 ? parts[0] : parts[0];
                        const text = parts.length > 1 ? parts[1] : parts[0];
                        
                        htmlOutput += `                <option value="${value}">${text}</option>\n`;
                        previewOutput += `                <option>${text}</option>\n`;
                    });
                    htmlOutput += `            </select>\n`;
                    previewOutput += `            </select>\n`;
                    break;
                    
                case 'checkbox':
                    const checkboxValue = field.dataset.value || '1';
                    const checked = field.dataset.checked === 'true';
                    
                    htmlOutput += `            <div class="form-check">\n`;
                    htmlOutput += `                <input type="checkbox" name="${name}" id="${fieldId}" class="form-check-input" value="${checkboxValue}"${checked ? ' checked' : ''}${required ? ' required' : ''}>\n`;
                    htmlOutput += `                <label for="${fieldId}" class="form-check-label">${label}</label>\n`;
                    htmlOutput += `            </div>\n`;
                    
                    previewOutput += `            <div class="form-check">\n`;
                    previewOutput += `                <input type="checkbox" class="form-check-input" id="preview-${fieldId}"${checked ? ' checked' : ''}${required ? ' required' : ''}>\n`;
                    previewOutput += `                <label for="preview-${fieldId}" class="form-check-label">${label}</label>\n`;
                    previewOutput += `            </div>\n`;
                    break;
                    
                case 'radio':
                    const radioOptionsText = field.dataset.options || '';
                    const radioOptions = radioOptionsText.split('\n').filter(opt => opt.trim() !== '');
                    
                    radioOptions.forEach((opt, i) => {
                        const parts = opt.split(':').map(p => p.trim());
                        const value = parts.length > 1 ? parts[0] : parts[0];
                        const text = parts.length > 1 ? parts[1] : parts[0];
                        const radioId = `${fieldId}-${i}`;
                        
                        htmlOutput += `            <div class="form-check">\n`;
                        htmlOutput += `                <input type="radio" name="${name}" id="${radioId}" class="form-check-input" value="${value}"${i === 0 && required ? ' required' : ''}>\n`;
                        htmlOutput += `                <label for="${radioId}" class="form-check-label">${text}</label>\n`;
                        htmlOutput += `            </div>\n`;
                        
                        previewOutput += `            <div class="form-check">\n`;
                        previewOutput += `                <input type="radio" class="form-check-input" name="preview-${name}" id="preview-${radioId}"${i === 0 && required ? ' required' : ''}>\n`;
                        previewOutput += `                <label for="preview-${radioId}" class="form-check-label">${text}</label>\n`;
                        previewOutput += `            </div>\n`;
                    });
                    break;
                    
                case 'file':
                    const accept = field.dataset.accept || '';
                    const maxSize = field.dataset.maxSize || '';
                    const multiple = field.dataset.multiple === 'true';
                    htmlOutput += `            <input type="file" name="${name}${multiple ? '[]' : ''}" id="${fieldId}" class="form-control"${multiple ? ' multiple' : ''}${accept ? ` accept="${accept}"` : ''}${required ? ' required' : ''}${maxSize ? ` data-max-size="${maxSize}"` : ''}>\n`;
                    previewOutput += `            <input type="file" class="form-control" id="preview-${fieldId}"${multiple ? ' multiple' : ''}${required ? ' required' : ''}>\n`;
                    hasFileFields = true;
                    fileFields.push({
                        name: name,
                        required: required,
                        accept: accept,
                        maxSize: maxSize,
                        multiple: multiple
                    });
                    break;
                    
                case 'hidden':
                    const value = field.dataset.value || '';
                    htmlOutput += `            <input type="hidden" name="${name}" id="${fieldId}" value="${value}">\n`;
                    break;
            }
            if (!formSender) {
                htmlOutput += `            <div class="invalid-feedback">{!! \$data['${name}.error'] ?? '' !!}</div>\n`;
                previewOutput += `            <div class="invalid-feedback">Сообщение об ошибке для ${label}</div>\n`;
            }
            // Закрываем div для группы полей
            htmlOutput += `        </div>\n`;
            previewOutput += `        </div>\n`;

            // Генерация правил валидации
            if ((required || minLength || maxLength || type === 'number' || type === 'email') && type !== 'file') {
                let rule = `        '${name}' => [\n`;
                
                if (required) {
                    rule += `            'required' => 'Обязательно введите ${label.toLowerCase()}',\n`;
                }
                
                if (type === 'email') {
                    rule += `            'email' => 'Введите корректный email',\n`;
                }
                
                if (type === 'tel') {
                    rule += `            'phone' => 'Введите корректный номер телефона',\n`;
                }
                
                if (minLength) {
                    rule += `            'minLength' => [\n`;
                    rule += `                'params' => ${minLength},\n`;
                    rule += `                'message' => '${label} должно быть не менее ${minLength} символов'\n`;
                    rule += `            ],\n`;
                }
                
                if (maxLength) {
                    rule += `            'maxLength' => [\n`;
                    rule += `                'params' => ${maxLength},\n`;
                    rule += `                'message' => '${label} должно быть не более ${maxLength} символов'\n`;
                    rule += `            ],\n`;
                }
                
                if (type === 'number') {
                    if (field.dataset.min) {
                        rule += `            'min' => Число должно быть не меньше ${field.dataset.min},\n`;
                    }
                    if (field.dataset.max) {
                        rule += `            'max' => Число должно быть не больше ${field.dataset.max},\n`;
                    }
                }
                
                rule = rule.replace(/,\n$/, '\n');
                rule += `        ]`;
                validationRules.push(rule);
            }
        });

        paramsOutput += validationRules.join(',\n');
        paramsOutput += `\n    ],\n`;
            
        // File rules
        if (hasFileFields) {
            paramsOutput += `    'fileRules' => [\n`;
            
            let fileRules = [];
            fileFields.forEach(field => {
                let rule = `        '${field.name}' => [\n`;
                
                if (field.required) {
                    rule += `            'required' => 'Обязательно выберите файл',\n`;
                }
                if (field.optional){
                    rule += `            'optional' => 'Пожалуйста, прикрепите файл',\n`;
                }
                if (field.accept) {
                    rule += `            'allowed'=> [\n`
                    const extensions = field.accept.split(',').map(ext => ext.trim().replace(/^\./, ''));
                    rule += `                'params' => [[${extensions.map(ext => `"${ext}"`).join(', ')}]],\n`;
                    rule += `                'message'=> 'Разрешены только файлы с расширением:${extensions.map(ext => `"${ext}"`).join(', ')}'\n`;
                    rule += `            ],\n`;
                }
                
                if (field.maxSize) {
                    rule += `            'maxSize'=> [\n`
                    const maxSizeKB = parseInt(field.maxSize) * 1024;
                    rule += `                'params' => ${maxSizeKB},\n`;
                    rule += `                'message'=> 'Разрешены только файлы не превыщающие ${maxSizeKB}'\n`;
                    rule += `            ],\n`;
                }
                
                rule = rule.replace(/,\n$/, '\n');
                rule += `        ]`;
                fileRules.push(rule);
            });
            
            paramsOutput += fileRules.join(',\n');
            paramsOutput += `\n    ],\n`;
        }
            
        // Общие параметры формы
        if (!formSender) {
            paramsOutput += `    'formTpl' => '@B_FILE:parts/${formId}_form',\n`;
        }
        if (formEmail){
            paramsOutput += `    'to' => '${formEmail}',\n`;
        }else{
            paramsOutput += `    'to' => 'your@email.com',\n`;
        }
        paramsOutput += `    'errorClass' => 'is-invalid',\n`;
        paramsOutput += `    'requiredClass' => 'is-invalid',\n`;
        paramsOutput += `    'subject' => 'Новое сообщение с формы ${formId}',\n`;
        paramsOutput += `    'messagesOuterTpl' => '@CODE:<div class="alert alert-danger" role="alert">[+messages+]</div>',\n`;
        paramsOutput += `    'errorTpl' => '@CODE:<span class="error-message">[+message+]</span>',\n`;
        paramsOutput += `    'successTpl' => '@CODE:<div class="alert alert-success" role="alert">Спасибо! Ваше сообщение отправлено.</div>',\n`;
            
        // Генерация шаблона письма
        paramsOutput += `    'reportTpl' => '@CODE:\n`;
        
        // Проверяем, есть ли редактор шаблона в DOM
        const emailEditor = document.getElementById('emailTemplateEditor');
        if (emailEditor && emailEditor.value) {
            // Используем сохраненный шаблон из редактора
            paramsOutput += `        ${emailEditor.value}',\n`;
        } else {
            // Генерируем шаблон по умолчанию
            paramsOutput += `        <p>Данные формы:</p>\n`;
            paramsOutput += `        <ul>\n`;
                
            fields.forEach(field => {
                const name = field.dataset.name;
                const label = field.dataset.label || name;
                if (name) {
                    paramsOutput += `            <li><strong>${label}:</strong> [+${name}.value+]</li>\n`;
                }
            });
                
            paramsOutput += `        </ul>',\n`;
        }
            
        // Завершение формы
        htmlOutput += `        <button type="submit" class="btn btn-primary">Отправить</button>\n`;
        htmlOutput += `    </form>\n`;
        if (formSender) {
            htmlOutput += `</div>\n`;
        }

        previewOutput += `        <div class="mt-3">\n`;
        previewOutput += `            <button type="submit" class="btn btn-primary me-2">Отправить</button>\n`;
        previewOutput += `            <button type="reset" class="btn btn-outline-secondary">Очистить</button>\n`;
        previewOutput += `        </div>\n`;
        previewOutput += `    </form>\n`;
        if (formSender) {
            previewOutput += `</div>\n`;
        }

        // Завершение параметров
        if (formSender) {
            paramsOutput += `];\n`;
        } else {
            paramsOutput += `    ]);\n`;
            paramsOutput += `}\n`;
        }
        window.FormBuilder = paramsOutput;
        document.getElementById('outputHtml').textContent = htmlOutput;
        document.getElementById('outputParams').textContent = paramsOutput;
        document.getElementById('formPreview').innerHTML = previewOutput;
        addPreviewFormHandler();
        showGenerationSuccess();
    } catch (error) {
        showGenerationError(error);
    }
}

// Функция для обработки формы предпросмотра
export function addPreviewFormHandler() {
    const previewForm = document.getElementById('previewForm');
    if (!previewForm) return;

    previewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Сбрасываем предыдущие ошибки
        this.querySelectorAll('.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
        });
        
        // Проверяем валидность
        if (!this.checkValidity()) {
            e.stopPropagation();
            
            // Добавляем классы для невалидных полей
            this.querySelectorAll(':invalid').forEach(field => {
                field.classList.add('is-invalid');
            });
            
            // Фокусируемся на первом невалидном поле
            const firstInvalid = this.querySelector(':invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        } else {
            alert('Форма валидна! (Это демо, форма не отправляется)');
        }
        
        this.classList.add('was-validated');
    });

    // Обработчик сброса формы
    const resetBtn = previewForm.querySelector('[type="reset"]');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            previewForm.classList.remove('was-validated');
            previewForm.querySelectorAll('.is-invalid').forEach(el => {
                el.classList.remove('is-invalid');
            });
        });
    }

    // Сброс ошибок при вводе
    previewForm.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                this.classList.remove('is-invalid');
            }
        });
    });
}
export function showGenerationSuccess() {
    showToast('Форма успешно сгенерирована!', 'success', {
        position: 'top-center',
        delay: 2000
    });
    highlightOutputBlocks();
}

export function showGenerationError(error) {
    const errorMessage = error instanceof Error ? error.message : 'Произошла неизвестная ошибка';
    showToast(`Ошибка: ${errorMessage}`, 'danger', {
        position: 'top-center',
        delay: 5000
    });
}

function highlightOutputBlocks() {
    const blocks = [
        document.getElementById('outputHtml'),
        document.getElementById('outputParams'),
        document.getElementById('formPreview')
    ];
    
    blocks.forEach(block => {
        if (block) {
            block.classList.add('highlight');
            setTimeout(() => block.classList.remove('highlight'), 2000);
        }
    });
}