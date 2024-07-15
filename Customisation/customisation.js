document.addEventListener('DOMContentLoaded', function() {
    const addDesignButton = document.getElementById('addDesignButton');
    const detailsForm = document.getElementById('detailsForm');
    
    if (addDesignButton) {
        addDesignButton.addEventListener('click', function() {
            window.location.href = 'details.html';
        });
    }

    if (detailsForm) {
        detailsForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const designFile = document.getElementById('designFile').files[0];
            const outfitName = document.getElementById('outfitName').value;
            const designerName = document.getElementById('designerName').value;
            // const description = document.getElementById('description').value;

            if (designFile && outfitName && designerName) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const newDesign = {
                        image: e.target.result,
                        outfitName: outfitName,
                        designerName: designerName
                        // description: description,
                    };

                    let newDesigns = localStorage.getItem('newDesigns');
                    newDesigns = newDesigns ? JSON.parse(newDesigns) : [];
                    newDesigns.push(newDesign);
                    localStorage.setItem('newDesigns', JSON.stringify(newDesigns));

                    window.location.href = 'customization.html';
                };

                reader.readAsDataURL(designFile);
            }
        });
    }

    if (window.location.pathname.includes('customization.html')) {
        const newDesignsContainer = document.getElementById('newDesigns');
        let newDesigns = localStorage.getItem('newDesigns');
        newDesigns = newDesigns ? JSON.parse(newDesigns) : [];

        newDesigns.forEach(function(design) {
            const designCard = document.createElement('div');
            designCard.className = 'design-card';
            designCard.innerHTML = `
                <img src="${design.image}" alt="${design.outfitName}" style="width: 100px; height: 100px; object-fit: cover;">
                <p>${design.outfitName}</p>
                <p>${design.designerName}</p>
            `;
            newDesignsContainer.appendChild(designCard);
        });
    }
});
