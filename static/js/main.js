window.addEventListener('load', () => {
    const addItemButton = document.querySelector('.add-item');
    const form = document.querySelector('#receipt-form');
    const submitButton = form.querySelector('button[type="submit"]');
    
    addItemButton.addEventListener('click', () => {
        addFormRow();
    });

    document.querySelector('body').addEventListener('click', e => {
        if (e.target.classList.contains('delete-button')) {
            removeFormRow(e.target);
            return;
        }
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        calcCost(e.target);
    });

    const createInputElement = (type, name, placeholder) => {
        const input = document.createElement('input');
        input.id = name;
        input.setAttribute('type', type);
        input.setAttribute('name', name);
        input.setAttribute('placeholder', placeholder);
        input.setAttribute('step', 'any');
        return input;
    }
    
    const createFormRow = () => {
        const formRow = document.createElement('div');
        formRow.classList.add('form-row');
        
        const inputName = createInputElement('text', 'name', 'name');
        const inputPrice = createInputElement('number', 'price', 'price');
        const inputPercentage = createInputElement('number', 'percentage', 'their percentage');
        const inputDiscount = createInputElement('number', 'discount', 'discount');
        
        const deleteButton = document.createElement('span');
        deleteButton.classList.add('delete-button');
        deleteButton.innerHTML = 'X';

        const formRowElements = [inputName, inputPrice, inputPercentage, inputDiscount, deleteButton];
        for(let formRowElement of formRowElements) {
            formRow.appendChild(formRowElement);
        }

        return formRow;
    }

    const addFormRow = () => {
        const form = document.querySelector('#receipt-form');
        const formRow = createFormRow();
        form.insertBefore(formRow, submitButton);
    }

    const removeFormRow = ele => ele.parentNode.remove();

    const validateFields = form => {
        const fieldsToCheck = ['price', 'discount', 'percentage'];
        for(let [key, val] of form.entries()) { 
            if(fieldsToCheck.includes(key)) {
                console.log(val, typeof val)
                if(typeof val !== 'number') {
                    console.log(val, typeof(val))
                    return false;
                }
            }
        }
        return true;
    }

    const formToObject = formData => {
        const data = {};
        let dataKey = 0;
        for(let [formKey, formVal] of formData.entries()) {
            if (!(dataKey in data)) {
                data[dataKey] = {};
            } 
            data[dataKey][formKey] = formVal;
            if (Object.keys(data[dataKey]).length % 4 === 0) {
                dataKey++;
            }
        }
        return data;
    }

    const calcCost = form => {
        const formData = new FormData(form);
        
        const data = formToObject(formData);
        const theirShare = Object.keys(data).reduce((acc, currVal) => {
            const price = data[currVal]['price'];
            const percentage = data[currVal]['percentage'] / 100;
            const discount = !Number.isNaN(data[currVal]['discount']) && data[currVal]['discount'] != false ? data[currVal]['discount'] : 0;
            acc += (price-discount) * percentage;
            return acc;
        }, 0);
        
        const resultElement = document.querySelector('.result-field .result-placeholder');
        resultElement.innerHTML = `They owe you ${theirShare},-`;
    }
});
