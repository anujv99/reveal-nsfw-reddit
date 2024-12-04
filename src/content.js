const extensionName = "reveal_nsfw_content";

const log = (...args) => {
  console.log(`[${extensionName}]:`, ...args);
};

const revealNsfwContent = () => {
  const blocker = document.querySelectorAll(
    "[bundlename='desktop_rpl_nsfw_blocking_modal']",
  );

  blocker.forEach((element) => {
    element.remove();

    log("removing nsfw blocking element:", element);
  });
};

const revealNsfwImages = () => {
  // posts on right bar
  const rightRailPosts = document.querySelectorAll(
    "[reddit-pdp-right-rail-post]",
  );

  rightRailPosts.forEach((element) => {
    const nsfwIcon = element.querySelectorAll("[icon-name='nsfw-fill']");

    (nsfwIcon || []).forEach((icon) => {
      icon?.parentNode?.parentNode?.remove();
    });
  });

  // posts on feed
  const feedPostsBlurred = document.querySelectorAll(
    "shreddit-blurred-container[reason='nsfw']",
  );

  feedPostsBlurred.forEach((element) => {
    const shadow = element.shadowRoot;
    if (!shadow) return;

    if (shadow.children.length) shadow.children[0].remove();
    const slot = document.createElement("slot");
    slot.name = "revealed";

    shadow.appendChild(slot);
  });
};

revealNsfwContent();
revealNsfwImages();

// temp
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.removedNodes.length) {
      log("mutation removed nodes:", mutation.removedNodes);
    }
  });
});

observer.observe(document.getElementsByTagName("shreddit-app")[0], {
  childList: true,
  subtree: true,
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  log("received message:", request, sender, sendResponse);
  if (request.message === "tab-updated" && sender.id === chrome.runtime.id) {
    revealNsfwContent();
  }
});
