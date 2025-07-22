export function initDragAndDropSystem() {
    // 1. Инициализация перетаскивания ТИПОВ полей (из палитры в рабочую область)
    const fieldTypes = document.querySelectorAll('.field-type');
    const formFields = document.getElementById('formFields');
    const emptyState = document.getElementById('emptyState');
    
    // Добавляем визуальный стиль для области перетаскивания
    formFields.style.minHeight = '200px';
    formFields.style.transition = 'all 0.3s ease';
    
    fieldTypes.forEach(type => {
        type.setAttribute('draggable', 'true');
        type.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('action', 'add-new-field');
            e.dataTransfer.setData('field-type', this.dataset.type);
            this.classList.add('dragging');
            
            // Добавляем класс для всей формы при начале перетаскивания
            formFields.classList.add('drag-active');
            if (emptyState) emptyState.classList.add('drag-active');
        });
        
        type.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            formFields.classList.remove('drag-active');
            if (emptyState) emptyState.classList.remove('drag-active');
        });
    });

    // 2. Инициализация перетаскивания СУЩЕСТВУЮЩИХ полей (внутри рабочей области)
    let draggedField = null;

    // Обработчики для существующих полей формы
    formFields.addEventListener('dragstart', function(e) {
        if (e.target.classList.contains('form-field')) {
            draggedField = e.target;
            e.dataTransfer.setData('action', 'reorder-fields');
            e.dataTransfer.setData('field-id', draggedField.id);
            draggedField.classList.add('dragging');
            
            // Добавляем индикатор для всех полей
            document.querySelectorAll('.form-field').forEach(f => {
                f.classList.add('reorder-mode');
            });
        }
    }, true);

    formFields.addEventListener('dragend', function(e) {
        if (e.target.classList.contains('form-field')) {
            e.target.classList.remove('dragging');
            document.querySelectorAll('.form-field').forEach(f => {
                f.style.borderTop = '';
                f.classList.remove('reorder-mode');
            });
        }
    }, true);

    // Общие обработчики для области формы
    formFields.addEventListener('dragover', function(e) {
        e.preventDefault();
        
        if (e.dataTransfer.types.includes('field-type')) {
            e.dataTransfer.dropEffect = 'copy';
            // Визуальный эффект при перетаскивании нового поля
            formFields.classList.add('drag-over-new');
            if (emptyState) emptyState.classList.add('drag-over-new');
        } else if (e.dataTransfer.types.includes('field-id')) {
            e.dataTransfer.dropEffect = 'move';
            
            const field = e.target.closest('.form-field');
            if (field && field !== draggedField) {
                const rect = field.getBoundingClientRect();
                const middle = rect.top + rect.height / 2;
                
                // Убираем предыдущие индикаторы
                document.querySelectorAll('.form-field').forEach(f => {
                    f.style.borderTop = '';
                    f.style.borderBottom = '';
                });
                
                // Добавляем индикатор в зависимости от позиции
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
        
        // Убираем все визуальные эффекты
        document.querySelectorAll('.form-field').forEach(f => {
            f.style.borderTop = '';
            f.style.borderBottom = '';
        });
        formFields.classList.remove('drag-active', 'drag-over-new');
        if (emptyState) emptyState.classList.remove('drag-active', 'drag-over-new');

        const action = e.dataTransfer.getData('action');
        
        if (action === 'add-new-field') {
            const fieldType = e.dataTransfer.getData('field-type');
            if (fieldType) {
                addFieldByType(fieldType);
                // Скрываем пустое состояние после добавления первого поля
                if (emptyState) emptyState.style.display = 'none';
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
                
                // Обновляем порядок полей в данных
                updateFieldsOrder();
            }
        }
    });
    
    // Функция для обновления порядка полей
    function updateFieldsOrder() {
        const fieldsContainer = document.getElementById('formFields');
        const fields = Array.from(fieldsContainer.querySelectorAll('.form-field'));
        
        // Здесь можно обновить порядок полей в вашем состоянии/массиве
        console.log('Порядок полей обновлен:', fields.map(f => f.id));
    }
}