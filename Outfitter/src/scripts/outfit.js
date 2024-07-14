import ClothingRenderer from "./clothing"

class OutfitRenderer {
    constructor() {
        this.clothingRenderer = new ClothingRenderer(this)
        this.displayedCategories = 'men'
        this.iconDisplayNames = {
            'tshirtstanks' : 'T-Shirts',
            'shirts' : 'Long Sleeves',
            'tops' : 'Tops',
            'shirtsblouses' : 'Shirts',
            'jacketscoats' : 'Jackets',
            'hoodiessweatshirts' : 'Sweatshirts',
            'cardigansjumpers' : 'Cardigans',
            'trousers' : 'Pants',
            'jeans' : 'Jeans',
            'skirts' : 'Skirts',
            'shorts' : 'Shorts',
            'dresses' : 'Dresses'
        }
        this.initEventListeners() 
    }

    initEventListeners() {
        document.getElementById('toggle-button').addEventListener('click', () => {
            this.displayedCategories = this.displayedCategories === 'men' ? 'women' : 'men'
            document.getElementById('toggle-button').innerText = this.displayedCategories.toUpperCase()
            this.displayCategories(this.categories)
        })
    }

    displayCategories(categories) {
        this.categories = categories

        // clear current HTML of the 'outfit-categories-container'
        document.getElementById('outfit-categories-container').innerHTML = '';
        this.clothingRenderer.clearClothingList()

        let categoryList = categories[this.displayedCategories] // map it out for men or women
        for (let category of categoryList) {
            this.displayCategory(category)
        }

    }


    displayCategory(category) {
        const unisexCategory = category.split('_')[1] // for icons

        const categoryElem = document.createElement('div')
        categoryElem.classList.add('category-item')
        document.getElementById('outfit-categories-container').appendChild(categoryElem)

        const iconContainerElem = document.createElement('div')
        iconContainerElem.classList.add('category-icon-container')
        categoryElem.appendChild(iconContainerElem)

        const iconTextElem = document.createElement('div')
        iconTextElem.classList.add('category-icon-text')
        iconTextElem.innerText = this.iconDisplayNames[unisexCategory]
        iconContainerElem.appendChild(iconTextElem)

        const iconImgElem = document.createElement('img')
        iconImgElem.classList.add('category-icon-img')
        iconImgElem.src = `./assets/images/clothing_icons/${unisexCategory}.png`
        iconImgElem.addEventListener('click', () => {
            this.clothingRenderer.getClothingDataFromAPI(category)

        })
        iconContainerElem.appendChild(iconImgElem)
        
        const clothingItemContainerElem = document.createElement('div') // longboi
        clothingItemContainerElem.classList.add('clothing-item-container')
        clothingItemContainerElem.id = category
        categoryElem.appendChild(clothingItemContainerElem)

        // TODO make remove clothing buttons only render if an item for the category was selected
        if (!this.clothingRenderer.addedCategories[category]) {
            const removeButtonElem = document.createElement('button')
            removeButtonElem.innerText = 'Remove'
            removeButtonElem.addEventListener('click', () => {
                clothingItemContainerElem.innerHTML = ''
            })
            categoryElem.appendChild(removeButtonElem)
        }
    }

    addClothingItem(category, clothingItem) {
        const clothingItemContainerElem = document.getElementById(category) // searching to get from the DOM
        clothingItemContainerElem.innerHTML = ''

        const clothingImgElem = document.createElement('img')
        clothingImgElem.classList.add('clothing-img')
        clothingImgElem.src = clothingItem.images?.length > 0 ? clothingItem.images[0].url : ''
        clothingItemContainerElem.appendChild(clothingImgElem)

        const clothingTextElem = document.createElement('div')
        clothingTextElem.classList.add('clothing-text')
        clothingTextElem.innerText = clothingItem.name
        clothingItemContainerElem.appendChild(clothingTextElem)


    }

}

export default OutfitRenderer