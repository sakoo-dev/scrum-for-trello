chrome.runtime.onMessage.addListener((request) => {
  if (request.message === 'LOADED') {
    showStoryPoints();
    calculateStoryPoints();
    observeCardChanges();
  }
});

function showStoryPoints() {
  document.querySelectorAll("[data-testid='card-name']").forEach((titleElement) => {
    const title = titleElement.text;
    const regex = /^(\(([0-9]*[.])?[0-9]+\))\s(.+)$/g;
    const found = regex.exec(title);

    if (found === null) {
      return;
    }

    const storyPoint = found[1].replace('(', '').replace(')', '');
    titleElement.innerHTML = title.replace(regex, `<span style="color: white; font-weight: bold; cursor: pointer; background-color: rgb(0, 101, 128) !important; font-size: 12px !important; border-radius: 4px; padding: 2px 4px !important">💡<span data-testid="trello-card-story-point">${storyPoint}</span></span> $3`);
  });
}

function calculateStoryPoints() {
  document.querySelectorAll("[data-testid='list']").forEach((listElement) => {
    let sum = 0;
    const header = listElement.querySelector("[data-testid='list-name']");
    
    listElement.querySelectorAll("[data-testid='trello-card-story-point']").forEach((storyPointElement) => {
      const storyPoint = parseFloat(storyPointElement.textContent);
      
      if (!isNaN(storyPoint)) {
        sum += storyPoint;
      }
      
    });
    
    let sumStoryPointsElement = header.querySelector('[data-testid="trello-list-story-point"]');
    
    if (sumStoryPointsElement !== null) {
      sumStoryPointsElement.remove();
    }

    const headerText = header.innerHTML;
    header.innerHTML = `<span data-testid="trello-list-story-point" style="color: rgb(0, 101, 128) !important; font-weight: bold">${sum}</span> ${headerText}`;
  
  });
}


function observeCardChanges() {
  
  const boardContainer = document.getElementById('board');
  
  if (!boardContainer) {
    return;
  }

  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          
          if (node.matches && node.matches("[data-testid='list-card']")) {
            showStoryPoints();
            calculateStoryPoints();
          }

          if (node.parentNode && node.parentNode.getAttribute('data-testid') === 'card-name') {
            showStoryPoints();
            calculateStoryPoints();
          }

        });
      }
    });
  }).observe(boardContainer, { childList: true, subtree: true });
}