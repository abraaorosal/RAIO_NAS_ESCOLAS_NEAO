const quizQuestions = [
  {
    question: "1. Durante uma abordagem, qual atitude é mais segura?",
    options: [
      "a) Correr",
      "b) Colocar a mão no bolso rapidamente",
      "c) Manter as mãos visíveis e seguir orientações",
      "d) Discutir com a equipe",
    ],
    answer: 2,
  },
  {
    question: "2. Cyberbullying pode acontecer:",
    options: [
      "a) Apenas pessoalmente",
      "b) Apenas na escola",
      "c) Pela internet, redes sociais, jogos e aplicativos",
      "d) Somente entre adultos",
    ],
    answer: 2,
  },
  {
    question: "3. Recebi imagem íntima de outra pessoa. O que devo fazer?",
    options: [
      "a) Repassar para o grupo",
      "b) Postar nos stories",
      "c) Não compartilhar, apagar e buscar orientação",
      "d) Fazer meme",
    ],
    answer: 2,
  },
  {
    question: "4. Para entrar na PMCE, o caminho regular é:",
    options: [
      "a) Indicação",
      "b) Concurso público",
      "c) Convite direto para o RAIO",
      "d) Cadastro informal",
    ],
    answer: 1,
  },
  {
    question: "5. Criar perfil falso para prejudicar alguém:",
    options: [
      "a) É sempre brincadeira",
      "b) Pode gerar responsabilidade",
      "c) É permitido se for anônimo",
      "d) Só importa se viralizar",
    ],
    answer: 1,
  },
  {
    question: "6. Se eu for vítima de ataque virtual, devo:",
    options: [
      "a) Revidar",
      "b) Apagar tudo sem registrar",
      "c) Guardar provas e pedir ajuda",
      "d) Marcar briga",
    ],
    answer: 2,
  },
  {
    question: "7. Durante abordagem, antes de pegar documento no bolso, devo:",
    options: [
      "a) Pegar rapidamente",
      "b) Avisar o policial e aguardar orientação",
      "c) Virar de costas",
      "d) Sair andando",
    ],
    answer: 1,
  },
  {
    question: "8. Internet:",
    options: [
      "a) É terra sem lei",
      "b) Não deixa rastros",
      "c) Pode gerar provas e consequências reais",
      "d) Não tem relação com responsabilidade",
    ],
    answer: 2,
  },
  {
    question: "9. O CPRAio exige:",
    options: [
      "a) Apenas vontade",
      "b) Seleção, formação, disciplina e preparo",
      "c) Sorte",
      "d) Indicação informal",
    ],
    answer: 1,
  },
  {
    question: "10. Respeito durante uma abordagem:",
    options: [
      "a) Ajuda a reduzir riscos",
      "b) Não importa",
      "c) Só vale para adultos",
      "d) É desnecessário",
    ],
    answer: 0,
  },
];

const quizContainer = document.querySelector("#quiz-questions");
const quizForm = document.querySelector("#quiz-form");
const quizResult = document.querySelector("#quiz-result");
const starsDisplay = document.querySelector("#stars-display");
const resetQuizButton = document.querySelector("#reset-quiz");
const quizProgressText = document.querySelector("#quiz-progress-text");
const quizProgressBar = document.querySelector("#quiz-progress-bar");
const confettiLayer = document.querySelector("#confetti-layer");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const backToTop = document.querySelector("#back-to-top");
const scrollProgressBar = document.querySelector("#scroll-progress-bar");
const heroCounters = document.querySelectorAll("[data-hero-count]");
const statCounters = document.querySelectorAll("[data-count]");
const trackerLinks = document.querySelectorAll(".tracker-link");
const sectionLinks = document.querySelectorAll("[data-section-link]");
const revealItems = document.querySelectorAll(".reveal");
const choiceButtons = document.querySelectorAll(".choice-button");
const choiceFeedback = document.querySelector("#choice-feedback");
const meterInputs = document.querySelectorAll("[data-meter]");
const meterValues = document.querySelectorAll("[data-meter-value]");
const evaluateMeterButton = document.querySelector("#evaluate-meter");
const meterFeedback = document.querySelector("#meter-feedback");
const missionCheckboxes = document.querySelectorAll("[data-mission]");
const videoCards = document.querySelectorAll(".video-card");
const featuredVideo = document.querySelector("#featured-video");
const featuredIframe = document.querySelector("#featured-iframe");
const videoPlaceholder = document.querySelector("#video-placeholder");
const videoTitle = document.querySelector("#video-title");
const videoDescription = document.querySelector("#video-description");
const videoExternalLink = document.querySelector("#video-external-link");
const municipioWidgets = document.querySelectorAll(".municipio-widget");
const municipiosDataElement = document.querySelector("#raio-municipios-data");
const mapInteractive = document.querySelector("#map-interactive");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const raioMunicipios = municipiosDataElement
  ? JSON.parse(municipiosDataElement.textContent)
  : [];
const raioMapData = window.RAIO_CEARA_MAP || { features: [] };
const raioMapState = {
  selectedKey: null,
  selectedPath: null,
};

const choiceMessages = {
  certo:
    "Correto. Manter a calma, mostrar as mãos e aguardar orientação ajuda a tornar a abordagem mais segura para todos.",
  alerta:
    "Atenção. Mesmo que a intenção seja apenas pegar o celular, movimentos bruscos sem avisar podem gerar risco. O mais seguro é avisar antes.",
  errado:
    "Incorreto. Correr pode aumentar a tensão e o risco. O mais seguro é parar, manter a calma e seguir as orientações.",
};

function formatNumber(value) {
  return Number(value).toLocaleString("pt-BR");
}

function normalizeText(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();
}

function animateValue(element, finalValue, duration = 1200) {
  const target = Number(finalValue);
  if (Number.isNaN(target)) return;

  if (reducedMotion) {
    element.textContent = formatNumber(target);
    return;
  }

  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(progress * target);
    element.textContent = formatNumber(value);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = formatNumber(target);
    }
  }

  requestAnimationFrame(update);
}

function renderQuiz() {
  if (!quizContainer) return;

  quizContainer.innerHTML = quizQuestions
    .map((item, index) => {
      const options = item.options
        .map(
          (option, optionIndex) => `
            <label class="quiz-option" data-option-index="${optionIndex}">
              <input
                type="radio"
                name="question-${index}"
                value="${optionIndex}"
                aria-label="${option}"
              />
              <span>${option}</span>
            </label>
          `
        )
        .join("");

      return `
        <fieldset class="quiz-item" data-question-index="${index}">
          <legend class="quiz-legend">${item.question}</legend>
          <div class="quiz-options">${options}</div>
        </fieldset>
      `;
    })
    .join("");

  bindQuizOptionSelection();
  updateQuizProgress();
}

function bindQuizOptionSelection() {
  if (!quizForm) return;

  quizForm.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener("change", () => {
      const question = input.closest(".quiz-item");
      if (!question) return;

      question.querySelectorAll(".quiz-option").forEach((option) => {
        option.classList.remove("is-selected");
      });

      input.closest(".quiz-option")?.classList.add("is-selected");
      updateQuizProgress();
    });
  });
}

function updateQuizProgress() {
  if (!quizForm || !quizProgressBar || !quizProgressText) return;

  const answered = quizForm.querySelectorAll('input[type="radio"]:checked').length;
  const percentage = (answered / quizQuestions.length) * 100;

  quizProgressBar.style.width = `${percentage}%`;
  quizProgressText.textContent = `Pergunta ${answered} de ${quizQuestions.length} respondida${answered === 1 ? "" : "s"}`;
}

function getResultMessage(score) {
  if (score <= 4) {
    return "Você precisa revisar a cartilha.";
  }

  if (score <= 7) {
    return "Bom começo. Continue aprendendo.";
  }

  return "Excelente. Você demonstrou consciência cidadã.";
}

function getStars(score) {
  if (score >= 8) return 3;
  if (score >= 5) return 2;
  return 1;
}

function renderStars(score) {
  if (!starsDisplay) return;

  const stars = getStars(score);
  const starMarkup = Array.from({ length: 3 }, (_, index) => {
    const active = index < stars;
    return `
      <span class="star-badge" aria-hidden="true">
        <svg viewBox="0 0 64 64">
          <path
            d="M32 8l7.2 14.6L55 25l-11.5 11.2L46.4 52 32 44.5 17.6 52l2.9-15.8L9 25l15.8-2.4z"
            fill="${active ? "#d6a11c" : "#d9e0db"}"
            stroke="${active ? "#8a6500" : "#98a49a"}"
            stroke-width="3"
          ></path>
        </svg>
      </span>
    `;
  }).join("");

  starsDisplay.innerHTML = `${starMarkup}<span class="sr-inline">Você conquistou ${stars} estrela${stars > 1 ? "s" : ""}.</span>`;
}

function launchConfetti() {
  if (!confettiLayer) return;

  confettiLayer.innerHTML = "";

  if (reducedMotion) return;

  const colors = ["#d6a11c", "#2b7de9", "#2f6f4f", "#f06595", "#f2cf6b"];

  for (let index = 0; index < 28; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    piece.style.transform = `translateY(0) rotate(${Math.random() * 120}deg)`;
    confettiLayer.appendChild(piece);
  }

  window.setTimeout(() => {
    confettiLayer.innerHTML = "";
  }, 2600);
}

function evaluateQuiz() {
  if (!quizForm || !quizResult) return;

  let score = 0;

  quizQuestions.forEach((item, index) => {
    const question = quizForm.querySelector(`[data-question-index="${index}"]`);
    const selected = quizForm.querySelector(`input[name="question-${index}"]:checked`);

    question?.querySelectorAll(".quiz-option").forEach((option, optionIndex) => {
      option.classList.remove("is-correct", "is-wrong", "is-correct-answer");

      if (optionIndex === item.answer) {
        option.classList.add("is-correct-answer");
      }

      if (selected && Number(selected.value) === optionIndex) {
        if (optionIndex === item.answer) {
          option.classList.add("is-correct");
          score += 1;
        } else {
          option.classList.add("is-wrong");
        }
      }
    });
  });

  quizResult.textContent = `Resultado: ${score}/10. ${getResultMessage(score)}`;
  renderStars(score);

  if (score >= 8) {
    launchConfetti();
  } else if (confettiLayer) {
    confettiLayer.innerHTML = "";
  }

  if (!reducedMotion) {
    quizResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function resetQuiz() {
  if (!quizForm || !quizResult) return;

  quizForm.reset();
  quizResult.textContent = "";
  if (starsDisplay) starsDisplay.innerHTML = "";
  if (confettiLayer) confettiLayer.innerHTML = "";

  quizForm.querySelectorAll(".quiz-option").forEach((option) => {
    option.classList.remove("is-selected", "is-correct", "is-wrong", "is-correct-answer");
  });

  updateQuizProgress();
}

function updateScrollProgress() {
  if (!scrollProgressBar) return;

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  scrollProgressBar.style.width = `${progress}%`;
}

function setVisitedState(sectionId) {
  sectionLinks.forEach((link) => {
    if (link.dataset.sectionLink === sectionId) {
      link.dataset.visited = "true";
    }
  });

  trackerLinks.forEach((link) => {
    if (link.dataset.trackTarget === sectionId) {
      link.classList.add("is-seen");
    }
  });
}

function setupSectionObserver() {
  const sectionIds = [
    "hero",
    "trilha",
    "o-que-e",
    "onde-raio",
    "policial-raio",
    "estrutura-raio",
    "galeria-raio",
    "videos-raio",
    "numeros",
    "abordagem",
    "ponte-jovem",
    "direitos",
    "mitos",
    "vida-digital",
    "redes",
    "vitima",
    "carreira",
    "cpraio",
    "valores",
    "missao",
    "quiz",
    "professores",
    "fontes",
  ];

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!("IntersectionObserver" in window) || sections.length === 0) {
    sections.forEach((section) => setVisitedState(section.id));
    return;
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisitedState(entry.target.id);
        }
      });
    },
    {
      threshold: 0.35,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

function updateFeaturedVideo(card) {
  if (
    !card ||
    !featuredVideo ||
    !featuredIframe ||
    !videoTitle ||
    !videoDescription ||
    !videoPlaceholder ||
    !videoExternalLink
  ) {
    return;
  }

  const {
    videoKind: kind,
    videoTitle: title,
    videoDescription: description,
    videoPoster: poster,
    videoSrc: src,
  } = card.dataset;

  videoCards.forEach((item) => item.classList.remove("is-active"));
  card.classList.add("is-active");

  videoTitle.textContent = title || "Vídeo do RAIO";
  videoDescription.textContent = description || "";
  featuredVideo.poster = poster || "";
  videoExternalLink.classList.add("hidden");
  videoExternalLink.href = "#";

  featuredVideo.classList.add("hidden");
  featuredIframe.classList.add("hidden");
  featuredIframe.removeAttribute("src");
  featuredVideo.pause();

  if (!src) {
    featuredVideo.removeAttribute("src");
    featuredVideo.load();
    videoPlaceholder.classList.remove("hidden");
    return;
  }

  videoPlaceholder.classList.add("hidden");

  if (kind === "file") {
    if (featuredVideo.getAttribute("src") !== src) {
      featuredVideo.src = src;
      featuredVideo.load();
    }
    featuredVideo.classList.remove("hidden");
    return;
  }

  if (kind === "youtube") {
    featuredIframe.src = src;
    featuredIframe.classList.remove("hidden");
    return;
  }

  videoPlaceholder.classList.remove("hidden");
  videoExternalLink.href = src;
  videoExternalLink.classList.remove("hidden");
}

function buildMunicipioResultMarkup(item) {
  if (!item) {
    return `
      <strong>85 municípios contemplados</strong>
      <p>Busque um município para ver coordenadas e efetivo informado no projeto.</p>
    `;
  }

  if (!item.hasRaio && !item.latitude && !item.longitude && item.codarea) {
    return `
      <strong>${item.nome}</strong>
      <p>Este município aparece no mapa do Ceará, mas não está destacado como base do RAIO nesta versão da cartilha.</p>
      <p><strong>Código IBGE:</strong> ${item.codarea}</p>
    `;
  }

  const efetivo =
    item.efetivo === null || item.efetivo === undefined
      ? "dado a validar"
      : formatNumber(item.efetivo);

  return `
    <strong>${item.nome}</strong>
    <p><strong>Efetivo informado:</strong> ${efetivo}</p>
    <p><strong>Latitude:</strong> ${item.latitude} · <strong>Longitude:</strong> ${item.longitude}</p>
    <p><strong>ID do município:</strong> ${item.id_municipio ?? "dado a validar"}</p>
  `;
}

function getMunicipioByName(value) {
  const normalized = normalizeText(value);

  const fromRaio = raioMunicipios.find(
    (item) => normalizeText(item.nome) === normalized
  );

  if (fromRaio) return fromRaio;

  const feature = raioMapData.features.find((item) => item.key === normalized);
  if (!feature) return null;

  return {
    nome: feature.name,
    codarea: feature.codarea,
    efetivo: feature.efetivo,
    latitude: feature.latitude,
    longitude: feature.longitude,
    id_municipio: feature.idMunicipio,
    hasRaio: feature.hasRaio,
  };
}

function updateMunicipioWidgets(item, selectedName = "") {
  municipioWidgets.forEach((widget) => {
    const input = widget.querySelector("[data-municipio-input]");
    const result = widget.querySelector("[data-municipio-result]");
    if (input && selectedName) input.value = selectedName;
    if (result) result.innerHTML = buildMunicipioResultMarkup(item);
  });
}

function setSelectedMapRegion(key) {
  if (!mapInteractive) return;

  if (raioMapState.selectedPath) {
    raioMapState.selectedPath.classList.remove("is-selected");
    raioMapState.selectedPath.removeAttribute("aria-current");
  }

  raioMapState.selectedKey = key || null;

  if (!key) {
    raioMapState.selectedPath = null;
    return;
  }

  const nextPath = mapInteractive.querySelector(`[data-map-key="${key}"]`);
  if (!nextPath) {
    raioMapState.selectedPath = null;
    return;
  }

  nextPath.classList.add("is-selected");
  nextPath.setAttribute("aria-current", "true");
  raioMapState.selectedPath = nextPath;
}

function updateMapTooltip(content = "") {
  if (!mapInteractive) return;
  const tooltip = mapInteractive.querySelector(".map-tooltip");
  if (!tooltip) return;

  if (!content) {
    tooltip.classList.remove("is-visible");
    tooltip.innerHTML = "";
    return;
  }

  tooltip.innerHTML = content;
  tooltip.classList.add("is-visible");
}

function projectMapBounds(features) {
  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  const visit = (coords) => {
    if (!Array.isArray(coords)) return;

    if (typeof coords[0] === "number" && typeof coords[1] === "number") {
      const [lon, lat] = coords;
      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      return;
    }

    coords.forEach(visit);
  };

  features.forEach((feature) => visit(feature.geometry.coordinates));
  return { minLon, maxLon, minLat, maxLat };
}

function geometryToPath(geometry, projector) {
  const polygonToPath = (polygon) =>
    polygon
      .map((ring) =>
        `${ring
          .map(([lon, lat], pointIndex) => {
            const { x, y } = projector(lon, lat);
            return `${pointIndex === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
          })
          .join(" ")} Z`
      )
      .join(" ");

  if (geometry.type === "Polygon") {
    return polygonToPath(geometry.coordinates);
  }

  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.map(polygonToPath).join(" ");
  }

  return "";
}

function setupInteractiveMap() {
  if (!mapInteractive || !raioMapData.features.length) return;

  const width = 760;
  const height = 900;
  const padding = 18;
  const bounds = projectMapBounds(raioMapData.features);
  const lonSpan = bounds.maxLon - bounds.minLon || 1;
  const latSpan = bounds.maxLat - bounds.minLat || 1;
  const scale = Math.min(
    (width - padding * 2) / lonSpan,
    (height - padding * 2) / latSpan
  );
  const extraX = (width - lonSpan * scale) / 2;
  const extraY = (height - latSpan * scale) / 2;

  const projector = (lon, lat) => ({
    x: (lon - bounds.minLon) * scale + extraX,
    y: (bounds.maxLat - lat) * scale + extraY,
  });

  const svgMarkup = raioMapData.features
    .map((feature) => {
      const path = geometryToPath(feature.geometry, projector);
      const classes = ["map-region", feature.hasRaio ? "has-raio" : "no-raio"].join(" ");
      const label = feature.hasRaio
        ? `${feature.name}. Município com presença do RAIO.`
        : `${feature.name}. Município sem destaque do RAIO nesta base.`;

      return `
        <path
          class="${classes}"
          data-map-key="${feature.key}"
          d="${path}"
          tabindex="0"
          role="button"
          aria-label="${label}"
        >
          <title>${feature.name}</title>
        </path>
      `;
    })
    .join("");

  mapInteractive.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" aria-hidden="true">
      ${svgMarkup}
    </svg>
    <div class="map-tooltip" aria-hidden="true"></div>
  `;

  const paths = mapInteractive.querySelectorAll(".map-region");

  paths.forEach((path) => {
    const key = path.dataset.mapKey;
    const feature = raioMapData.features.find((item) => item.key === key);
    if (!feature) return;

    const item = getMunicipioByName(feature.name);
    const tooltipMarkup = feature.hasRaio
      ? `<strong>${feature.name}</strong><span>Município com presença do RAIO.</span>`
      : `<strong>${feature.name}</strong><span>Município sem destaque do RAIO nesta base.</span>`;

    const selectRegion = () => {
      setSelectedMapRegion(key);
      updateMunicipioWidgets(item, feature.name);
    };

    path.addEventListener("mouseenter", () => updateMapTooltip(tooltipMarkup));
    path.addEventListener("mouseleave", () => updateMapTooltip(""));
    path.addEventListener("focus", () => updateMapTooltip(tooltipMarkup));
    path.addEventListener("blur", () => updateMapTooltip(""));
    path.addEventListener("click", selectRegion);
    path.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectRegion();
      }
    });
  });
}

function setupMunicipioSearch() {
  if (!municipioWidgets.length || !raioMunicipios.length) return;

  municipioWidgets.forEach((widget) => {
    const input = widget.querySelector("[data-municipio-input]");
    const result = widget.querySelector("[data-municipio-result]");
    const list = widget.querySelector("[data-municipio-list]");

    if (!input || !result || !list) return;

    list.innerHTML = raioMunicipios
      .map((item) => `<option value="${item.nome}"></option>`)
      .join("");

    const handleSearch = () => {
      const value = input.value.trim();
      const match = getMunicipioByName(value);
      result.innerHTML = buildMunicipioResultMarkup(match || null);

      if (match) {
        setSelectedMapRegion(normalizeText(match.nome));
        updateMunicipioWidgets(match, match.nome);
      } else {
        setSelectedMapRegion(null);
      }
    };

    input.addEventListener("input", handleSearch);
    input.addEventListener("change", handleSearch);
    result.innerHTML = buildMunicipioResultMarkup(null);
  });
}

function setupRevealObserver() {
  if (!("IntersectionObserver" in window) || revealItems.length === 0) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupCountAnimations() {
  const allCounters = [...heroCounters, ...statCounters];
  if (!("IntersectionObserver" in window) || allCounters.length === 0) {
    heroCounters.forEach((counter) => {
      counter.textContent = formatNumber(counter.dataset.heroCount);
    });
    statCounters.forEach((counter) => {
      counter.textContent = formatNumber(counter.dataset.count);
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const targetValue =
          entry.target.dataset.heroCount || entry.target.dataset.count;

        if (!entry.target.dataset.animated) {
          animateValue(entry.target, targetValue);
          entry.target.dataset.animated = "true";
        }

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  allCounters.forEach((counter) => observer.observe(counter));
}

function setupChoiceInteraction() {
  if (!choiceButtons.length || !choiceFeedback) return;

  choiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      choiceButtons.forEach((item) => item.classList.remove("is-selected"));
      button.classList.add("is-selected");

      const type = button.dataset.choice;
      choiceFeedback.textContent = choiceMessages[type] || "";
      choiceFeedback.className = "choice-feedback";

      if (type === "certo") {
        choiceFeedback.classList.add("is-correct");
      } else if (type === "alerta") {
        choiceFeedback.classList.add("is-warn");
      } else {
        choiceFeedback.classList.add("is-incorrect");
      }
    });
  });
}

function updateMeterValues() {
  meterInputs.forEach((input) => {
    const valueLabel = document.querySelector(`[data-meter-value="${input.dataset.meter}"]`);
    if (valueLabel) {
      valueLabel.textContent = input.value;
    }
  });
}

function evaluateDigitalMeter() {
  if (!meterFeedback) return;

  const total = [...meterInputs].reduce((sum, input) => sum + Number(input.value), 0);

  if (total <= 7) {
    meterFeedback.textContent =
      "Seu termômetro indica que vale reforçar alguns cuidados. Revise a cartilha e converse com um adulto de confiança sobre segurança digital.";
    return;
  }

  if (total <= 11) {
    meterFeedback.textContent =
      "Você está no caminho certo. Já demonstra atenção, mas ainda pode fortalecer hábitos de prevenção online.";
    return;
  }

  meterFeedback.textContent =
    "Ótimo resultado. Você demonstra consciência digital e boas atitudes para se proteger e respeitar outras pessoas na internet.";
}

function loadMissions() {
  missionCheckboxes.forEach((checkbox) => {
    const savedValue = localStorage.getItem(`mission:${checkbox.dataset.mission}`);
    checkbox.checked = savedValue === "true";
  });
}

function saveMissionState(checkbox) {
  localStorage.setItem(`mission:${checkbox.dataset.mission}`, String(checkbox.checked));
}

function setupMissionPersistence() {
  if (!missionCheckboxes.length) return;

  loadMissions();

  missionCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => saveMissionState(checkbox));
  });
}

function setupVideoPlaylist() {
  if (!videoCards.length) return;

  videoCards.forEach((card) => {
    card.addEventListener("click", () => updateFeaturedVideo(card));
  });

  updateFeaturedVideo(document.querySelector(".video-card.is-active") || videoCards[0]);
}

if (quizForm) {
  quizForm.addEventListener("submit", (event) => {
    event.preventDefault();
    evaluateQuiz();
  });
}

if (resetQuizButton) {
  resetQuizButton.addEventListener("click", resetQuiz);
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.classList.toggle("is-active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.classList.remove("is-active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("is-visible", window.scrollY > 600);
    updateScrollProgress();
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  });
}

meterInputs.forEach((input) => {
  input.addEventListener("input", updateMeterValues);
});

if (evaluateMeterButton) {
  evaluateMeterButton.addEventListener("click", evaluateDigitalMeter);
}

renderQuiz();
updateMeterValues();
setupRevealObserver();
setupCountAnimations();
setupSectionObserver();
setupChoiceInteraction();
setupMissionPersistence();
setupVideoPlaylist();
setupInteractiveMap();
setupMunicipioSearch();
updateScrollProgress();
