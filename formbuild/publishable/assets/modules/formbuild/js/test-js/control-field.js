let fieldCount = 0;
export function hideTooltip(element) {
    const tooltip = bootstrap.Tooltip.getInstance(element);
    if (tooltip) {
        tooltip.hide();
    }
}

// Добавление нового поля
export function addField() {
    const formFields = document.getElementById('formFields');
    const emptyState = document.getElementById('emptyState');
    
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    const newField = document.createElement('div');
    newField.innerHTML = document.getElementById('fieldTemplate').innerHTML
        .replace(/{id}/g, fieldCount)
        .replace(/{number}/g, fieldCount + 1);
    
    formFields.appendChild(newField);
    // Добавляем обработчики drag and drop для нового поля
    newField.querySelector('.form-field').addEventListener('dragend', function() {
        this.classList.remove('dragging');
        document.querySelectorAll('.form-field').forEach(field => {
            field.style.borderTop = '';
        });
    });
    const tooltipTriggerList = [].slice.call(newField.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    editFieldSettings(fieldCount);
    
    fieldCount++;
}


export function removeField(id) {
    // Скрываем tooltip кнопки удаления
    const button = document.querySelector(`#field-${id} [onclick="removeField(${id})"]`);
    if (button) hideTooltip(button);

    const fieldWrapper = document.querySelector(`#field-${id}`).parentNode; // Находим обёртку
    if (fieldWrapper) fieldWrapper.remove(); // Удаляем всю обёртку

    // Проверяем, есть ли ещё поля внутри #formFields
    const hasFields = document.querySelectorAll('#formFields > div > .form-field').length > 0;
    
    if (!hasFields) {
        document.getElementById('emptyState').style.display = 'block';
    }
    
    generateMarkup();
}      
// Функция для добавления поля определенного типа
export function addFieldByType(type) {
    const fieldId = fieldCount++;
    const formFields = document.getElementById('formFields');
    const emptyState = document.getElementById('emptyState');
    
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    const newField = document.createElement('div');
    newField.innerHTML = document.getElementById('fieldTemplate').innerHTML
        .replace(/{id}/g, fieldId)
        .replace(/{number}/g, fieldId + 1);
    
    formFields.appendChild(newField);
    
    // Устанавливаем тип поля
    const fieldElement = document.getElementById(`field-${fieldId}`);
    fieldElement.dataset.type = type;
    
    // Устанавливаем стандартные значения для типа
    let label = '';
    let name = `field${fieldId}`;
    
    switch(type) {
        case 'text':
            label = 'Текстовое поле';
            name = 'text_' + fieldId;
            break;
        case 'email':
            label = 'Email';
            name = 'email';
            break;
        case 'tel':
            label = 'Телефон';
            name = 'phone';
            break;
        case 'password':
            label = 'Пароль';
            name = 'password';
            break;
        case 'number':
            label = 'Число';
            name = 'number';
            break;
        case 'textarea':
            label = 'Текстовая область';
            name = 'message';
            break;
        case 'select':
            label = 'Выпадающий список';
            name = 'select';
            fieldElement.dataset.options = "option1 : Вариант 1\noption2 : Вариант 2\noption3 : Вариант 3";
            break;
        case 'checkbox':
            label = 'Чекбокс';
            name = 'agree';
            fieldElement.dataset.value = '1';
            break;
        case 'radio':
            label = 'Радиокнопки';
            name = 'radio_group';
            fieldElement.dataset.options = "option1 : Вариант 1\noption2 : Вариант 2";
            break;
        case 'file':
            label = 'Загрузка файла';
            name = 'file';
            break;
        case 'hidden':
            label = 'Скрытое поле';
            name = 'hidden_field';
            fieldElement.dataset.value = 'default_value';
            break;
        case 'date':
            label = 'Дата';
            name = 'date';
            break;
    }
    
    // Обновляем отображение поля
    fieldElement.querySelector('.field-title').textContent = label;
    fieldElement.querySelector('.field-type-badge').textContent = type;
    fieldElement.querySelector('.field-name-summary').textContent = name;
    fieldElement.querySelector('.field-label-summary').textContent = label;
    
    // Инициализация tooltip
    const tooltipTriggerList = [].slice.call(newField.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Открываем настройки для нового поля
    editFieldSettings(fieldId);
}  