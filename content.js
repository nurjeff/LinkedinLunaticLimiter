(() => {
  const WORDS = [
    "ai",
    "ki",
    "mcp",
    "claude",
    "openai",
    "chatgpt",
    "bard",
    "gemini",
    "llama",
    "falcon",
    "mistral"
  ];

  const PATTERNS = WORDS.map(word => new RegExp(`\\b${word}\\b`, "i"));

  function normalizeText(text) {
    return (text || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function containsBlockedWord(text) {
    const normalized = normalizeText(text);
    return PATTERNS.some(regex => regex.test(normalized));
  }

  // this hides BS rule of three which ai written posts constantly use
  function containsRepeatedNoStyle(text) {
    const normalized = normalizeText(text);

    const parts = normalized
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(Boolean);

    if (parts.length < 3) return false;

    let streak = 0;

    for (const part of parts) {
      if (/^(no|kein|keine|keinen|keinem|keiner)\b/i.test(part)) {
        streak++;
        if (streak >= 3) return true;
      } else {
        streak = 0;
      }
    }

    return false;
  }

  function shouldHidePost(text) {
    return containsBlockedWord(text) || containsRepeatedNoStyle(text);
  }

  function getPostText(post) {
    return normalizeText(post.innerText || post.textContent || "");
  }

  function hidePost(post) {
    if (post.dataset.filtered === "true") return;
    post.dataset.filtered = "true";
    post.style.display = "none";
  }

  function processPost(post) {
    const text = getPostText(post);
    if (shouldHidePost(text)) {
      hidePost(post);
    }
  }

  function scanPosts(root = document) {
    const posts = root.querySelectorAll("div.feed-shared-update-v2, div[data-urn]");
    posts.forEach(processPost);
  }

  scanPosts();

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        if (node.matches?.("div.feed-shared-update-v2, div[data-urn]")) {
          processPost(node);
        } else {
          scanPosts(node);
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();