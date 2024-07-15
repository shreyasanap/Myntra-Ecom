document.addEventListener('DOMContentLoaded', function() {
    const addEventButton = document.getElementById('addEventButton');
    const eventPopup = document.getElementById('eventPopup');
    const eventForm = document.getElementById('eventForm');
    const eventsList = document.getElementById('eventsList');
    
    addEventButton.addEventListener('click', function() {
        eventPopup.style.display = 'flex';
    });

    eventPopup.addEventListener('click', function(event) {
        if (event.target === eventPopup) {
            eventPopup.style.display = 'none';
        }
    });

    eventForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const eventName = document.getElementById('eventName').value;
        const eventDateTime = document.getElementById('eventDateTime').value;
        const eventPoster = document.getElementById('eventPoster').files[0];

        const reader = new FileReader();

        reader.onload = function(e) {
            const newEvent = {
                name: eventName,
                dateTime: eventDateTime,
                poster: e.target.result
            };

            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            eventItem.innerHTML = `
                <p>${newEvent.name}</p>
                <p>${newEvent.dateTime}</p>
                <img src="${newEvent.poster}" alt="Poster" style="width: 100px; height: 100px; object-fit: cover;">
            `;
            eventsList.appendChild(eventItem);

            eventPopup.style.display = 'none';
            eventForm.reset();
        };

        if (eventPoster) {
            reader.readAsDataURL(eventPoster);
        } else {
            reader.onload({ target: { result: '' } });
        }
    });
});
