// Экспортируемая переменная счетчика полей
export let fieldCount = window.fieldCount || 0;

// Функция для получения текущего значения счетчика
export function getFieldCount() {
    return fieldCount;
}

// Функция для установки значения счетчика
export function setFieldCount(value) {
    fieldCount = value;
}

// Функция для инкремента счетчика
export function incrementFieldCount() {
    return fieldCount++;
}

// Общая функция для скрытия tooltip
export function hideTooltip(element) {
    const tooltip = bootstrap.Tooltip.getInstance(element);
    tooltip?.hide();
}

// Общая функция для инициализации tooltip
export function initTooltips(context = document) {
    const tooltipTriggerList = [].slice.call(context.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl, {
        trigger: 'hover focus',
        placement: 'auto',
        delay: { show: 100, hide: 100 }
    }));
}

// Общая функция для создания нового поля
export function createNewField(id) {
    const formFields = document.getElementById('formFields');
    const emptyState = document.getElementById('emptyState');
    
    if (emptyState) emptyState.style.display = 'none';
    
    const newField = document.createElement('div');
    newField.innerHTML = document.getElementById('fieldTemplate').innerHTML
        .replace(/{id}/g, id)
        .replace(/{number}/g, id + 1);
    
    formFields.appendChild(newField);
    
    const fieldElement = newField.querySelector('.form-field');
    fieldElement.addEventListener('dragend', function() {
        this.classList.remove('dragging');
        document.querySelectorAll('.form-field').forEach(field => {
            field.style.borderTop = '';
        });
    });
    
    initTooltips(newField);
    return fieldElement;
}

// Добавление нового поля
export function addField() {
    createNewField(fieldCount);
    editFieldSettings(fieldCount);
    incrementFieldCount();
}

// Удаление поля
export function removeField(id) {
    const fieldContainer = document.querySelector(`#field-${id}`)?.parentNode;
    const removeButton = document.querySelector(`#field-${id} [onclick*="removeField(${id})"]`);
    
    if (removeButton) {
        const tooltip = bootstrap.Tooltip.getInstance(removeButton);
        tooltip?.hide();
    }
    
    if (fieldContainer) {
        fieldContainer.remove();
    }
    
    const hasFields = document.querySelectorAll('#formFields > div > .form-field').length > 0;
    const emptyState = document.getElementById('emptyState');
    
    if (emptyState) {
        emptyState.style.display = hasFields ? 'none' : 'block';
    }
    
    generateMarkup();
}

// Типы полей и их настройки
export const FIELD_TYPES = {
    text: { label: 'Текстовое поле', name: 'text_' },
    email: { label: 'Email', name: 'email' },
    tel: { label: 'Телефон', name: 'phone' },
    password: { label: 'Пароль', name: 'password' },
    number: { label: 'Число', name: 'number' },
    textarea: { label: 'Текстовая область', name: 'message' },
    select: { 
        label: 'Выпадающий список', 
        name: 'select',
        options: "option1 : Вариант 1\noption2 : Вариант 2\noption3 : Вариант 3"
    },
    checkbox: { 
        label: 'Чекбокс', 
        name: 'agree',
        value: '1'
    },
    radio: { 
        label: 'Радиокнопки', 
        name: 'radio_group',
        options: "option1 : Вариант 1\noption2 : Вариант 2"
    },
    file: { label: 'Загрузка файла', name: 'file' },
    hidden: { 
        label: 'Скрытое поле', 
        name: 'hidden_field',
        value: 'default_value'
    },
    date: { label: 'Дата', name: 'date' }
};

// Функция для добавления поля определенного типа
export function addFieldByType(type) {
    // Проверяем, не открыто ли уже модальное окно
    if (document.querySelector('.modal.show')) {
        return; // Не создаем новое поле, если уже открыто какое-то модальное окно
    }

    const fieldId = getFieldCount();
    const fieldElement = createNewField(fieldId);
    
    if (!fieldElement) return;
    
    const typeConfig = FIELD_TYPES[type] || FIELD_TYPES.text;
    const name = typeConfig.name + (type === 'text' ? fieldId : '');
    
    fieldElement.dataset.type = type;
    if (typeConfig.options) fieldElement.dataset.options = typeConfig.options;
    if (typeConfig.value) fieldElement.dataset.value = typeConfig.value;
    
    fieldElement.querySelector('.field-title').textContent = typeConfig.label;
    fieldElement.querySelector('.field-type-badge').textContent = type;
    fieldElement.querySelector('.field-name-summary').textContent = name;
    fieldElement.querySelector('.field-label-summary').textContent = typeConfig.label;
    
    editFieldSettings(fieldId);
    incrementFieldCount();
}