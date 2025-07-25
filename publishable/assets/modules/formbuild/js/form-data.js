// Получение всех данных полей формы
export function getAllFieldsData() {
    const fields = [];
    document.querySelectorAll('#formFields .form-field').forEach((field, index) => {
        const fieldData = {
            id: field.dataset.fieldId,
            type: field.dataset.type,
            name: field.dataset.name,
            label: field.dataset.label,
            required: field.dataset.required === 'true',
            placeholder: field.dataset.placeholder || '',
            minLength: field.dataset.minLength || '',
            maxLength: field.dataset.maxLength || '',
            position: index
        };

        // Добавляем специфические атрибуты для разных типов полей
        switch(field.dataset.type) {
            case 'select':
            case 'radio':
                fieldData.options = field.dataset.options || '';
                break;
                
            case 'checkbox':
                fieldData.value = field.dataset.value || '';
                fieldData.checked = field.dataset.checked === 'true';
                break;
                
            case 'file':
                fieldData.accept = field.dataset.accept || '';
                fieldData.maxSize = field.dataset.maxSize || '';
                break;
                
            case 'hidden':
                fieldData.value = field.dataset.value || '';
                break;
                
            case 'number':
                fieldData.min = field.dataset.min || '';
                fieldData.max = field.dataset.max || '';
                fieldData.step = field.dataset.step || '';
                break;
                
            case 'textarea':
                fieldData.rows = field.dataset.rows || '';
                break;
                
            case 'date':
                // Можно добавить специфические атрибуты для даты, если они есть
                break;
        }

        fields.push(fieldData);
    });
    return fields;
}

// Получение настроек формы
export function getFormSettings() {
    return {
        formId: document.getElementById('formId').value,
        method: document.getElementById('formMethod').value,
        action: document.getElementById('formAction').value,
        email: document.getElementById('formEmail').value,
        multipart: document.getElementById('formMultipart').checked,
        ajaxSend: document.getElementById('formSender').checked
    };
}

// Загрузка настроек формы
export function loadFormSettings(settings) {
    if (!settings) return;
    
    document.getElementById('formId').value = settings.formId || 'myForm';
    document.getElementById('formMethod').value = settings.method || 'POST';
    document.getElementById('formMethodSelected').textContent = settings.method || 'POST';
    document.getElementById('formAction').value = settings.action || '';
    document.getElementById('formEmail').value = settings.email || '';
    document.getElementById('formMultipart').checked = settings.multipart || false;
    document.getElementById('formSender').checked = settings.ajaxSend !== false;
}