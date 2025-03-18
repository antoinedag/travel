document.addEventListener("DOMContentLoaded", function () {
  /* ================== INITIALISATION DU GLOBE ================== */

  const container = d3
    .select("#globe-container")
    .style("display", "flex")
    .style("justify-content", "center")
    .style("align-items", "center")
    .style("width", "100%");

  let width = Math.min(window.innerWidth * 0.8, 600);
  let height = width;

  const projection = d3
    .geoOrthographic()
    .scale(width / 2.3)
    .translate([width / 2, height / 2])
    .rotate([0, 0]);

  const path = d3.geoPath().projection(projection);

  const svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  function disableScroll() {
    document.body.style.overflow = "hidden";
  }

  function enableScroll() {
    document.body.style.overflow = "";
  }

  /* ================== CREATION DU GLOBE ================== */

  svg
    .append("circle")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", width / 2.3)
    .attr("fill", "#87CEEB");

  const selectedCountries = {
    250: { name: "France", color: "#F5A533", url: "france.html" },
    392: { name: "Japon", color: "#EA4848", url: "japan.html" },
    76: { name: "Brésil", color: "#8FCE00", url: "brazil.html" },
    124: { name: "Canada", color: "#2986CC", url: "canada.html" },
    380: { name: "Italie", color: "#C90076", url: "italia.html" },
  };

  d3.json("https://unpkg.com/world-atlas@2.0.2/countries-110m.json").then(
    (data) => {
      const countries = topojson.feature(data, data.objects.countries);

      svg
        .append("g")
        .selectAll("path")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", (d) =>
          selectedCountries[d.id] ? selectedCountries[d.id].color : "#cccccc"
        )
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 0.5)
        .on("mouseover", function () {
          d3.select(this).attr("stroke-width", 2);
        })
        .on("mouseout", function () {
          d3.select(this).attr("stroke-width", 0.5);
        })
        .on("click", function (event, d) {
          if (selectedCountries[d.id]) {
            window.location.href = selectedCountries[d.id].url;
          }
        });
    }
  );

  /* ================== GESTION DE LA ROTATION ================== */

  let lastX,
    lastY,
    rotating = false;

  function rotateGlobe(event, isTouch = false) {
    const dx = (isTouch ? event.touches[0].clientX : event.clientX) - lastX;
    const dy = (isTouch ? event.touches[0].clientY : event.clientY) - lastY;

    projection.rotate([
      projection.rotate()[0] + dx * 0.2,
      projection.rotate()[1] - dy * 0.2,
    ]);

    svg.selectAll("path").attr("d", path);
    lastX = isTouch ? event.touches[0].clientX : event.clientX;
    lastY = isTouch ? event.touches[0].clientY : event.clientY;
  }

  svg.on("mousedown", function (event) {
    rotating = true;
    lastX = event.clientX;
    lastY = event.clientY;
    disableScroll();
  });

  svg.on("mousemove", function (event) {
    if (rotating) rotateGlobe(event);
  });

  svg.on("mouseup mouseleave", function () {
    rotating = false;
    enableScroll();
  });

  svg.on("touchstart", function (event) {
    rotating = true;
    lastX = event.touches[0].clientX;
    lastY = event.touches[0].clientY;
    disableScroll();
  });

  svg.on("touchmove", function (event) {
    if (rotating) {
      rotateGlobe(event, true);
      event.preventDefault();
    }
  });

  svg.on("touchend", function () {
    rotating = false;
    enableScroll();
  });

  /* ================== AJUSTEMENT AU REDIMENSIONNEMENT ================== */

  window.addEventListener("resize", function () {
    width = Math.min(window.innerWidth * 0.8, 600);
    height = width;
    projection.scale(width / 2.3).translate([width / 2, height / 2]);

    svg.attr("width", width).attr("height", height);
    svg
      .select("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", width / 2.3);
    svg.selectAll("path").attr("d", path);
  });
});

/* ================== GESTION DU SLIDER DE PROGRESSION ================== */

document.addEventListener("DOMContentLoaded", function () {
  function updateSlider(slider) {
    const colors = ["red", "orange", "green"];
    const value = slider.value;
    const percentage = (value / 2) * 100; // 0%, 50%, 100%
    const color = colors[value];

    // Appliquer la couleur au point du slider
    slider.style.setProperty("--slider-color", color);

    // Définir uniquement la partie gauche colorée
    slider.style.background = `linear-gradient(to right, ${color} 0%, ${color} ${percentage}%, #ddd ${percentage}%)`;
  }

  document.querySelectorAll(".progress-slider").forEach((slider) => {
    updateSlider(slider);
    slider.addEventListener("input", function () {
      updateSlider(this);
    });
  });

  /* ================== AJOUTER UNE NOUVELLE LIGNE ================== */

  document.getElementById("addRow").addEventListener("click", function () {
    const tableBody = document.getElementById("voyageTableBody");
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>
        <select class="country-select">
          <option value="France">France</option>
          <option value="Japon">Japon</option>
          <option value="Brésil">Brésil</option>
          <option value="Canada">Canada</option>
          <option value="Italie">Italie</option>
        </select>
      </td>
      <td colspan="3">
        <input type="range" min="0" max="2" value="0" class="progress-slider"/>
      </td>`;
    tableBody.appendChild(newRow);

    const newSlider = newRow.querySelector(".progress-slider");
    updateSlider(newSlider);
    newSlider.addEventListener("input", function () {
      updateSlider(this);
    });
  });
});
