document.addEventListener("DOMContentLoaded", function() {
    // DOM Elements
    const tabs = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    const titleInput = document.getElementById("title");
    const fontFamilySelect = document.getElementById("font-family");
    const textColorInput = document.getElementById("text-color");
    const shadowColorInput = document.getElementById("shadow-color");
    const fontSizeInput = document.getElementById("font-size");
    const fontSizeValue = document.getElementById("font-size-value");
    const bgUrlInput = document.getElementById("bg-url");
    const imageUpload = document.getElementById("image-upload");
    const textSelector = document.getElementById("text-selector");
    const downloadBtn = document.getElementById("download-btn");
    const presetButtons = document.querySelectorAll(".preset-btn");
    const bgImage = document.getElementById("bg-image");

    // Current active text element
    let activeTextElement = document.getElementById("text-overlay-1");

    // Tab Switching Logic
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove("active"));
            // Add active class to clicked tab
            tab.classList.add("active");
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove("active"));
            // Show the selected tab content
            const tabId = tab.getAttribute("data-tab");
            document.getElementById(`${tabId}-tab`).classList.add("active");
        });
    });

    // Text Selection
    textSelector.addEventListener("change", function() {
        activeTextElement = document.getElementById(`text-overlay-${this.value}`);
        // Update input fields to reflect current text settings
        titleInput.value = activeTextElement.textContent;
    });

    // Text Content Update
    titleInput.addEventListener("input", function() {
        activeTextElement.textContent = this.value;
    });

    // Font Family Update
    fontFamilySelect.addEventListener("change", function() {
        activeTextElement.style.fontFamily = this.value;
    });

    // Text Color Update
    textColorInput.addEventListener("input", function() {
        activeTextElement.style.color = this.value;
    });

    // Text Shadow Update
    shadowColorInput.addEventListener("input", function() {
        activeTextElement.style.textShadow = `2px 2px 5px ${this.value}`;
    });

    // Font Size Update
    fontSizeInput.addEventListener("input", function() {
        const size = this.value;
        activeTextElement.style.fontSize = `${size}px`;
        fontSizeValue.textContent = size;
    });

    // Background Image from URL
    bgUrlInput.addEventListener("input", function() {
        bgImage.src = this.value || "https://via.placeholder.com/1280x720";
    });

    // Background Image Upload
    imageUpload.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                bgImage.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Preset Templates
    presetButtons.forEach(button => {
        button.addEventListener("click", function() {
            const bg = this.getAttribute("data-bg");
            const text1 = this.getAttribute("data-text1");
            const text2 = this.getAttribute("data-text2");
            
            // Apply preset
            bgImage.src = bg;
            document.getElementById("text-overlay-1").textContent = text1;
            document.getElementById("text-overlay-2").textContent = text2;
            
            // Switch to text tab
            tabs[0].click();
        });
    });

    // Make Text Elements Draggable
    document.querySelectorAll(".text-overlay").forEach(element => {
        let isDragging = false;
        let offsetX, offsetY;

        element.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            element.style.cursor = "grabbing";
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            
            const thumbnail = document.getElementById("thumbnail");
            const thumbRect = thumbnail.getBoundingClientRect();
            
            // Calculate new position
            let x = e.clientX - thumbRect.left - offsetX;
            let y = e.clientY - thumbRect.top - offsetY;

            // Boundary checking
            x = Math.max(0, Math.min(x, thumbRect.width - element.offsetWidth));
            y = Math.max(0, Math.min(y, thumbRect.height - element.offsetHeight));

            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
            element.style.cursor = "move";
        });
    });

    // Download Thumbnail
    downloadBtn.addEventListener("click", function() {
        html2canvas(document.getElementById("thumbnail")).then(canvas => {
            const link = document.createElement("a");
            link.download = "youtube-thumbnail.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        });
    });
});