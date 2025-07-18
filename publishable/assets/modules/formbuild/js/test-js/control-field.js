let fieldCount = 0;

// Общая функция для скрытия tooltip
export function hideTooltip(element) {
    const tooltip = bootstrap.Tooltip.getInstance(element);
    tooltip?.hide();
}

// Общая функция для инициализации tooltip
function initTooltips(element) {
    const tooltipTriggerList = [].slice.call(element.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl, {
        trigger: 'hover focus',
        placement: 'auto',
        delay: { show: 100, hide: 100 }
    }));
}

// Общая функция для создания нового поля
function createNewField(id) {
    const formFields = document.getElementById('formFields');
    const emptyState = document.getElementById('emptyState');
    
    // Исправлено: теперь это присваивание, а не сравнение
    if (emptyState) emptyState.style.display = 'none';
    
    const newField = document.createElement('div');
    newField.innerHTML = document.getElementById('fieldTemplate').innerHTML
        .replace(/{id}/g, id)
        .replace(/{number}/g, id + 1);
    
    formFields.appendChild(newField);
    
    // Добавляем обработчики drag and drop
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
    fieldCount++;
}

// Удаление поля
export function removeField(id) {
    // Скрываем tooltip кнопки удаления
    const button = document.querySelector(`#field-${id} [onclick*="removeField(${id})"]`);
    hideTooltip(button);

    document.querySelector(`#field-${id}`)?.parentNode?.remove();

    // Проверяем наличие полей
    const hasFields = document.querySelectorAll('#formFields > div > .form-field').length > 0;
    if (!hasFields) {
        document.getElementById('emptyState').style.display = 'block';
    }
    
    generateMarkup();
}

// Типы полей и их настройки
const FIELD_TYPES = {
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
    const fieldId = fieldCount++;
    const fieldElement = createNewField(fieldId);
    
    if (!fieldElement) return;
    
    const typeConfig = FIELD_TYPES[type] || FIELD_TYPES.text;
    const name = typeConfig.name + (type === 'text' ? fieldId : '');
    
    // Устанавливаем атрибуты поля
    fieldElement.dataset.type = type;
    if (typeConfig.options) fieldElement.dataset.options = typeConfig.options;
    if (typeConfig.value) fieldElement.dataset.value = typeConfig.value;
    
    // Обновляем отображение поля
    fieldElement.querySelector('.field-title').textContent = typeConfig.label;
    fieldElement.querySelector('.field-type-badge').textContent = type;
    fieldElement.querySelector('.field-name-summary').textContent = name;
    fieldElement.querySelector('.field-label-summary').textContent = typeConfig.label;
    
    // Открываем настройки
    editFieldSettings(fieldId);
}