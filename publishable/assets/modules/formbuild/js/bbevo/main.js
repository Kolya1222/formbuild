document.addEventListener('DOMContentLoaded', function() {
    // Элементы интерфейса
    const workspace = document.getElementById('workspace');
    const htmlOutput = document.getElementById('html-output');
    const removeElementBtn = document.getElementById('remove-element');
    const duplicateElementBtn = document.getElementById('duplicate-element');
    const copyHtmlBtn = document.getElementById('copy-html');
    const exportHtmlBtn = document.getElementById('export-html');
    const clearWorkspaceBtn = document.getElementById('clear-workspace');
    const contextMenu = document.getElementById('context-menu');
    
    // Переменные состояния
    let selectedElement = null;
    let copiedElement = null;
    
    // Инициализация
    initDragAndDrop();
    initPropertiesPanel();
    updateHtmlOutput();
    
    // События кнопок
    copyHtmlBtn.addEventListener('click', copyHtmlToClipboard);
    exportHtmlBtn.addEventListener('click', exportHtml);
    clearWorkspaceBtn.addEventListener('click', clearWorkspace);
    removeElementBtn.addEventListener('click', removeSelectedElement);
    duplicateElementBtn.addEventListener('click', duplicateSelectedElement);
    
    // Контекстное меню
    document.addEventListener('contextmenu', function(e) {
        if (e.target.closest('.constructor-element')) {
            e.preventDefault();
            showContextMenu(e);
        }
    });
    
    document.addEventListener('click', function() {
        hideContextMenu();

    });
    
    // Функции
    
    function initDragAndDrop() {
        // Перетаскивание элементов с панели
        document.querySelectorAll('.element-icon').forEach(icon => {
            icon.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', this.getAttribute('data-type'));
            });
        });
        
        // Обработка зоны сброса
        workspace.addEventListener('dragover', function(e) {
            e.preventDefault();
            const dropZone = findDropZone(e);
            
            // Подсветка зоны сброса
            document.querySelectorAll('.drop-zone').forEach(zone => {
                zone.classList.remove('active');
            });
            
            if (dropZone) {
                dropZone.classList.add('active');
            }
        });
        
        workspace.addEventListener('dragleave', function() {
            document.querySelectorAll('.drop-zone').forEach(zone => {
                zone.classList.remove('active');
            });
        });
        
        workspace.addEventListener('drop', function(e) {
            e.preventDefault();
            document.querySelectorAll('.drop-zone').forEach(zone => {
                zone.classList.remove('active');
            });
            
            // Сначала проверяем, не перемещаем ли мы существующий элемент
            if (e.dataTransfer.types.includes('text/plain') && e.dataTransfer.getData('text/plain') === 'move') {
                const draggingElement = document.querySelector('.constructor-element.dragging');
                
                if (draggingElement) {
                    const dropZone = findDropZone(e);
                    
                    if (dropZone) {
                        // Если есть dropZone - помещаем элемент в него
                        dropZone.appendChild(draggingElement);
                    } else {
                        // Если нет dropZone - помещаем элемент в рабочую область
                        workspace.appendChild(draggingElement);
                    }
                    
                    updateHtmlOutput();
                }
                return;
            }
            
            // Только если это не перемещение, создаем новый элемент
            const elementType = e.dataTransfer.getData('text/plain');
            const dropZone = findDropZone(e);
            
            if (elementType) {
                const newElement = createElement(elementType);
                
                if (dropZone) {
                    dropZone.appendChild(newElement);
                } else {
                    workspace.appendChild(newElement);
                }
                
                selectElement(newElement);
                updateHtmlOutput();
            }
        });
        
        // Перетаскивание внутри рабочей области
        workspace.addEventListener('mousedown', function(e) {
            const targetElement = e.target.closest('.constructor-element');
            
            if (targetElement && e.button === 0) {
                selectElement(targetElement);
                
                // Начало перетаскивания
                const handle = targetElement.querySelector('.element-handle');
                if (handle && handle.contains(e.target)) {
                    targetElement.setAttribute('draggable', 'true');
                    targetElement.classList.add('dragging');
                    
                    targetElement.addEventListener('dragstart', function(ev) {
                        ev.dataTransfer.setData('text/plain', 'move');
                        ev.dataTransfer.effectAllowed = 'move';
                    });
                    
                    targetElement.addEventListener('dragend', function() {
                        this.removeAttribute('draggable');
                        this.classList.remove('dragging');
                    });
                }
            } else if (!targetElement && e.button === 0) {
                // Клик вне элемента - снимаем выделение
                document.querySelectorAll('.constructor-element').forEach(el => {
                    el.classList.remove('selected', 'dragging');
                });
                selectedElement = null;
                updatePropertiesPanel();
            }
        });
        
        // Обработка перетаскивания внутри рабочей области
        workspace.addEventListener('dragover', function(e) {
            if (e.dataTransfer.types.includes('text/plain') && e.dataTransfer.getData('text/plain') === 'move') {
                e.preventDefault();
                const dropZone = findDropZone(e);
                
                document.querySelectorAll('.drop-zone').forEach(zone => {
                    zone.classList.remove('active');
                });
                
                if (dropZone) {
                    dropZone.classList.add('active');
                }
            }
        });
    }
    
    function findDropZone(e) {
        let target = e.target;
        
        while (target && target !== workspace) {
            if (target.classList.contains('drop-zone')) {
                return target;
            }
            target = target.parentNode;
        }
        
        return null;
    }
    
    function createElement(type) {
        const element = document.createElement('div');
        element.className = 'constructor-element';
        element.setAttribute('data-type', type);
        
        let content = '';
        let handleIcon = 'bi-square';
        
        switch (type) {
            case 'div':
                content = 'Контейнер DIV';
                handleIcon = 'bi-square';
                break;
            case 'text':
                content = 'Текстовый блок. Нажмите дважды, чтобы изменить текст.';
                handleIcon = 'bi-text-paragraph';
                break;
            case 'button':
                content = '<button class="btn btn-primary">Кнопка</button>';
                handleIcon = 'bi-ui-buttons';
                break;
            case 'image':
                content = '<img src="https://via.placeholder.com/150" alt="Изображение" style="max-width: 100%;">';
                handleIcon = 'bi-image';
                break;
            case 'section':
                content = '<div class="drop-zone" style="min-height: 100px;"></div>';
                handleIcon = 'bi-collection';
                break;
            case 'row':
                content = '<div class="d-flex flex-row gap-2 p-2 drop-zone"></div>';
                handleIcon = 'bi-layout-split';
                break;
            case 'column':
                content = '<div class="d-flex flex-column gap-2 p-2 drop-zone"></div>';
                handleIcon = 'bi-layout-sidebar-inset';
                break;
        }
        
        element.innerHTML = `
            <div class="element-handle">
                <span><i class="bi ${handleIcon}"></i> ${type}</span>
                <i class="bi bi-grip-vertical"></i>
            </div>
            <div class="element-content">${content}</div>
        `;
        
        // Двойной клик для редактирования текста
        if (type === 'text') {
            const contentDiv = element.querySelector('.element-content');
            contentDiv.addEventListener('dblclick', function() {
                const currentText = this.textContent;
                this.innerHTML = `<textarea class="form-control">${currentText}</textarea>`;
                const textarea = this.querySelector('textarea');
                textarea.focus();
                
                textarea.addEventListener('blur', function() {
                    contentDiv.textContent = this.value;
                    updateHtmlOutput();
                });
                
                textarea.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        this.blur();
                    }
                });
            });
        }
        
        return element;
    }
    
    function selectElement(element) {
        // Снять выделение со всех элементов
        document.querySelectorAll('.constructor-element').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Выделить выбранный элемент
        element.classList.add('selected');
        selectedElement = element;
        
        // Обновить панель свойств
        updatePropertiesPanel();
    }
    
    function initPropertiesPanel() {
        // Обработка изменений свойств
        document.querySelectorAll('#properties-form input, #properties-form select, #properties-form textarea').forEach(control => {
            control.addEventListener('change', function() {
                if (selectedElement) {
                    applyPropertyChange(this.id, this.value);
                }
            });
            
            // Для текстовых полей - обработка по нажатию Enter
            if (control.tagName === 'INPUT' && control.type !== 'color') {
                control.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        applyPropertyChange(this.id, this.value);
                    }
                });
            }
        });
    }
    
    function applyPropertyChange(propertyId, value) {
        if (!selectedElement) return;
        
        const elementType = selectedElement.getAttribute('data-type');
        
        switch (propertyId) {
            case 'element-id':
                selectedElement.id = value;
                break;
            case 'element-classes':
                selectedElement.className = `constructor-element selected ${value}`;
                break;
            case 'display-type':
                selectedElement.style.display = value || '';
                break;
            case 'flex-direction':
                selectedElement.style.flexDirection = value || '';
                break;
            case 'justify-content':
                selectedElement.style.justifyContent = value || '';
                break;
            case 'align-items':
                selectedElement.style.alignItems = value || '';
                break;
            case 'element-width':
                selectedElement.style.width = value || '';
                break;
            case 'element-height':
                selectedElement.style.height = value || '';
                break;
            case 'element-padding':
                selectedElement.style.padding = value || '';
                break;
            case 'element-margin':
                selectedElement.style.margin = value || '';
                break;
            case 'element-bgcolor':
                selectedElement.style.backgroundColor = value || '';
                break;
            case 'element-color':
                selectedElement.style.color = value || '';
                break;
            case 'element-border':
                selectedElement.style.border = value || '';
                break;
            case 'element-border-radius':
                selectedElement.style.borderRadius = value || '';
                break;
            case 'element-text':
                if (elementType === 'text') {
                    selectedElement.querySelector('.element-content').textContent = value;
                } else if (elementType === 'button') {
                    selectedElement.querySelector('.element-content button').textContent = value;
                }
                break;
            case 'element-src':
                if (elementType === 'image') {
                    selectedElement.querySelector('.element-content img').src = value;
                }
                break;
            case 'element-href':
                if (elementType === 'button') {
                    const button = selectedElement.querySelector('.element-content button');
                    if (value) {
                        const link = document.createElement('a');
                        link.href = value;
                        link.innerHTML = button.outerHTML;
                        selectedElement.querySelector('.element-content').innerHTML = link.outerHTML;
                    }
                }
                break;
        }
        
        updateHtmlOutput();
    }
    
    function updatePropertiesPanel() {
        if (!selectedElement) {
            document.getElementById('selected-element-type').textContent = 'Не выбран';
            return;
        }
        
        const elementType = selectedElement.getAttribute('data-type');
        document.getElementById('selected-element-type').textContent = elementType;
        
        // Обновляем значения полей
        document.getElementById('element-id').value = selectedElement.id || '';
        document.getElementById('element-classes').value = selectedElement.className.replace('constructor-element selected', '').trim();
        
        // Стили
        document.getElementById('display-type').value = selectedElement.style.display || '';
        document.getElementById('flex-direction').value = selectedElement.style.flexDirection || '';
        document.getElementById('justify-content').value = selectedElement.style.justifyContent || '';
        document.getElementById('align-items').value = selectedElement.style.alignItems || '';
        document.getElementById('element-width').value = selectedElement.style.width || '';
        document.getElementById('element-height').value = selectedElement.style.height || '';
        document.getElementById('element-padding').value = selectedElement.style.padding || '';
        document.getElementById('element-margin').value = selectedElement.style.margin || '';
        document.getElementById('element-border').value = selectedElement.style.border || '';
        document.getElementById('element-border-radius').value = selectedElement.style.borderRadius || '';
        
        // Цвета
        const bgColor = selectedElement.style.backgroundColor || '';
        document.getElementById('element-bgcolor').value = rgbToHex(bgColor) || '#ffffff';
        
        const textColor = selectedElement.style.color || '';
        document.getElementById('element-color').value = rgbToHex(textColor) || '#000000';
        
        // Контент
        if (elementType === 'text') {
            document.getElementById('element-text').value = selectedElement.querySelector('.element-content').textContent;
        } else if (elementType === 'button') {
            const button = selectedElement.querySelector('.element-content button');
            document.getElementById('element-text').value = button ? button.textContent : '';
            
            const link = selectedElement.querySelector('.element-content a');
            document.getElementById('element-href').value = link ? link.href : '';
        } else if (elementType === 'image') {
            document.getElementById('element-src').value = selectedElement.querySelector('.element-content img').src;
        }
    }
    
    function rgbToHex(rgb) {
        if (!rgb) return '';
        
        // Если уже hex
        if (rgb.startsWith('#')) return rgb;
        
        // Конвертация rgb/rgba в hex
        const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
        if (!match) return '';
        
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }
    
    function updateHtmlOutput() {
        if (!workspace) return;
        
        // Клонируем workspace, чтобы не изменять оригинал
        const clone = workspace.cloneNode(true);
        
        // Удаляем служебные классы и атрибуты
        clone.querySelectorAll('.constructor-element').forEach(el => {
            el.classList.remove('selected', 'dragging');
            el.removeAttribute('draggable');
            
            // Удаляем handle и другие служебные элементы
            const handle = el.querySelector('.element-handle');
            if (handle) handle.remove();
            
            // Для текстовых элементов берем содержимое
            if (el.getAttribute('data-type') === 'text') {
                const content = el.querySelector('.element-content').textContent;
                el.innerHTML = content;
            }
        });
        
        // Форматируем HTML
        const htmlString = clone.innerHTML
            .replace(/<!--[\s\S]*?-->/g, '') // Удаляем комментарии
            .replace(/\s+/g, ' ') // Удаляем лишние пробелы
            .replace(/>\s+</g, '><') // Удаляем пробелы между тегами
            .trim();
        
        // Красивое форматирование
        const formattedHtml = formatHtml(htmlString);
        
        // Выводим результат
        htmlOutput.textContent = formattedHtml;
    }
    
    function formatHtml(html) {
        // Простая функция для форматирования HTML с отступами
        let indent = 0;
        let result = '';
        const tokens = html.split(/(<[^>]+>)/);
        
        tokens.forEach(token => {
            if (token.startsWith('</')) {
                indent--;
                result += '\n' + '  '.repeat(indent) + token;
            } else if (token.startsWith('<')) {
                result += '\n' + '  '.repeat(indent) + token;
                if (!token.includes('/>') && !token.match(/<(br|hr|img|input|meta|link)/i)) {
                    indent++;
                }
            } else if (token.trim() !== '') {
                result += '\n' + '  '.repeat(indent) + token;
            }
        });
        
        return result.trim();
    }
    
    function removeSelectedElement() {
        if (selectedElement && selectedElement.parentNode) {
            selectedElement.parentNode.removeChild(selectedElement);
            selectedElement = null;
            updatePropertiesPanel();
            updateHtmlOutput();
        }
    }
    
    function duplicateSelectedElement() {
        if (selectedElement) {
            const clone = selectedElement.cloneNode(true);
            selectedElement.parentNode.insertBefore(clone, selectedElement.nextSibling);
            selectElement(clone);
            updateHtmlOutput();
        }
    }
    
    function copyHtmlToClipboard() {
        const html = htmlOutput.textContent;
        navigator.clipboard.writeText(html).then(() => {
            // Показать уведомление
            const originalText = copyHtmlBtn.innerHTML;
            copyHtmlBtn.innerHTML = '<i class="bi bi-check"></i> Скопировано';
            
            setTimeout(() => {
                copyHtmlBtn.innerHTML = originalText;
            }, 2000);
        });
    }
    
    function exportHtml() {
        const html = htmlOutput.textContent;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'layout.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    function clearWorkspace() {
        if (confirm('Вы уверены, что хотите очистить рабочую область?')) {
            workspace.innerHTML = '';
            selectedElement = null;
            updatePropertiesPanel();
            updateHtmlOutput();
        }
    }
    
    function showContextMenu(e) {
        e.preventDefault();
        
        // Позиционируем меню
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;
        
        // Выбираем элемент, на котором вызвали меню
        const targetElement = e.target.closest('.constructor-element');
        if (targetElement) {
            selectElement(targetElement);
        }
    }
    
    function hideContextMenu() {
        contextMenu.style.display = 'none';
    }
    
    // Обработка действий контекстного меню
    contextMenu.querySelectorAll('.context-menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            
            switch (action) {
                case 'copy':
                    copiedElement = selectedElement.cloneNode(true);
                    break;
                case 'cut':
                    copiedElement = selectedElement.cloneNode(true);
                    selectedElement.parentNode.removeChild(selectedElement);
                    selectedElement = null;
                    updatePropertiesPanel();
                    break;
                case 'paste':
                    if (copiedElement) {
                        const clone = copiedElement.cloneNode(true);
                        workspace.appendChild(clone);
                        selectElement(clone);
                    }
                    break;
                case 'duplicate':
                    duplicateSelectedElement();
                    break;
                case 'delete':
                    removeSelectedElement();
                    break;
                case 'move-up':
                    if (selectedElement && selectedElement.previousElementSibling) {
                        selectedElement.parentNode.insertBefore(selectedElement, selectedElement.previousElementSibling);
                    }
                    break;
                case 'move-down':
                    if (selectedElement && selectedElement.nextElementSibling) {
                        selectedElement.parentNode.insertBefore(selectedElement.nextElementSibling, selectedElement);
                    }
                    break;
            }
            
            updateHtmlOutput();
            hideContextMenu();
        });
    });
});