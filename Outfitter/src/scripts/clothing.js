class ClothingRenderer {
    constructor(outfitRenderer) {
        this.outfitRenderer = outfitRenderer
        this.addedCategories = {}
    }

    getClothingDataFromAPI(category) { 
        const url = `https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/products/list?country=us&lang=en&currentpage=0&pagesize=50&categories=${category}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '9762026cd5mshc7813f55876eefbp173bb3jsncec70dfa44dc',
                'X-RapidAPI-Host': 'apidojo-hm-hennes-mauritz-v1.p.rapidapi.com'
            }
        };
    
        fetch(url, options) // options adds headers for auth
          .then(response => response.json())
          .then(clothingData => { 
            // dozi bad
            this.category = category
            this.displayClothingData(clothingData)
          })
          .catch(error => console.error('Error:', error));
    }

    displayClothingData(clothingData) {
        this.clearClothingList() // clears HTML for fresh list 
        for (let clothingItem of clothingData.results) {
            this.displayClothingItem(clothingItem)
        }
    }
    
    displayClothingItem(clothingItem) {
        const clothingElem = document.createElement('li')
        clothingElem.classList.add('clothing-item')
        document.getElementById('clothing-list').appendChild(clothingElem)

        const clothingImgElem = document.createElement('img')
        clothingImgElem.classList.add('clothing-img')
        clothingImgElem.src = clothingItem.images?.length > 0 ? clothingItem.images[0].url : ''
        clothingElem.appendChild(clothingImgElem)

        const clothingTextElem = document.createElement('div')
        clothingTextElem.classList.add('clothing-text')
        clothingTextElem.innerText = clothingItem.name
        clothingElem.appendChild(clothingTextElem)

        const clothingButtonElem = document.createElement('button')
        clothingButtonElem.classList.add('clothing-button')
        clothingButtonElem.innerText = 'Try On'
        clothingButtonElem.addEventListener('click', () => {
            this.outfitRenderer.addClothingItem(this.category, clothingItem)
            this.addedCategories[this.category] = true
        })
        clothingElem.appendChild(clothingButtonElem)
    }

    clearClothingList() {
        document.getElementById('clothing-list').innerHTML = ''
    }
}





export default ClothingRenderer;