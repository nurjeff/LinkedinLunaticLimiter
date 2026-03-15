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

  // Compile regex once
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
    if (containsBlockedWord(text)) {
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