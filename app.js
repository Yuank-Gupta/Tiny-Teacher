// ELI5 — Explain Like I'm 5
// Uses Lovable AI Gateway (OpenAI-compatible) directly from the browser.
// On first use you'll be prompted for your Lovable API key, which is
// stored only in your browser's localStorage.

const SYSTEM_PROMPT = `You are an expert educator specializing in ultra-simplified teaching for children. Your task is to explain complex topics using the 'Explain Like I'm 5' (ELI5) methodology.

Strictly follow these rules:

1. Tone: Warm, engaging, and incredibly simple. Speak as if talking to a curious 5-year-old.

2. No Jargon: Absolutely NO academic, technical, or heavy terminology. If a technical word is mandatory, you must immediately define it using an everyday object or concept.

3. Structure: Start with a tiny, relatable story or hook. Then, explain the concept using a vivid, physical analogy. Keep paragraphs very short and clear.

4. Simplification: If the user sends a message that says 'SIMPLIFY_FURTHER', look at the previous explanation you gave and rewrite it to be even shorter, using an entirely different, incredibly basic analogy that a toddler could understand.`;


const form = document.getElementById("form");
const topicInput = document.getElementById("topic");
const panel = document.getElementById("panel");
const card = document.getElementById("card");
const feedbackEl = document.getElementById("feedback");
const upBtn = document.getElementById("up");
const downBtn = document.getElementById("down");

let history = [];
let loading = false;


function renderRichText(text) {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function showPanel() { panel.classList.remove("hidden"); }
function hideFeedback() { feedbackEl.classList.add("hidden"); }
function showFeedback() { feedbackEl.classList.remove("hidden"); }

function renderThinking(label = "Thinking...") {
  hideFeedback();
  card.innerHTML = `
    <div class="loader">
      <span class="dots"><span></span><span></span><span></span></span>
      <span>${label}</span>
    </div>`;
}

function renderSimplifying() {
  hideFeedback();
  card.innerHTML = `
    <div class="center-col">
      <img class="teddy" src="teddy.png" alt="Teddy bear" />
      <div class="loader">
        <span class="dots"><span></span><span></span><span></span></span>
        <span>Simplifying...</span>
      </div>
    </div>`;
}

function renderAnswer(text) {
  card.innerHTML = `
    <div class="center-col">
      <img class="teddy" src="teddy.png" alt="Teddy bear" />
      <div class="answer">${renderRichText(text)}</div>
    </div>`;
  showFeedback();
}

function renderThankYou() {
  hideFeedback();
  card.innerHTML = `
    <div class="center-col">
      <img class="teddy" src="teddy.png" alt="Teddy bear" />
      <p class="thank-you">Thank you!</p>
    </div>`;
}

function renderError(msg) {
  hideFeedback();
  card.innerHTML = `<p class="error">${msg}</p>`;
}


async function callAI(messages) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: API_MODEL,
      messages: messages,
      temperature: 0.7
    })
  });

  if (!res.ok) {
    let detail = "";

    try {
      const errorData = await res.json();
      detail =
        errorData?.error?.message ||
        errorData?.message ||
        "";
    } catch {}

    throw new Error(detail || `Request failed (${res.status})`);
  }

  const data = await res.json();

  return (
    data?.choices?.[0]?.message?.content?.trim() ||
    "No response received."
  );
}

async function ask(userMessage, label) {
  if (loading) return;
  loading = true;
  if (label === "simplify") renderSimplifying(); else renderThinking();
  showPanel();
  const next = [...history, { role: "user", content: userMessage }];
  try {
    const messages = [{ role: "system", content: SYSTEM_PROMPT }, ...next];
    const text = await callAI(messages);
    history = [...next, { role: "assistant", content: text }];
    renderAnswer(text);
  } catch (err) {
    renderError(err.message || "Something went wrong.");
  } finally {
    loading = false;
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const topic = topicInput.value.trim();
  if (!topic) return;
  history = [];
  ask(topic, "think");
});

upBtn.addEventListener("click", () => {
  if (loading) return;
  renderThankYou();
});

downBtn.addEventListener("click", () => {
  if (loading || history.length === 0) return;
  ask("SIMPLIFY_FURTHER", "simplify");
});
