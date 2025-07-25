import { csrfToken, showToast, getRoutes } from './form-utils.js';
import { loadFormSettings } from './form-data.js';
import { generateMarkup } from './render-form.js';
import { getFieldCount, setFieldCount, incrementFieldCount, createNewField } from './control-field.js';
// Загрузка формы
export function loadForm() {
    const modal = document.getElementById('saveLoadModal');
    const loadTab = document.querySelector('#load-tab');
    const bootstrapModal = new bootstrap.Modal(modal);
    
    modal.style.display = 'block';
    bootstrapModal.show();
    loadTab.click();
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
    // Загрузка списка сохраненных форм
    const savedFormsList = document.getElementById('savedFormsList');
    savedFormsList.innerHTML = `
        <div class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
    const ROUTES = getRoutes();
    fetch(ROUTES.getSavedForms)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.forms.length > 0) {
                let html = '';
                data.forms.forEach(form => {
                    html += `
                    <div class="list-group-item">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="mb-1">${form.name}</h6>
                                <small class="text-muted">${form.description || 'No description'}</small>
                            </div>
                            <div>
                                <button class="btn btn-sm btn-primary me-1" onclick="loadSavedForm(${form.id})">
                                    <i class="bi bi-download"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="deleteSavedForm(${form.id}, this)">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="small text-muted mt-1">
                            Saved on: ${form.created_at}
                        </div>
                    </div>
                    `;
                });
                savedFormsList.innerHTML = html;
            } else {
                savedFormsList.innerHTML = `
                    <div class="text-center py-4">
                        <i class="bi bi-folder-x fs-1 text-muted"></i>
                        <p class="mt-2">No saved forms</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            savedFormsList.innerHTML = `
                <div class="alert alert-danger">
                    Error loading forms
                </div>
            `;
        });
    modal.addEventListener('hidden.bs.modal', function() {
        const activeMainTab = document.querySelector('#outputTabs .nav-link.active');
        if (activeMainTab) {
            activeMainTab.click(); // Просто вызываем клик
        }
    });
}

export function loadSavedForm(formId) {
    if (!confirm('Вы уверены, что хотите загрузить эту форму? Текущая форма будет утеряна.')) return;
    const ROUTES = getRoutes();
    fetch(`${ROUTES.getForm}?id=${formId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const formFields = document.getElementById('formFields');
                const fieldsToRemove = formFields.querySelectorAll('.form-field:not(#emptyState)');
                fieldsToRemove.forEach(field => field.remove());
                
                // Устанавливаем начальное значение счетчика
                // Если в данных формы есть информация о количестве полей, можно использовать ее
                // Иначе начинаем с 0
                setFieldCount(data.form.fieldCount || 0);
                
                if (data.form.settings) loadFormSettings(data.form.settings);
                
                data.form.fields.sort((a, b) => (a.position || 0) - (b.position || 0))
                    .forEach(fieldData => {
                        const fieldId = getFieldCount();
                        const fieldElement = createNewField(fieldId);
                        if (!fieldElement) return;

                        Object.keys(fieldData).forEach(key => {
                            if (fieldData[key] !== undefined && fieldData[key] !== null) {
                                fieldElement.dataset[key] = fieldData[key];
                            }
                        });

                        fieldElement.querySelector('.field-title').textContent = fieldData.label || '';
                        fieldElement.querySelector('.field-type-badge').textContent = fieldData.type || '';
                        fieldElement.querySelector('.field-name-summary').textContent = fieldData.name || '';
                        fieldElement.querySelector('.field-label-summary').textContent = fieldData.label || '';
                        
                        const requiredBadge = fieldElement.querySelector('.field-required-badge');
                        if (requiredBadge) {
                            requiredBadge.classList.toggle('d-none', !(fieldData.required === 'true' || fieldData.required === true));
                        }
                        
                        incrementFieldCount();
                    });
                
                bootstrap.Modal.getInstance(document.getElementById('saveLoadModal'))?.hide();
                showToast('Форма успешно загружена', 'success');
                generateMarkup();
            } else {
                showToast(data.message || 'Ошибка при загрузке формы', 'danger');
            }
        })
        .catch(error => {
            showToast('Ошибка при загрузке формы', 'danger');
        });
}

// Удаление сохраненной формы
export function deleteSavedForm(formId, element) {
    if (!confirm('Are you sure you want to delete this form?')) return;
    const ROUTES = getRoutes();
    fetch(ROUTES.deleteForm, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify({ 
            id: formId,
            _token: csrfToken
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            element.closest('.list-group-item').remove();
            showToast('Форма успешно удалена', 'success');
            
            // Если список пуст, показываем сообщение
            const savedFormsList = document.getElementById('savedFormsList');
            if (savedFormsList.children.length === 0) {
                savedFormsList.innerHTML = `
                    <div class="text-center py-4">
                        <i class="bi bi-folder-x fs-1 text-muted"></i>
                        <p class="mt-2">No saved forms</p>
                    </div>
                `;
            }
        } else {
            showToast(data.message || 'Ошибка при удалении формы', 'danger');
        }
    })
    .catch(error => {
        showToast('Ошибка при удалении формы', 'danger');
    });
}