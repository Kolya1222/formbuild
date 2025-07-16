import { initDragAndDropSystem } from './drag-drop.js';
import { generateMarkup } from './render-form.js';
import { editFieldSettings, updateFieldSettingsForm, saveFieldSettings } from './FormSettings.js';
import { hideTooltip, addField, removeField, addFieldByType } from './control-field.js';

// Делаем функции глобальными для доступа из HTML
window.copyToClipboard = copyToClipboard;
window.editFieldSettings = editFieldSettings;
window.updateFieldSettingsForm = updateFieldSettingsForm;
window.saveFieldSettings = saveFieldSettings;
window.removeField = removeField;
window.addFieldByType = addFieldByType;
window.addField = addField;
window.hideTooltip = hideTooltip;
window.generateMarkup = generateMarkup;

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            trigger: 'hover focus',
            delay: { "show": 100, "hide": 100 }
        });
    });

    // Инициализация drag-and-drop
    initDragAndDropSystem();
});

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent || element.innerText;
    
    navigator.clipboard.writeText(text).then(() => {
        const copyIcon = element.nextElementSibling;
        const tooltip = bootstrap.Tooltip.getInstance(copyIcon);
        const originalTitle = copyIcon.getAttribute('title') || 
                            copyIcon.getAttribute('data-bs-original-title');
        
        copyIcon.setAttribute('data-bs-original-title', 'Скопировано!');
        
        if (tooltip) {
            tooltip.dispose();
        }
        
        const newTooltip = new bootstrap.Tooltip(copyIcon, {
            trigger: 'manual'
        });
        
        newTooltip.show();
        
        setTimeout(() => {
            newTooltip.hide();
            setTimeout(() => {
                copyIcon.setAttribute('data-bs-original-title', originalTitle);
                newTooltip.dispose();
                new bootstrap.Tooltip(copyIcon);
            }, 300);
        }, 2000);
        
    }).catch(err => {
        console.error('Ошибка при копировании: ', err);
    });
}