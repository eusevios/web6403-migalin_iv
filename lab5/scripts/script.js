document.addEventListener('DOMContentLoaded', () => {
    console.log(">>> Script.js загружен");

    const API_URL = 'http://localhost:8000';

    class ClubMember {
        constructor(name, code, agreed) {
            this.name = name;
            this.code = code;
            this.agreed = agreed;
            this.date = new Date().toLocaleTimeString();
        }

        logInfo() {
            console.log("%c=== НОВАЯ ЗАЯВКА (Локальный объект) ===", "color: blue; font-weight: bold;");
            console.log("Имя: " + this.name);
            console.log("Код: " + this.code);
            console.log("Согласие: " + this.agreed);
            console.log("Время: " + this.date);
            console.log("========================================");
        }
    }

    const form = document.getElementById('regForm');
    
    if (form) {
        const nameInput = document.getElementById('name');
        const passInput = document.getElementById('pass');
        const nameError = document.getElementById('nameError');
        const passError = document.getElementById('passError');

        function setError(input, span, message) {
            input.classList.remove('valid');
            input.classList.add('invalid');
            span.textContent = message;
        }

        function setSuccess(input, span) {
            input.classList.remove('invalid');
            input.classList.add('valid');
            span.textContent = "";
        }

        function resetState(input, span) {
            input.classList.remove('invalid');
            input.classList.remove('valid');
            span.textContent = "";
        }

        const validateName = () => {
            const val = nameInput.value.trim();
            if (val.length === 0) {
                resetState(nameInput, nameError);
                return false;
            }
            if (val.length < 2) {
                setError(nameInput, nameError, "Имя слишком короткое");
                return false;
            } 
            if (/\d/.test(val)) {
                setError(nameInput, nameError, "Цифры запрещены");
                return false;
            } 
            setSuccess(nameInput, nameError);
            return true;
        };

        const validatePass = () => {
            const val = passInput.value;
            if (val.length === 0) {
                resetState(passInput, passError);
                return false;
            }
            if (val.length < 5) {
                setError(passInput, passError, "Пароль минимум 5 символов");
                return false;
            } 
            setSuccess(passInput, passError);
            return true;
        };

        nameInput.addEventListener('input', validateName);
        passInput.addEventListener('input', validatePass);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const isNameValid = validateName();
            const isPassValid = validatePass();
            const isAgreed = document.getElementById('agree').checked;

            if (isNameValid && isPassValid && isAgreed) {
                const newMember = new ClubMember(nameInput.value, passInput.value, isAgreed);
                
                newMember.logInfo();

                try {
                    console.log(">>> Отправка данных на сервер...");
                    
                    const response = await fetch(`${API_URL}/requests`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            name: newMember.name, 
                            code: newMember.code 
                        })
                    });
                    
                    const result = await response.json();
                    console.log(">>> ОТВЕТ СЕРВЕРА (JSON):", result);

                    if (response.ok || result.success) {
                        alert("Заявка принята! (См. консоль)");
                        form.reset();
                        resetState(nameInput, nameError);
                        resetState(passInput, passError);
                    } else {
                        alert("Ошибка сервера");
                    }
                } catch (err) {
                    console.error("Ошибка сети:", err);
                    alert("Не удалось соединиться с сервером");
                }
            } else {
                alert("Пожалуйста, исправьте ошибки в форме");
            }
        });
    }

    const bioTable = document.getElementById('bioTableBody');

    if (bioTable) {
        const loadData = async () => {
            try {
                const response = await fetch(`${API_URL}/biography`);
                
                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const data = await response.json();
                renderTable(data); 

            } catch (err) {
                console.error("Ошибка загрузки таблицы:", err);
                bioTable.innerHTML = `<tr><td colspan="3" style="color:red; text-align:center;">Ошибка загрузки данных</td></tr>`;
            }
        };

        const renderTable = (items) => {
            bioTable.innerHTML = '';
            
            let safeItems = [];
            if (Array.isArray(items)) {
                safeItems = items;
            } else if (items && items.biography) {
                safeItems = items.biography;
            } else if (items && typeof items === 'object') {
                 safeItems = Object.values(items).find(val => Array.isArray(val)) || [];
            }

            if (safeItems.length === 0) {
                bioTable.innerHTML = '<tr><td colspan="3" class="center">Нет данных</td></tr>';
                return;
            }

            safeItems.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="left">${item.period || '-'}</td>
                    <td class="center">${item.event || '-'}</td>
                    <td class="center">${item.comment || '-'}</td>
                `;
                bioTable.appendChild(tr);
            });
        };

        loadData();
        setInterval(loadData, 300000);
    }
});