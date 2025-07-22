export function confirmFileGeneration() {
    const formId = window.currentFormId || 'myForm';
    if (confirm(`Создать файл /core/custom/forms/${formId}.php? Существующий файл будет перезаписан.`)) {
        generateFormFile(formId);
    }
}

 async function generateFormFile(formId) {
    try {
        const button = document.getElementById('generateFileButton');
        const route = button.dataset.route; // Получаем route из data-атрибута кнопки
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
        if (!csrfToken) {
            throw new Error("CSRF token not found!");
        }

        const content = FormBuilder;
        if (!content) throw new Error('Элемент с содержимым формы не найден');
        
        const response = await fetch(route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({
                formId: formId,
                content: content,
                _token: csrfToken
            })
        });
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Ошибка сервера');
        }
        
        alert(`Файл успешно создан: /core/custom/forms/${formId}.php`);
    } catch (error) {
        console.error('Ошибка:', error);
        alert(`Ошибка при создании файла: ${error.message}`);
    }
}