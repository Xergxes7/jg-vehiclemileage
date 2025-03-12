(function () {
  const odometer = document.querySelector(".odometer");
  const value = document.querySelector(".odometer-value");
  const unit = document.querySelector(".odometer-unit");
  
  // Check if gear display already exists to prevent multiple creations
  let gearDisplay = document.querySelector(".gear-display");
  
  if (!gearDisplay) {
    gearDisplay = document.createElement("div");
    gearDisplay.classList.add("gear-display");
    gearDisplay.innerHTML = '<span class="gear-label">GEAR:</span> <span class="gear-value">N</span>';
    odometer.parentElement.appendChild(gearDisplay); // Append gear display below odometer
  }

  let lastGear = null; // Initialize with `null` to track changes

  function elementPosition(position) {
      const container = document.querySelector(".hud-container");
      container.style.top = "";
      container.style.bottom = "";
      container.style.left = "";
      container.style.right = "";
      container.style.transform = "";

      switch (position) {
          case "bottom-right":
              container.style.bottom = "0";
              container.style.right = "0";
              break;
          case "bottom-left":
              container.style.bottom = "0";
              container.style.left = "0";
              break;
          case "top-right":
              container.style.top = "0";
              container.style.right = "0";
              break;
          case "top-left":
              container.style.top = "0";
              container.style.left = "0";
              break;
          case "bottom-center":
              container.style.bottom = "0";
              container.style.left = "50%";
              container.style.transform = "translateX(-50%)";
              break;
          case "top-center":
              container.style.top = "0";
              container.style.left = "50%";
              container.style.transform = "translateX(-50%)";
              break;
          default:
              container.style.bottom = "0";
              container.style.right = "0";
              break;
      }
  }

  window.addEventListener("message", (evt) => {
      const { data } = evt;
      if (!data) return;

      if (data.type === "show") {
          odometer.style.display = "flex";
          gearDisplay.style.display = "flex";

          let odoValue = parseFloat(data.value);
          if (isNaN(odoValue)) odoValue = 0;

          value.innerHTML = Math.floor(odoValue)
              .toString()
              .padStart(6, "0"); // Ensure padded formatting
          unit.innerHTML = data.unit === "miles" ? "MI" : "KM";
          elementPosition(data.position);
      } 
      else if (data.type === "hide") {
          odometer.style.display = "none";
          gearDisplay.style.display = "none";
      } 
      else if (data.type === "updateGear") {
          const gearValue = document.querySelector(".gear-value");
          let gear = data.gear;
          let gearDisplay = gear.toString() + " / " + data.totalGears.toString();
          if (gear !== lastGear) {
              if (gear === 0) {
                  gearValue.textContent = "N"; // Neutral
              } else if (gear < 0) {
                  gearValue.textContent = "R"; // Reverse
              } else {
                  gearValue.textContent = gearDisplay; // Regular gears
              }
              lastGear = gear; // Update last recorded gear
          }
      }
  });
})();
