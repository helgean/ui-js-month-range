
class UiJsMonthRangeSelect extends HTMLElement {
    static observedAttributes = ["year", "from-date", "to-date"];

    constructor() {
        super();
        this.disabledMonths = this.getAttribute('disabled-months')?.split(',') ?? [];
        this.year = Number.parseInt(this.getAttribute('year')) || new Date().getFullYear();
        this.fromDate = new Date(Date.parse(this.getAttribute('from-date')) || Date.parse(0));
        this.toDate = new Date(Date.parse(this.getAttribute('to-date')) || Date.parse(9999));

        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == 'year' && oldValue !== newValue) {
            this.year = Number.parseInt(newValue) || new Date().getFullYear();
            this.render();
        } else if (name == 'from-date' && oldValue !== newValue) {
            this.year = new Date(Date.parse(newValue) || Date.parse(0));
            this.render();
        } else if (name == 'to-date' && oldValue !== newValue) {
            this.year = new Date(Date.parse(newValue) || Date.parse(9999));
            this.render();
        }
    }

    render() {
        const template = document.createElement('template');
        template.innerHTML = `
            <div class="year-selector">${this.year}</div>
            <div class="month-selector"></div>
        `;

        this.replaceChildren(template.content.cloneNode(true));

        const monthButtonsContainer = this.querySelector('.month-selector');

        // Create buttons for each month
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        monthNames.forEach((monthName, index) => {
            const monthButton = document.createElement('a');
            monthButton.innerText = monthName;
            monthButton.tabIndex = -1;
            monthButton.dataset.month = index;
            monthButtonsContainer.appendChild(monthButton);
            if (!this.inRange(index))
                monthButton.setAttribute('disabled','');
        });

        this.addEventListener('click', ev => {
            if (ev.target?.dataset?.month) {
                console.log('Selected month:', ev.target.dataset.month);
                this.setSelected(ev.target);
            }    

            console.log(this.monthRange);
        });
    }

    setSelected(el) {
        if (!el)
            return;
        
        if (this.selected.length === 2) {
            this.clearSelections();
        } 
            
        el.classList.add('selected');
        this.clearLastSelected();
        this.lastSelected?.classList.add('last-selected');
    }

    clearSelections() {
        const monthEls = this.querySelectorAll('.month-selector > a.selected');
        for (let el of monthEls) {
            el.classList.remove('selected');
        }
    }

    clearLastSelected() {
        const monthEls = this.querySelectorAll('.month-selector > a.last-selected');
        for (let el of monthEls) {
            el.classList.remove('last-selected');
        }
    }

    inRange(month) {
        const selectedDate = Date.parse(`${this.year}-${month}`);
        return this.fromDate <= selectedDate && this.toDate >= selectedDate;
    }

    get monthRange() {
        return [...this.selected].map(e => e.dataset.month);
    }

    set monthRange(value) {
        if (Array.isArray(value)) {
            for (let i of value) {
                const el = this.querySelector(`.month-selector > a:nth-child(${i+1})`);
                this.setSelected(el);
            }
        }
    }

    get selected() {
        return this.querySelectorAll('.month-selector > a.selected');
    }

    get firstSelected() {
        return this.querySelector('.month-selector > a.selected');
    }

    get lastSelected() {
        return [...this.selected].pop();
    }
}

customElements.define('ui-js-month-range', UiJsMonthRangeSelect);