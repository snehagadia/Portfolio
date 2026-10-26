console.log("JavaScript connected");

(function () {
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    var navLinks = nav.querySelectorAll("a");
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    }
  }

  var sections = document.querySelectorAll("main section[id]");
  var menuLinks = document.querySelectorAll('.primary-nav a[href^="#"]');

  if ("IntersectionObserver" in window && sections.length && menuLinks.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          var id = entry.target.id;
          for (var j = 0; j < menuLinks.length; j++) {
            var link = menuLinks[j];
            var active = link.getAttribute("href") === "#" + id;
            if (active) {
              link.classList.add("is-active");
            } else {
              link.classList.remove("is-active");
            }
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0.1 }
    );

    for (var k = 0; k < sections.length; k++) {
      observer.observe(sections[k]);
    }
  }

  initThemeToggle();
  initProjectFilters();
  initCopyEmail();
  initWeather();
  initChatbot();
})();

function initThemeToggle() {
  var root = document.documentElement;
  var button = document.getElementById("theme-toggle");
  var saved = null;

  try {
    saved = localStorage.getItem("theme");
  } catch (error) {
    saved = null;
  }

  var prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  var theme = saved || root.getAttribute("data-theme") || (prefersDark ? "dark" : "light");
  applyTheme(theme);

  if (!button) {
    return;
  }

  button.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch (error) {
      // Ignore storage errors in private browsing.
    }
  });

  function applyTheme(nextTheme) {
    root.setAttribute("data-theme", nextTheme);
    document.body.classList.toggle("dark-mode", nextTheme === "dark");
    if (!button) {
      return;
    }
    var isDark = nextTheme === "dark";
    button.setAttribute("aria-pressed", isDark ? "true" : "false");
    button.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );
    button.textContent = isDark ? "Light mode" : "Dark mode";
  }
}

function initProjectFilters() {
  var searchInput = document.getElementById("project-search");
  var filterHost = document.getElementById("tech-filters");
  var emptyMessage = document.getElementById("project-empty");
  var cards = document.querySelectorAll("#project-grid .project-card");

  if (!searchInput || !filterHost || !cards.length) {
    return;
  }

  var technologies = [];
  for (var i = 0; i < cards.length; i++) {
    var techText = cards[i].getAttribute("data-tech") || "";
    var parts = techText.split(",");
    for (var p = 0; p < parts.length; p++) {
      var tech = parts[p].trim();
      if (tech && technologies.indexOf(tech) === -1) {
        technologies.push(tech);
      }
    }
  }

  technologies.sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });

  var activeTech = "all";
  filterHost.appendChild(createFilterButton("All Projects", "all", true));
  for (var t = 0; t < technologies.length; t++) {
    filterHost.appendChild(createFilterButton(technologies[t], technologies[t], false));
  }

  searchInput.addEventListener("input", renderProjects);
  filterHost.addEventListener("click", function (event) {
    var button = event.target.closest(".filter-btn");
    if (!button) {
      return;
    }
    activeTech = button.getAttribute("data-filter") || "all";
    var buttons = filterHost.querySelectorAll(".filter-btn");
    for (var b = 0; b < buttons.length; b++) {
      buttons[b].classList.toggle("is-active", buttons[b] === button);
    }
    renderProjects();
  });

  renderProjects();

  function createFilterButton(label, value, isActive) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "filter-btn" + (isActive ? " is-active" : "");
    button.setAttribute("data-filter", value);
    button.textContent = label;
    return button;
  }

  function renderProjects() {
    var query = searchInput.value.trim().toLowerCase();
    var visibleCount = 0;

    for (var c = 0; c < cards.length; c++) {
      var card = cards[c];
      var title = (card.getAttribute("data-title") || "").toLowerCase();
      var description = (card.getAttribute("data-description") || "").toLowerCase();
      var tech = (card.getAttribute("data-tech") || "").toLowerCase();
      var matchesQuery =
        !query ||
        title.indexOf(query) !== -1 ||
        description.indexOf(query) !== -1 ||
        tech.indexOf(query) !== -1;
      var matchesTech =
        activeTech === "all" ||
        tech.split(",").some(function (item) {
          return item.trim() === activeTech.toLowerCase();
        });

      var show = matchesQuery && matchesTech;
      card.hidden = !show;
      if (show) {
        visibleCount += 1;
      }
    }

    if (emptyMessage) {
      emptyMessage.hidden = visibleCount > 0;
    }
  }
}

function initCopyEmail() {
  var button = document.getElementById("copy-email");
  if (!button) {
    return;
  }

  button.addEventListener("click", function () {
    var email = button.getAttribute("data-email") || "snehagadia062@gmail.com";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(
        function () {
          button.textContent = "Email copied";
        },
        function () {
          button.textContent = "Copy failed";
        }
      );
      return;
    }
    button.textContent = "Copy is not available in this browser";
  });
}

function weatherCodeLabel(code) {
  var labels = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
  };
  if (Object.prototype.hasOwnProperty.call(labels, code)) {
    return labels[code];
  }
  return "Condition code " + code;
}

function initWeather() {
  var form = document.getElementById("weather-form");
  var cityInput = document.getElementById("weather-city");
  var statusEl = document.getElementById("weather-status");
  var resultEl = document.getElementById("weather-result");

  if (!form || !cityInput || !statusEl || !resultEl) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var city = cityInput.value.trim();
    if (!city) {
      setWeatherStatus("Please enter a city name.", true);
      resultEl.hidden = true;
      return;
    }
    fetchWeather(city);
  });

  function setWeatherStatus(message, isError) {
    statusEl.textContent = message;
    statusEl.classList.toggle("is-error", Boolean(isError));
  }

  function fetchWeather(city) {
    setWeatherStatus("Looking up " + city + "...", false);
    resultEl.hidden = true;

    var geoUrl =
      "https://geocoding-api.open-meteo.com/v1/search?name=" +
      encodeURIComponent(city) +
      "&count=1&language=en&format=json";

    fetch(geoUrl)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("geocoding");
        }
        return response.json();
      })
      .then(function (geoData) {
        if (!geoData || !geoData.results || !geoData.results.length) {
          throw new Error("not-found");
        }
        var place = geoData.results[0];
        var forecastUrl =
          "https://api.open-meteo.com/v1/forecast?latitude=" +
          encodeURIComponent(place.latitude) +
          "&longitude=" +
          encodeURIComponent(place.longitude) +
          "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m";
        return fetch(forecastUrl).then(function (response) {
          if (!response.ok) {
            throw new Error("forecast");
          }
          return response.json().then(function (forecast) {
            return { place: place, forecast: forecast };
          });
        });
      })
      .then(function (data) {
        var current = data.forecast && data.forecast.current;
        if (!current || typeof current.temperature_2m !== "number") {
          throw new Error("missing");
        }

        var cityName = data.place.name || city;
        var country = data.place.country || "Country not provided";
        var humidity =
          typeof current.relative_humidity_2m === "number"
            ? current.relative_humidity_2m + "%"
            : "Not available";
        var wind =
          typeof current.wind_speed_10m === "number"
            ? current.wind_speed_10m + " km/h"
            : "Not available";

        resultEl.innerHTML = "";
        var heading = document.createElement("h3");
        heading.textContent = cityName + ", " + country;
        var list = document.createElement("dl");
        addWeatherRow(list, "Temperature", current.temperature_2m + " °C");
        addWeatherRow(list, "Condition", weatherCodeLabel(current.weather_code));
        addWeatherRow(list, "Humidity", humidity);
        addWeatherRow(list, "Wind speed", wind);
        resultEl.appendChild(heading);
        resultEl.appendChild(list);
        resultEl.hidden = false;
        setWeatherStatus("Live weather from Open-Meteo.", false);
      })
      .catch(function (error) {
        resultEl.hidden = true;
        if (error && error.message === "not-found") {
          setWeatherStatus(
            "That city was not found. Check the spelling and try again.",
            true
          );
          return;
        }
        if (error && error.message === "missing") {
          setWeatherStatus(
            "Weather data was incomplete for that location.",
            true
          );
          return;
        }
        setWeatherStatus(
          "Weather information could not be retrieved. Check your connection and try again.",
          true
        );
      });
  }

  function addWeatherRow(list, label, value) {
    var dt = document.createElement("dt");
    dt.textContent = label;
    var dd = document.createElement("dd");
    dd.textContent = value;
    list.appendChild(dt);
    list.appendChild(dd);
  }
}

function initChatbot() {
  var panel = document.getElementById("chat-panel");
  var toggle = document.getElementById("chat-toggle");
  var closeBtn = document.getElementById("chat-close");
  var form = document.getElementById("chat-form");
  var input = document.getElementById("chat-input");
  var log = document.getElementById("chat-log");
  var statusEl = document.getElementById("chat-status");
  var clearBtn = document.getElementById("chat-clear");

  if (!panel || !toggle || !form || !input || !log) {
    return;
  }

  var history = [];
  addBubble(
    "assistant",
    "Hello. I can answer questions about Sneha Gadia's portfolio, studies, skills, projects, and contact details. Live replies need the backend and an API key."
  );

  toggle.addEventListener("click", function () {
    var open = panel.hasAttribute("hidden");
    if (open) {
      panel.removeAttribute("hidden");
    } else {
      panel.setAttribute("hidden", "");
    }
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      input.focus();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      panel.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", "false");
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      history = [];
      log.innerHTML = "";
      addBubble(
        "assistant",
        "Conversation cleared. Ask another question about this portfolio."
      );
      setChatStatus("");
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    sendChat();
  });

  function setChatStatus(message, isError) {
    if (!statusEl) {
      return;
    }
    statusEl.textContent = message;
    statusEl.classList.toggle("is-error", Boolean(isError));
  }

  function addBubble(role, text) {
    var bubble = document.createElement("div");
    bubble.className = "chat-bubble " + role;
    bubble.textContent = text;
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
  }

  function sendChat() {
    var message = input.value.trim();
    if (!message) {
      setChatStatus("Please type a question before sending.", true);
      return;
    }
    if (message.length > 500) {
      setChatStatus("Please keep questions under 500 characters.", true);
      return;
    }

    addBubble("user", message);
    history.push({ role: "user", content: message });
    input.value = "";
    setChatStatus("Thinking...", false);
    form.querySelector("button[type='submit']").disabled = true;

    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message, history: history.slice(-8) })
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok, status: response.status, data: data };
        });
      })
      .then(function (result) {
        var reply =
          result.data && result.data.reply
            ? result.data.reply
            : result.data && result.data.error
              ? result.data.error
              : "The chatbot could not return a reply.";
        addBubble("assistant", reply);
        if (result.ok && result.data && result.data.reply) {
          history.push({ role: "assistant", content: result.data.reply });
          setChatStatus("");
        } else {
          setChatStatus(reply, true);
        }
      })
      .catch(function () {
        addBubble(
          "assistant",
          "I could not reach the chatbot backend. Start the local server with npm start, or deploy the API on Vercel with OPENAI_API_KEY. Opening index.html as a file cannot securely run the AI chatbot."
        );
        setChatStatus("Backend is not available.", true);
      })
      .then(function () {
        form.querySelector("button[type='submit']").disabled = false;
      });
  }
}
