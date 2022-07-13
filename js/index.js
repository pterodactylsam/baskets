const addItemBtn = document.getElementById("add-item-btn");
const basketItemInput = document.getElementById("basket-item-name");
const basketWrapper = document.querySelector(".basket-wrapper");
const deleteButton = document.getElementById("delete-items");
const selectButton = document.getElementById("select-items");
const unSelectButton = document.getElementById("unselect-items");
const itemDescription = document.querySelector(".basket-item-description")

let items;
!localStorage.items ? items = [] : items = JSON.parse(localStorage.getItem('items'));

let itemsElements = []

function Item(description) {
    this.description = description;
    this.done = false;
}

const createTemplate = (item, index) => {
    return `
        <div class="basket-item d-flex mb-1 align-items-center ${item.done ? 'checked' : ''}">
            <input onclick="doneItems(${index})" class="basket-item-checkbox" type="radio" ${item.done ? 'checked' : ''}>
            <div onclick="editItemFromDescr(${index})" class="basket-item-description">${item.description}</div>
            <button onclick="deleteItems(${index})" class="basket-delete-item" id="delete-task-btn"><img src="img/cross.svg" alt="removeItem" srcset=""></button>
        </div>
    `
}

const filterItems = () => {
    const activeItems = items.length && items.filter(item => item.done == false);
    const doneItems = items.length && items.filter(item => item.done == true);
    items = [...activeItems, ...doneItems];
}

const fillItemsList = () => {
    basketWrapper.innerHTML = "";
    if (items.length > 0) {
        items.forEach((item, index) => {
            basketWrapper.innerHTML += createTemplate(item, index);
        })
        itemsElements = document.querySelectorAll('.basket-item')
    }
}

fillItemsList();

const updateLocal = () => {
    localStorage.setItem('items', JSON.stringify(items));
}

const generateItemList = () => {
    updateLocal();
    filterItems();
    fillItemsList();
}

const doneItems = index => {
    items[index].done = !items[index].done;
    if (items[index].done) {
        itemsElements[index].classList.add('checked');
    } else {
        itemsElements[index].classList.remove('checked');
    }
    generateItemList()
}

addItemBtn.addEventListener("click", () => {
    if (basketItemInput.value.length !== 0 && basketItemInput.value !== ' ') {
        items.push(new Item(basketItemInput.value));
        generateItemList()
        basketItemInput.value = "";
    }
})

basketItemInput.addEventListener("keydown", function(event) {
    if (event.code == 'Enter') {
        if (basketItemInput.value.length !== 0 && basketItemInput.value !== ' ') {
            items.push(new Item(basketItemInput.value));
            generateItemList()
            basketItemInput.value = "";
        }
    }
})

const editItemFromDescr = (index) => {
    const newValue = prompt('Введите новое описание:')
    if (newValue === null) {
        newValue = prompt('Введите новое описание:')
    }
    items[index].description = newValue
    generateItemList()

}

const deleteItems = (index) => {
    itemsElements[index].classList.add('delete-item')
    setTimeout(() => {
        items.splice(index, 1);
        generateItemList()
    }, 500)
}

const selectAllItems = () => {
    items.map((item) => {
        item.done = true
        updateLocal();
        fillItemsList();
    })
    selectButton.classList.toggle('d-n')
    unSelectButton.classList.toggle('d-n')
}


const unSelectAllItems = () => {
    items.map((item) => {
        item.done = false
        updateLocal();
        fillItemsList();
    })
    selectButton.classList.toggle('d-n')
    unSelectButton.classList.toggle('d-n')
}

const deleteAllItems = () => {
    for (let element of itemsElements) {
        if (element.classList.contains('checked')) {
            element.classList.add('delete-item')
            setTimeout(() => {
                window.location.reload()
            }, 500)
            
        }
    }

    for (let item of items) {
        if (item.done) {
            let delElement = items.indexOf(item)
            setTimeout(() => {
                items.splice(delElement);
                generateItemList()
            }, 500)
        }
    }
}