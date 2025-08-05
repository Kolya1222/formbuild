let isDragAndDropInitialized = false; // Флаг для отслеживания инициализации

// Открытие редактора шаблона
export function openEmailTemplateEditor() {
    const fieldsList = document.getElementById('emailFieldsList');
    fieldsList.innerHTML = '';
    const editor = document.getElementById('emailTemplateEditor');
    
    document.querySelectorAll('.form-field').forEach(field => {
        const name = field.dataset.name;
        const label = field.dataset.label || name;
        if (name) {
            const fieldItem = document.createElement('div');
            fieldItem.className = 'email-field-item';
            fieldItem.draggable = true;
            fieldItem.dataset.name = name;
            fieldItem.innerHTML = `<strong>${label}:</strong> [+${name}.value+]`;
            
            // Проверяем, есть ли поле уже в шаблоне
            if (editor && isFieldInTemplate(name, editor.value)) {
                markFieldAsAdded(fieldItem);
            }
            
            fieldsList.appendChild(fieldItem);
        }
    });
    
    // Инициализируем Drag and Drop только один раз
    if (!isDragAndDropInitialized) {
        initEmailTemplateDragAndDrop();
        isDragAndDropInitialized = true;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('emailTemplateModal'));
    modal.show();
}

// Инициализация Drag and Drop
function initEmailTemplateDragAndDrop() {
    const editor = document.getElementById('emailTemplateEditor');
    
    // Обработчик для делегирования событий
    document.getElementById('emailFieldsList').addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('email-field-item') && !e.target.classList.contains('added')) {
            e.dataTransfer.setData('text/plain', e.target.dataset.name);
        }
    });
    
    editor.addEventListener('dragover', (e) => {
        e.preventDefault();
        editor.classList.add('drag-over');
    });
    
    editor.addEventListener('dragleave', () => {
        editor.classList.remove('drag-over');
    });
    
    editor.addEventListener('drop', (e) => {
        e.preventDefault();
        editor.classList.remove('drag-over');
        
        const fieldName = e.dataTransfer.getData('text/plain');
        if (!fieldName) return;
        
        const fieldItem = document.querySelector(`.email-field-item[data-name="${fieldName}"]`);
        if (!fieldItem || fieldItem.classList.contains('added')) return;
        
        const label = fieldItem.textContent.split(':')[0].trim();
        
        // Вставляем поле в позицию курсора
        const cursorPos = editor.selectionStart;
        const textBefore = editor.value.substring(0, cursorPos);
        const textAfter = editor.value.substring(cursorPos);
        
        editor.value = textBefore + `<span><strong>${label}:</strong> [+${fieldName}.value+]</span>\n` + textAfter;
        
        // Помечаем поле как добавленное
        markFieldAsAdded(fieldItem);
        
        // Устанавливаем курсор после вставленного элемента
        setTimeout(() => {
            const newCursorPos = cursorPos + `<span><strong>${label}:</strong> [+${fieldName}.value+]</span>\n`.length;
            editor.setSelectionRange(newCursorPos, newCursorPos);
            editor.focus();
        }, 0);
    });
    
    // Отслеживаем ручное редактирование
    editor.addEventListener('input', () => {
        updateFieldsState();
    });
}

// Пометить поле как добавленное
function markFieldAsAdded(fieldItem) {
    fieldItem.classList.add('added');
    let checkIcon = fieldItem.querySelector('.bi-check-circle-fill');
    if (!checkIcon) {
        checkIcon = document.createElement('i');
        checkIcon.className = 'bi bi-check-circle-fill text-success ms-2';
        fieldItem.appendChild(checkIcon);
    }
    fieldItem.draggable = false;
}

// Снять отметку добавленного поля
function unmarkFieldAsAdded(fieldItem) {
    fieldItem.classList.remove('added');
    const checkIcon = fieldItem.querySelector('.bi-check-circle-fill');
    if (checkIcon) {
        checkIcon.remove();
    }
    fieldItem.draggable = true;
}

function isFieldInTemplate(fieldName, template) {
    return new RegExp(`\\[\\+${fieldName}\\.value\\+\\]`).test(template);
}

// Обновляем состояние всех полей
function updateFieldsState() {
    const editor = document.getElementById('emailTemplateEditor');
    if (!editor) return;
    
    const template = editor.value;
    
    document.querySelectorAll('.email-field-item').forEach(fieldItem => {
        const name = fieldItem.dataset.name;
        const isAdded = isFieldInTemplate(name, template);
        
        if (isAdded && !fieldItem.classList.contains('added')) {
            markFieldAsAdded(fieldItem);
        } else if (!isAdded && fieldItem.classList.contains('added')) {
            unmarkFieldAsAdded(fieldItem);
        }
    });
}
export function generateDefaultTemplate() {
    let template = `<p>Данные формы:</p>\n<ul>\n`;
    
    document.querySelectorAll('.form-field').forEach(field => {
        const name = field.dataset.name;
        const label = field.dataset.label || name;
        if (name) {
            template += `    <li><strong>${label}:</strong> [+${name}.value+]</li>\n`;
        }
    });
    
    template += `</ul>`;
    
    const editor = document.getElementById('emailTemplateEditor');
    if (editor) {
        editor.value = template;
        updateFieldsState();
    }
    return template;
}
export function saveEmailTemplate() {
    // Обновляем состояние полей
    updateFieldsState();
    generateMarkup();
    const modal = bootstrap.Modal.getInstance(document.getElementById('emailTemplateModal'));
    modal.hide();
}

export function clearEmailTemplate() {
    const editor = document.getElementById('emailTemplateEditor');
    if (editor) {
        editor.value = '';
        updateFieldsState();
    }
}