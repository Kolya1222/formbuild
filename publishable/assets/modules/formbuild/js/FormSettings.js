let currentEditingField = null;
// Редактирование настроек поля
export function editFieldSettings(id) {
    currentEditingField = id;
    const field = document.getElementById(`field-${id}`);
    
    let modalContent = `
        <div class="modal-settings-container">
            <!-- Заголовок секции -->
            <div class="settings-section">
                <h6 class="section-title"><i class="bi bi-gear me-2"></i>Основные настройки</h6>
                
                <div class="mb-3">
                    <label class="form-label">Тип поля</label>
                    <select class="form-select select-field-type" id="fieldType-${id}" onchange="updateFieldSettingsForm(${id})">
                        <option value="text">📝 Текстовое поле</option>
                        <option value="email">✉️ Email</option>
                        <option value="tel">📞 Телефон</option>
                        <option value="password">🔒 Пароль</option>
                        <option value="number">🔢 Число</option>
                        <option value="textarea">📋 Текстовая область</option>
                        <option value="select">▾ Выпадающий список</option>
                        <option value="checkbox">☑️ Чекбокс</option>
                        <option value="radio">🔘 Радиокнопки</option>
                        <option value="file">📎 Файл</option>
                        <option value="hidden">👁️‍🗨️ Скрытое поле</option>
                        <option value="date">📅 Дата</option>
                    </select>
                </div>
                
                <div class="row g-2">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Название (label)</label>
                            <input type="text" class="form-control" id="fieldLabel-${id}" placeholder="Например: Ваше имя">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Имя поля (name)*</label>
                            <input type="text" class="form-control" id="fieldName-${id}" 
                                placeholder="Только латиница" required>
                            <small class="text-muted">Обязательное поле</small>
                        </div>
                    </div>
                </div>
                
                <div class="row g-2">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">ID поля</label>
                            <input type="text" class="form-control" id="fieldId-${id}" 
                                placeholder="Оставьте пустым для автогенерации">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Placeholder</label>
                            <input type="text" class="form-control" id="fieldPlaceholder-${id}" 
                                placeholder="Подсказка внутри поля">
                        </div>
                    </div>
                </div>
                
                <div class="mb-3 form-check form-switch">
                    <input type="checkbox" class="form-check-input" id="fieldRequired-${id}">
                    <label class="form-check-label" for="fieldRequired-${id}">Обязательное поле</label>
                </div>
            </div>
            
            <!-- Специфические настройки -->
            <div class="settings-section" id="fieldSpecificSettings-${id}">
                <h6 class="section-title"><i class="bi bi-tools me-2"></i>Специальные настройки</h6>
                <div class="alert alert-info py-2">
                    <small>Выберите тип поля чтобы увидеть дополнительные параметры</small>
                </div>
            </div>
            
            <!-- Валидация -->
            <div class="settings-section">
                <h6 class="section-title"><i class="bi bi-shield-check me-2"></i>Валидация</h6>
                <div class="row g-2">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Мин. длина</label>
                            <input type="number" class="form-control" id="fieldMinLength-${id}" 
                                placeholder="0" min="0">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Макс. длина</label>
                            <input type="number" class="form-control" id="fieldMaxLength-${id}" 
                                placeholder="255" min="1">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('fieldSettingsModalBody').innerHTML = modalContent;
    // Устанавливаем основные значения
    safeSetValue(`fieldType-${id}`, field.dataset.type);
    safeSetValue(`fieldLabel-${id}`, field.dataset.label);
    safeSetValue(`fieldName-${id}`, field.dataset.name);
    safeSetValue(`fieldId-${id}`, field.dataset.id); // Обратите внимание - используем data-id
    safeSetChecked(`fieldRequired-${id}`, field.dataset.required === 'true');
    safeSetValue(`fieldPlaceholder-${id}`, field.dataset.placeholder);
    safeSetValue(`fieldMinLength-${id}`, field.dataset.minLength);
    safeSetValue(`fieldMaxLength-${id}`, field.dataset.maxLength);
    
    // Обновляем специфические настройки
    updateFieldSettingsForm(id);

    // Заполняем специфические поля после обновления формы
    setTimeout(() => fillSpecificFields(id, field), 50);
    
    const modal = new bootstrap.Modal(document.getElementById('fieldSettingsModal'));
    modal.show();
}
function safeSetValue(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) element.value = value || '';
}

function safeSetChecked(elementId, isChecked) {
    const element = document.getElementById(elementId);
    if (element) element.checked = isChecked;
}
function fillSpecificFields(id, field) {
    switch(field.dataset.type) {
        case 'select':
        case 'radio':
            safeSetValue(`fieldOptions-${id}`, field.dataset.options);
            break;
            
        case 'checkbox':
            safeSetValue(`fieldValue-${id}`, field.dataset.value || '1');
            safeSetChecked(`fieldChecked-${id}`, field.dataset.checked === 'true');
            break;
            
        case 'file':
            safeSetValue(`fieldAccept-${id}`, field.dataset.accept);
            safeSetValue(`fieldMaxSize-${id}`, field.dataset.maxSize);
            break;
            
        case 'hidden':
            safeSetValue(`fieldValue-${id}`, field.dataset.value);
            break;
            
        case 'number':
            safeSetValue(`fieldMin-${id}`, field.dataset.min);
            safeSetValue(`fieldMax-${id}`, field.dataset.max);
            safeSetValue(`fieldStep-${id}`, field.dataset.step || '1');
            break;
            
        case 'textarea':
            safeSetValue(`fieldRows-${id}`, field.dataset.rows || '3');
            break;
    }
}
// Обновление формы настроек в зависимости от типа поля
export function updateFieldSettingsForm(id) {
    const type = document.getElementById(`fieldType-${id}`).value;
    let specificSettings = '';
    
    switch(type) {
        case'text':
            document.getElementById(`fieldName-${id}`).value = `one_message${id}`;
            break;
        case 'email':
            document.getElementById(`fieldName-${id}`).value = `email${id}`;
            break;
        case'tel':
            document.getElementById(`fieldName-${id}`).value = `phone${id}`;
            break;
        case'password':
            document.getElementById(`fieldName-${id}`).value = `password${id}`;
            break;
        case 'select':
            document.getElementById(`fieldName-${id}`).value = `select${id}`;
            break;
        case 'radio':
            document.getElementById(`fieldName-${id}`).value = `radio${id}`;
            specificSettings = `
                <div class="mb-3">
                    <label class="form-label">Опции (каждая с новой строки)</label>
                    <textarea class="form-control" id="fieldOptions-${id}" rows="4" placeholder="Значение1 : Текст1\nЗначение2 : Текст2"></textarea>
                    <div class="form-text">Используйте формат "значение : текст" или просто текст для значения</div>
                </div>
            `;
            break;
            
        case 'checkbox':
            document.getElementById(`fieldName-${id}`).value = `checkbox${id}`;
            specificSettings = `
                <div class="mb-3">
                    <label class="form-label">Значение при выборе</label>
                    <input type="text" class="form-control" id="fieldValue-${id}" value="1">
                </div>
                <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="fieldChecked-${id}">
                    <label class="form-check-label" for="fieldChecked-${id}">Выбрано по умолчанию</label>
                </div>
            `;
            break;
            
        case 'file':
            document.getElementById(`fieldName-${id}`).value = `file${id}`;
            specificSettings = `
                <div class="mb-3">
                    <label class="form-label">Разрешенные типы файлов</label>
                    <input type="text" class="form-control" id="fieldAccept-${id}" placeholder="jpg,png,pdf" data-accept>
                    <div class="form-text">Укажите расширения через запятую (например: jpg,png,pdf). Оставьте пустым для любых файлов</div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Максимальный размер (МБ)</label>
                    <input type="number" class="form-control" id="fieldMaxSize-${id}" placeholder="2" data-max-size>
                    <div class="form-text">Будет преобразовано в килобайты (1 МБ = 1024 КБ)</div>
                </div>
            `;
            break;
            
        case 'hidden':
            document.getElementById(`fieldName-${id}`).value = `hidden${id}`;
            specificSettings = `
                <div class="mb-3">
                    <label class="form-label">Значение</label>
                    <input type="text" class="form-control" id="fieldValue-${id}">
                </div>
            `;
            break;
            
        case 'number':
            document.getElementById(`fieldName-${id}`).value = `number${id}`;
            specificSettings = `
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Минимальное значение</label>
                            <input type="number" class="form-control" id="fieldMin-${id}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Максимальное значение</label>
                            <input type="number" class="form-control" id="fieldMax-${id}">
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Шаг</label>
                    <input type="number" class="form-control" id="fieldStep-${id}" value="1">
                </div>
            `;
            break;
            
        case 'textarea':
            document.getElementById(`fieldName-${id}`).value = `message${id}`;
            specificSettings = `
                <div class="mb-3">
                    <label class="form-label">Количество строк</label>
                    <input type="number" class="form-control" id="fieldRows-${id}" value="3">
                </div>
            `;
            break;
        case 'date':
            document.getElementById(`fieldName-${id}`).value = `date${id}`;
    }
    
    document.getElementById(`fieldSpecificSettings-${id}`).innerHTML = specificSettings;
}
// Сохранение настроек поля
export function saveFieldSettings() {
    if (currentEditingField === null) return;
    
    const id = currentEditingField;
    const field = document.getElementById(`field-${id}`);
    if (!field) return;
    
    // Основные обязательные поля
    const type = document.getElementById(`fieldType-${id}`)?.value || 'text';
    const label = document.getElementById(`fieldLabel-${id}`)?.value || `Поле ${id + 1}`;
    const name = document.getElementById(`fieldName-${id}`)?.value || `field${id}`;
    const fieldId = document.getElementById(`fieldId-${id}`)?.value || name;
    const required = document.getElementById(`fieldRequired-${id}`)?.checked || false;
    const placeholder = document.getElementById(`fieldPlaceholder-${id}`)?.value || '';
    const minLength = document.getElementById(`fieldMinLength-${id}`)?.value || '';
    const maxLength = document.getElementById(`fieldMaxLength-${id}`)?.value || '';
    
    // Обновляем поле
    field.querySelector('.field-title').textContent = label;
    field.querySelector('.field-type-badge').textContent = type;
    field.querySelector('.field-name-summary').textContent = name;
    field.querySelector('.field-label-summary').textContent = label;
    
    const requiredBadge = field.querySelector('.field-required-badge');
    if (required) {
        requiredBadge.classList.remove('d-none');
        requiredBadge.classList.add('badge-required');
        requiredBadge.classList.remove('badge-optional');
    } else {
        requiredBadge.classList.add('d-none');
    }
    
    // Обновляем data-атрибуты
    field.dataset.type = type;
    field.dataset.name = name;
    field.dataset.label = label;
    field.dataset.fieldId = fieldId;
    field.dataset.required = required;
    field.dataset.placeholder = placeholder;
    field.dataset.minLength = minLength;
    field.dataset.maxLength = maxLength;
    
    // Обработка специфических параметров для разных типов полей
    switch(type) {
        case 'select':
        case 'radio':
            field.dataset.options = document.getElementById(`fieldOptions-${id}`)?.value || '';
            break;
            
        case 'checkbox':
            field.dataset.value = document.getElementById(`fieldValue-${id}`)?.value || '';
            field.dataset.checked = document.getElementById(`fieldChecked-${id}`)?.checked || false;
            break;
            
        case 'file':
            field.dataset.accept = document.getElementById(`fieldAccept-${id}`)?.value || '';
            field.dataset.maxSize = document.getElementById(`fieldMaxSize-${id}`)?.value || '';
            break;
            
        case 'hidden':
            field.dataset.value = document.getElementById(`fieldValue-${id}`)?.value || '';
            break;
            
        case 'number':
            field.dataset.min = document.getElementById(`fieldMin-${id}`)?.value || '';
            field.dataset.max = document.getElementById(`fieldMax-${id}`)?.value || '';
            field.dataset.step = document.getElementById(`fieldStep-${id}`)?.value || '';
            break;
            
        case 'textarea':
            field.dataset.rows = document.getElementById(`fieldRows-${id}`)?.value || '';
            break;
    }
    
    // Закрываем модальное окно
    const modal = bootstrap.Modal.getInstance(document.getElementById('fieldSettingsModal'));
    if (modal) modal.hide();
    
    generateMarkup();
}