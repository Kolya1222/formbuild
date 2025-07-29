// Общие функции для работы с формами
export const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';

export function getRoutes() {
    const appContainer = document.querySelector('.app-container');
    if (!appContainer) {
        console.error('App container element not found');
        return {
            saveForm: '',
            getSavedForms: '',
            getForm: '',
            deleteForm: ''
        };
    }
    
    return {
        saveForm: appContainer.dataset.saveFormRoute || '',
        getSavedForms: appContainer.dataset.getSavedFormsRoute || '',
        getForm: appContainer.dataset.getFormRoute || '',
        deleteForm: appContainer.dataset.deleteFormRoute || ''
    };
}

// Вспомогательная функция для показа уведомлений
export function showToast(message, type = 'success', options = {}) {
    // Настройки по умолчанию
    const defaultOptions = {
        autohide: true,
        delay: type === 'danger' ? 5000 : 3000, // Более длительное отображение для ошибок
        position: 'bottom-right', // 'bottom-right' или 'top-center'
        closeButton: true
    };
    
    const finalOptions = { ...defaultOptions, ...options };

    // Создаем контейнер для toast с учетом позиционирования
    const containerId = `toast-container-${finalOptions.position}`;
    let toastContainer = document.getElementById(containerId);
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = containerId;
        toastContainer.style.position = 'fixed';
        toastContainer.style.zIndex = '1100';
        
        // Позиционирование
        if (finalOptions.position === 'top-center') {
            toastContainer.style.top = '20px';
            toastContainer.style.left = '50%';
            toastContainer.style.transform = 'translateX(-50%)';
        } else { // bottom-right по умолчанию
            toastContainer.style.bottom = '20px';
            toastContainer.style.right = '20px';
        }
        
        document.body.appendChild(toastContainer);
    }

    // Создаем уникальный ID для toast
    const toastId = `toast-${Date.now()}`;
    
    // Кнопка закрытия
    const closeButtonHtml = finalOptions.closeButton 
        ? '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>'
        : '';
    
    // Создаем HTML для toast
    const toastHtml = `
        <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert" 
             aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                ${closeButtonHtml}
            </div>
        </div>
    `;
    
    // Добавляем toast в контейнер
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    // Инициализируем toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
        autohide: finalOptions.autohide,
        delay: finalOptions.delay
    });
    
    // Показываем toast
    toast.show();
    
    // Удаляем toast после скрытия
    toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
        // Удаляем контейнер, если он пуст
        if (toastContainer.children.length === 0) {
            toastContainer.remove();
        }
    });
    
    return toastElement;
}

// Инициализация табов в модальном окне
export function initFormTabs() {
    const formTabs = document.getElementById('formTabs');
    if (formTabs) {
        formTabs.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-link')) {
                const tabId = e.target.getAttribute('data-bs-target');
                document.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('show', 'active');
                });
                document.querySelector(tabId).classList.add('show', 'active');
            }
        });
    }
}

let saveLoadModalInstance = null;

export function getSaveLoadModal() {
    if (!saveLoadModalInstance) {
        const modal = document.getElementById('saveLoadModal');
        if (modal) {
            saveLoadModalInstance = new bootstrap.Modal(modal);
            
            // Очистка при закрытии
            modal.addEventListener('hidden.bs.modal', function() {
                // 1. Удаляем класс modal-open с body
                document.body.classList.remove('modal-open');
                
                // 2. Удаляем инлайновый padding-right (добавляется Bootstrap)
                document.body.style.paddingRight = '';
                
                // 3. Удаляем оверлей (на всякий случай)
                const backdrops = document.querySelectorAll('.modal-backdrop');
                backdrops.forEach(backdrop => backdrop.remove());
                
                // 4. Восстанавливаем скролл
                document.body.style.overflow = 'auto';
            });
        }
    }
    return saveLoadModalInstance;
}

export function openSaveLoadModal(tabId) {
    const modal = getSaveLoadModal();
    if (!modal) return;
    
    const tab = document.querySelector(`#${tabId}`);
    if (!tab) return;
    
    // Переключаем вкладку без полного переоткрытия модалки
    tab.click();
    
    // Открываем только если закрыто
    if (!document.querySelector('#saveLoadModal.show')) {
        modal.show();
    }
    
    // Очищаем возможные дубли фона
    document.querySelectorAll('.modal-backdrop').forEach(el => {
        if (el.parentNode === document.body) el.remove();
    });
}