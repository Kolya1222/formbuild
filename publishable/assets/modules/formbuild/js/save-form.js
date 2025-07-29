import { csrfToken, showToast, getRoutes, openSaveLoadModal  } from './form-utils.js';
import { getAllFieldsData, getFormSettings } from './form-data.js';

// Сохранение формы
export function saveForm() {
    openSaveLoadModal('save-tab');
    if (document.querySelector('#saveLoadModal.show')) {
        return;
    }
    const modal = document.getElementById('saveLoadModal');
    const saveTab = document.querySelector('#save-tab');
    const bootstrapModal = new bootstrap.Modal(modal);
    
    modal.style.display = 'block';
    bootstrapModal.show();
    saveTab.click();
    modal.addEventListener('hidden.bs.modal', function() {
        // 1. Находим активную вкладку и её контент
        const activeTab = document.querySelector('#outputTabs .nav-link.active');
        const activePaneId = activeTab?.getAttribute('data-bs-target');
        const activePane = activePaneId ? document.querySelector(activePaneId) : null;
        
        // 2. Принудительно обновляем классы
        if (activeTab && activePane) {
            // Удаляем активные классы у всех вкладок и контента
            document.querySelectorAll('#outputTabs .nav-link, #outputTabsContent .tab-pane').forEach(el => {
                el.classList.remove('active', 'show');
            });
            
            // Включаем нужные
            activeTab.classList.add('active');
            activePane.classList.add('active', 'show');
            
            // 3. Триггерим событие (если нужно)
            const tabInstance = bootstrap.Tab.getInstance(activeTab) || new bootstrap.Tab(activeTab);
            tabInstance.show();
        }
    });
}

// Подтверждение сохранения формы
export function confirmSaveForm() {
    const ROUTES = getRoutes();
    const formName = document.getElementById('formName').value.trim();
    if (!formName) {
        alert('Укажите название формы.');
        return;
    }

    fetch(ROUTES.saveForm, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify({
            name: formName,
            description: document.getElementById('formDescription').value.trim(),
            fields: getAllFieldsData(),
            settings: getFormSettings(),
            _token: csrfToken
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const modal = document.getElementById('saveLoadModal');
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
            bootstrapModal.hide();
            showToast('Форма успешно сохранена', 'success');
        } else {
            showToast(data.message || 'Ошибка при сохранении формы', 'danger');
        }
    })
    .catch(error => {
        showToast('Ошибка при сохранении формы', 'danger');
    });
}