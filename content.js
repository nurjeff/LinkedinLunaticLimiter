(() => {
  const WORDS = [
    "ai",
    "ki",
    "mcp",
    "claude",
    "claw",
    "openai",
    "openclaw",
    "chatgpt",
    "bard",
    "gemini",
    "llama",
    "falcon",
    "mistral"
  ];

  const PATTERNS = WORDS.map(
    word => new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i")
  );

  function normalizeText(text) {
    return (text || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function containsBlockedWord(text) {
    return PATTERNS.some(regex => regex.test(text || ""));
  }

  function containsRepeatedNoStyle(text) {
    const normalized = normalizeText(text);

    const repeatedPattern =
      /\b(?:no|kein|keine|keinen|keinem|keiner)\b[\s\S]{0,250}\b(?:no|kein|keine|keinen|keinem|keiner)\b[\s\S]{0,250}\b(?:no|kein|keine|keinen|keinem|keiner)\b/i;

    return repeatedPattern.test(normalized);
  }

  function shouldHidePost(text) {
    return containsBlockedWord(text) || containsRepeatedNoStyle(text);
  }

  function getPostText(post) {
    return post.innerText || post.textContent || "";
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