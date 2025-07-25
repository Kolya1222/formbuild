export function initDragAndDropSystem() {
    const fieldTypes = document.querySelectorAll('.field-type');
    const formFields = document.getElementById('formFields');
    const emptyState = document.getElementById('emptyState');
    
    // 1. Инициализация перетаскивания ТИПОВ полей
    fieldTypes.forEach(type => {
        type.setAttribute('draggable', 'true');
        
        type.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('action', 'add-new-field');
            e.dataTransfer.setData('field-type', this.dataset.type);
            this.classList.add('dragging');
            formFields.classList.add('drag-active');
            if (emptyState) emptyState.classList.add('drag-active');
        });
        
        type.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            formFields.classList.remove('drag-active');
            if (emptyState) emptyState.classList.remove('drag-active');
        });
    });

    // 2. Инициализация перетаскивания существующих полей
    let draggedFieldContainer = null;

    formFields.addEventListener('dragstart', function(e) {
        const fieldElement = e.target.closest('.form-field');
        if (fieldElement) {
            // Запоминаем родительский контейнер поля (div, в котором лежит .form-field)
            draggedFieldContainer = fieldElement.parentNode;
            e.dataTransfer.setData('action', 'reorder-fields');
            e.dataTransfer.setData('field-id', fieldElement.id);
            fieldElement.classList.add('dragging');
            
            document.querySelectorAll('.form-field').forEach(f => {
                f.classList.add('reorder-mode');
            });
        }
    }, true);

    formFields.addEventListener('dragend', function(e) {
        const fieldElement = e.target.closest('.form-field');
        if (fieldElement) {
            fieldElement.classList.remove('dragging');
            document.querySelectorAll('.form-field').forEach(f => {
                f.style.borderTop = '';
                f.style.borderBottom = '';
                f.classList.remove('reorder-mode');
            });
        }
        draggedFieldContainer = null;
    }, true);

    formFields.addEventListener('dragover', function(e) {
        e.preventDefault();
        
        if (e.dataTransfer.types.includes('field-type')) {
            e.dataTransfer.dropEffect = 'copy';
            formFields.classList.add('drag-over-new');
            if (emptyState) emptyState.classList.add('drag-over-new');
        } else if (e.dataTransfer.types.includes('field-id')) {
            e.dataTransfer.dropEffect = 'move';
            
            const field = e.target.closest('.form-field');
            if (field && field.id !== e.dataTransfer.getData('field-id')) {
                const rect = field.getBoundingClientRect();
                const middle = rect.top + rect.height / 2;
                
                document.querySelectorAll('.form-field').forEach(f => {
                    f.style.borderTop = '';
                    f.style.borderBottom = '';
                });
                
                if (e.clientY < middle) {
                    field.style.borderTop = '2px dashed var(--primary)';
                } else {
                    field.style.borderBottom = '2px dashed var(--primary)';
                }
            }
        }
    });

    formFields.addEventListener('dragleave', function(e) {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            document.querySelectorAll('.form-field').forEach(field => {
                field.style.borderTop = '';
                field.style.borderBottom = '';
            });
            formFields.classList.remove('drag-over-new');
            if (emptyState) emptyState.classList.remove('drag-over-new');
        }
    });

    formFields.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Очистка стилей
        document.querySelectorAll('.form-field').forEach(f => {
            f.style.borderTop = '';
            f.style.borderBottom = '';
            f.classList.remove('reorder-mode');
        });
        
        formFields.classList.remove('drag-active', 'drag-over-new');
        if (emptyState) emptyState.classList.remove('drag-active', 'drag-over-new');

        const action = e.dataTransfer.getData('action');
        
        if (action === 'add-new-field') {
            const fieldType = e.dataTransfer.getData('field-type');
            if (fieldType) {
                addFieldByType(fieldType);
                if (emptyState) emptyState.style.display = 'none';
            }
        } else if (action === 'reorder-fields') {
            const fieldId = e.dataTransfer.getData('field-id');
            const draggedElement = document.getElementById(fieldId);
            
            if (!draggedElement || !draggedFieldContainer) return;
            
            const dropTarget = e.target.closest('.form-field');
            
            if (!dropTarget) {
                // Перетащили в пустую область - добавляем в конец
                formFields.appendChild(draggedFieldContainer);
            } else if (draggedElement !== dropTarget) {
                const rect = dropTarget.getBoundingClientRect();
                const middle = rect.top + rect.height / 2;
                const dropTargetContainer = dropTarget.parentNode;
                
                // Убедимся, что оба элемента имеют общего родителя
                if (draggedFieldContainer.parentNode === dropTargetContainer.parentNode) {
                    if (e.clientY < middle) {
                        dropTargetContainer.parentNode.insertBefore(
                            draggedFieldContainer, 
                            dropTargetContainer
                        );
                    } else {
                        dropTargetContainer.parentNode.insertBefore(
                            draggedFieldContainer, 
                            dropTargetContainer.nextSibling
                        );
                    }
                } else {
                    // Если родители разные, просто добавляем в конец
                    formFields.appendChild(draggedFieldContainer);
                }
            }
            
            // Обновляем порядок без изменения ID
            updateFieldsPositions();
        }
    });
}

// Обновляем только позиции без изменения ID
function updateFieldsPositions() {
    const fieldsContainer = document.getElementById('formFields');
    const fieldContainers = Array.from(fieldsContainer.querySelectorAll('div:has(.form-field)'));
    
    fieldContainers.forEach((container, index) => {
        const field = container.querySelector('.form-field');
        if (field) {
            field.dataset.position = index;
            
            // Обновляем обработчики с учетом текущего ID
            const id = field.id.replace('field-', '');
            const editButton = field.querySelector('[onclick*="editFieldSettings"]');
            const removeButton = field.querySelector('[onclick*="removeField"]');
            
            if (editButton) {
                editButton.setAttribute('onclick', `editFieldSettings(${id})`);
            }
            if (removeButton) {
                removeButton.setAttribute('onclick', `removeField(${id})`);
            }
        }
    });
    
    generateMarkup();
}