/* ТРЕБОВАНИЕ 6: Класс, конструктор, вывод в консоль */

class ClubMember {
    constructor(name, code, agreed) {
        this.name = name;
        this.code = code;
        this.agreed = agreed;
        this.date = new Date().toLocaleTimeString();
    }

    logInfo() {
        console.log("=== НОВАЯ ЗАЯВКА ===");
        console.log("Имя: " + this.name);
        console.log("Код: " + this.code);
        console.log("Согласие: " + this.agreed);
        console.log("Время: " + this.date);
        console.log("====================");
    }
}

const form = document.getElementById('regForm');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const code = document.getElementById('pass').value;
    const agree = document.getElementById('agree').checked;

    const member = new ClubMember(name, code, agree);
        
    member.logInfo();

    alert("Заявка принята!");
});