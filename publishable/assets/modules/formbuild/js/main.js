import { initDragAndDropSystem } from './drag-drop.js';
import { generateMarkup } from './render-form.js';
import { editFieldSettings, updateFieldSettingsForm, saveFieldSettings } from './FormSettings.js';
import { hideTooltip, addField, removeField, addFieldByType, initTooltips, createNewField, FIELD_TYPES } from './control-field.js';
import { confirmFileGeneration } from './file-generation.js';
import { saveForm, confirmSaveForm } from './save-form.js';
import { loadForm, loadSavedForm, deleteSavedForm } from './load-form.js';
import { initFormTabs } from './form-utils.js';
import { openEmailTemplateEditor, generateDefaultTemplate, saveEmailTemplate, clearEmailTemplate } from './email-template.js';

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
    deleteSavedForm,
    openEmailTemplateEditor,
    generateDefaultTemplate,
    saveEmailTemplate,
    clearEmailTemplate,
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
        toggleGenerateButton();
    } else {
        console.error('Элементы formSender или generateFileButton не найдены!');
    }
    
    const customSelects = document.querySelectorAll('.custom-select');
    
    customSelects.forEach(select => {
        const selected = select.querySelector('.custom-select__selected');
        const options = select.querySelectorAll('.custom-select__option');
        const hiddenSelect = document.getElementById('formMethod');
        
        selected.addEventListener('click', function() {
            select.classList.toggle('open');
        });
        
        options.forEach(option => {
            option.addEventListener('click', function() {
                selected.textContent = this.textContent;
                hiddenSelect.value = this.dataset.value;
                options.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                select.classList.remove('open');
            });
        });
        
        document.addEventListener('click', function(e) {
            if (!select.contains(e.target)) {
                select.classList.remove('open');
            }
        });
    });

    // Обработка горячих клавиш
    document.addEventListener('keydown', function(e) {
        // F1 - помощь
        if (e.key === 'F1') {
            e.preventDefault();
            if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                const helpModalElement = document.getElementById('helpModal');
                const helpModal = bootstrap.Modal.getInstance(helpModalElement) || new bootstrap.Modal(helpModalElement);
                
                // Проверяем, открыто ли уже модальное окно
                if (!document.querySelector('.modal.show')) {
                    helpModal.show();
                }
            } else {
                console.error('Bootstrap Modal not available');
            }
            return;
        }

        // Enter - генерация (если не в поле ввода)
        if (e.key === 'Enter' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            generateMarkup();
            return;
        }

        // Ctrl+S - сохранение
        if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
            e.preventDefault();
            saveForm();
            return;
        }
        if ((e.ctrlKey || e.metaKey) && e.code === 'KeyO') {
            e.preventDefault();
            loadForm(); // или loadSavedForm(), в зависимости от логики
            return;
        }

        // Ctrl+1..0 - добавление полей
        if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey) {
            const keyToTypeMap = {
                '1': 'text',
                '2': 'email',
                '3': 'tel',
                '4': 'password',
                '5': 'number',
                '6': 'textarea',
                '7': 'select',
                '8': 'checkbox',
                '9': 'radio',
                '0': 'file',
                '-': 'hidden',
                '=': 'date'
            };
            
            if (e.key in keyToTypeMap) {
                e.preventDefault();
                addFieldByType(keyToTypeMap[e.key]);
            }
        }
    });

    // Показываем подсказку при первом посещении
    if (!localStorage.getItem('hotkeysShown')) {
        setTimeout(() => {
            if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                const helpModal = new bootstrap.Modal(document.getElementById('helpModal'));
                helpModal.show();
            }
            localStorage.setItem('hotkeysShown', 'true');
        }, 2000);
    }
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