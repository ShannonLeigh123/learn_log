document.addEventListener("DOMContentLoaded", () => {
  const bgUpload = document.getElementById("bg-upload");
  const clearBgBtn = document.getElementById("reset-bg-btn");
  const storageKey = `custom_bg_${window.location.pathname}`;

  // 1. ALWAYS run this. It loads the background if one exists for this URL.
  const savedBg = localStorage.getItem(storageKey);
  if (savedBg) {
    document.body.style.backgroundImage = `url('${savedBg}')`;
  }

  // 2. ONLY attach upload logic if the HTML buttons actually exist on this specific page.
  if (bgUpload) {
    bgUpload.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target.result;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const MAX_WIDTH = 1920;
            let width = img.width;
            let height = img.height;
            
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);
            
            try {
              localStorage.setItem(storageKey, compressedBase64);
              document.body.style.backgroundImage = `url('${compressedBase64}')`;
            } catch (error) {
              alert("Even after compression, this image is too large.");
              console.error("Storage error:", error);
            }
          };
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 3. ONLY attach clear logic if the clear button exists on this specific page.
  if (clearBgBtn) {
    clearBgBtn.addEventListener("click", () => {
      localStorage.removeItem(storageKey);
      document.body.style.backgroundImage = "";
      if (bgUpload) bgUpload.value = "";
    });
  }
});
