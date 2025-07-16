export function initDragAndDropSystem() {
    // 1. Инициализация перетаскивания ТИПОВ полей (из палитры в рабочую область)
    const fieldTypes = document.querySelectorAll('.field-type');
    fieldTypes.forEach(type => {
        type.setAttribute('draggable', 'true');
        type.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('action', 'add-new-field');
            e.dataTransfer.setData('field-type', this.dataset.type);
            this.classList.add('dragging');
        });
        type.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });

    // 2. Инициализация перетаскивания СУЩЕСТВУЮЩИХ полей (внутри рабочей области)
    const formFields = document.getElementById('formFields');
    let draggedField = null;

    // Обработчики для существующих полей формы
    formFields.addEventListener('dragstart', function(e) {
        if (e.target.classList.contains('form-field')) {
            draggedField = e.target;
            e.dataTransfer.setData('action', 'reorder-fields');
            e.dataTransfer.setData('field-id', draggedField.id);
            draggedField.classList.add('dragging');
        }
    }, true);

    formFields.addEventListener('dragend', function(e) {
        if (e.target.classList.contains('form-field')) {
            e.target.classList.remove('dragging');
            document.querySelectorAll('.form-field').forEach(f => {
                f.style.borderTop = '';
            });
        }
    }, true);

    // Общие обработчики для области формы
    formFields.addEventListener('dragover', function(e) {
        e.preventDefault();
        
        if (e.dataTransfer.types.includes('field-type')) {
            e.dataTransfer.dropEffect = 'copy';
        } else if (e.dataTransfer.types.includes('field-id')) {
            e.dataTransfer.dropEffect = 'move';
            
            const field = e.target.closest('.form-field');
            if (field && field !== draggedField) {
                const rect = field.getBoundingClientRect();
                const middle = rect.top + rect.height / 2;
                field.style.borderTop = e.clientY < middle ? '2px solid var(--primary-color)' : '';
            }
        }
    });

    formFields.addEventListener('dragleave', function(e) {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            document.querySelectorAll('.form-field').forEach(field => {
                field.style.borderTop = '';
            });
        }
    });

    formFields.addEventListener('drop', function(e) {
        e.preventDefault();
        document.querySelectorAll('.form-field').forEach(f => {
            f.style.borderTop = '';
        });

        const action = e.dataTransfer.getData('action');
        
        if (action === 'add-new-field') {
            const fieldType = e.dataTransfer.getData('field-type');
            if (fieldType) {
                addFieldByType(fieldType);
            }
        } else if (action === 'reorder-fields') {
            const fieldId = e.dataTransfer.getData('field-id');
            const draggedElement = document.getElementById(fieldId);
            const dropTarget = e.target.closest('.form-field');
            
            if (draggedElement && dropTarget && draggedElement !== dropTarget) {
                const rect = dropTarget.getBoundingClientRect();
                const middle = rect.top + rect.height / 2;
                
                if (e.clientY < middle) {
                    dropTarget.parentNode.insertBefore(draggedElement, dropTarget);
                } else {
                    dropTarget.parentNode.insertBefore(draggedElement, dropTarget.nextSibling);
                }
            }
        }
    });
}