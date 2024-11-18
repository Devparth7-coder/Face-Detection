document.addEventListener('DOMContentLoaded', () => {
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');

    const nameInput = document.getElementById('nameInput');
    const nameSubmit = document.getElementById('nameSubmit');
    const userName = document.getElementById('userName');
    const finalName = document.getElementById('finalName');

    const ageInput = document.getElementById('ageInput');
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureButton = document.getElementById('capture');
    const submitData = document.getElementById('submitData');

    let userImage = '';

    // Move to Step 2
    nameSubmit.addEventListener('click', () => {
        const name = nameInput.value.trim();
        if (name) {
            userName.textContent = name;
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
            startCamera();
        } else {
            alert('Please enter your name.');
        }
    });

    // Start the camera
    function startCamera() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                video.srcObject = stream;
            })
            .catch((err) => {
                console.error('Error accessing the camera:', err);
                alert('Camera access is required.');
            });
    }

    // Capture Photo
    captureButton.addEventListener('click', () => {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        userImage = canvas.toDataURL('image/png'); // Save Base64 image
        alert('Photo captured!');
    });

    // Submit Data
    submitData.addEventListener('click', async() => {
        const name = userName.textContent;
        const age = ageInput.value.trim();

        if (!age || isNaN(age) || !userImage) {
            alert('Please enter your age and capture a photo.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/save-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    age: parseInt(age),
                    image: userImage,
                }),
            });

            if (response.ok) {
                finalName.textContent = name;
                step2.classList.add('hidden');
                step3.classList.remove('hidden');
            } else {
                alert('Failed to submit data. Try again.');
            }
        } catch (err) {
            console.error('Error submitting data:', err);
            alert('Error submitting data. Check the console for details.');
        }
    });
});