import { initDragAndDropSystem } from './drag-drop.js';
import { generateMarkup } from './render-form.js';
import { editFieldSettings, updateFieldSettingsForm, saveFieldSettings } from './FormSettings.js';
import { hideTooltip, addField, removeField, addFieldByType, initTooltips, createNewField, FIELD_TYPES } from './control-field.js';
import { confirmFileGeneration } from './file-generation.js';
import { saveForm, confirmSaveForm } from './save-form.js';
import { loadForm, loadSavedForm, deleteSavedForm } from './load-form.js';
import { initFormTabs } from './form-utils.js';

// Делаем функции глобальными для доступа из HTML
const GLOBAL_FUNCTIONS = {
    copyToClipboard,
    editFieldSettings,
    updateFieldSettingsForm,
    saveFieldSettings,
    removeField,
    addFieldByType,
    addField,
    hideTooltip,
    generateMarkup,
    confirmFileGeneration,
    createNewField,
    FIELD_TYPES,
    saveForm,
    confirmSaveForm,
    loadForm,
    loadSavedForm,
    deleteSavedForm 
};

Object.entries(GLOBAL_FUNCTIONS).forEach(([name, fn]) => {
    window[name] = fn;
});

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация tooltips
    initTooltips();

    // Инициализация drag-and-drop
    initDragAndDropSystem();
    
    // Инициализация табов формы
    initFormTabs();
    
    // Добавляем обработку кнопки генерации файла
    const formSenderCheckbox = document.getElementById('formSender');
    const generateFileButton = document.getElementById('generateFileButton');

    if (formSenderCheckbox && generateFileButton) {
        function toggleGenerateButton() {
            generateFileButton.style.display = formSenderCheckbox.checked ? 'inline-block' : 'none';
        }

        formSenderCheckbox.addEventListener('change', toggleGenerateButton);
        toggleGenerateButton(); // Устанавливаем начальное состояние
    } else {
        console.error('Элементы formSender или generateFileButton не найдены!');
    }
    
    const customSelects = document.querySelectorAll('.custom-select');
    
    customSelects.forEach(select => {
        const selected = select.querySelector('.custom-select__selected');
        const options = select.querySelectorAll('.custom-select__option');
        const hiddenSelect = document.getElementById('formMethod');
        
        // Открытие/закрытие списка
        selected.addEventListener('click', function() {
            select.classList.toggle('open');
        });
        
        // Выбор опции
        options.forEach(option => {
            option.addEventListener('click', function() {
                // Обновляем видимый текст
                selected.textContent = this.textContent;
                
                // Обновляем скрытый select
                hiddenSelect.value = this.dataset.value;
                
                // Помечаем выбранную опцию
                options.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                // Закрываем список
                select.classList.remove('open');
            });
        });
        
        // Закрытие при клике вне списка
        document.addEventListener('click', function(e) {
            if (!select.contains(e.target)) {
                select.classList.remove('open');
            }
        });
    });
});

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent || element.innerText;
    
    navigator.clipboard.writeText(text).then(() => {
        const copyIcon = element.nextElementSibling;
        const tooltip = bootstrap.Tooltip.getInstance(copyIcon);
        const originalTitle = copyIcon.getAttribute('data-bs-original-title') || 
                            copyIcon.getAttribute('title');
        
        // Сохраняем оригинальный title для восстановления
        copyIcon.setAttribute('data-bs-original-title', 'Скопировано!');
        
        // Уничтожаем текущий tooltip, если он есть
        if (tooltip) {
            tooltip.dispose();
        }
        
        // Создаем новый tooltip с ручным управлением
        const newTooltip = new bootstrap.Tooltip(copyIcon, {
            placement: 'auto',
            trigger: 'manual'
        });
        
        // Показываем сообщение "Скопировано!"
        newTooltip.show();
        
        setTimeout(() => {
            newTooltip.hide();
            setTimeout(() => {
                // Восстанавливаем оригинальный title и нормальное поведение tooltip
                newTooltip.dispose();
                
                // Восстанавливаем оригинальный заголовок
                copyIcon.setAttribute('data-bs-original-title', originalTitle);
                copyIcon.setAttribute('title', originalTitle);
                
                // Создаем tooltip с автоматическим показом при наведении
                new bootstrap.Tooltip(copyIcon, {
                    placement: 'auto',
                    trigger: 'hover focus'
                });
            }, 300);
        }, 1000);
        
    }).catch(err => {
        console.error('Ошибка при копировании: ', err);
    });
}