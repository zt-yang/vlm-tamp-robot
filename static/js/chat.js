// Mapping of selection keys to names
const problemNameMapping = {
  problem1: 'Make Chicken Soup'
};
const modelNameMapping = {
  modelA: 'gpt-4o-mini'
};
const modeNameMapping = {
  modeA: 'Subgoals',
  modeB: 'Actions'
};
const robotNameMapping = {
  robotA: 'Dual-Arm PR2',
  robotB: 'Single-Arm PR2',
};
const envNameMapping = {
  envA: 'Open Spaces',
  envB: 'More Obstacles'
};

// Data for different models and problems including text and images
const chatData = {
  modelA: {  // gpt-4o-mini

    modeA: {  // subgoals
      robotA: {  // dual-arm PR2
        envA: {  // v0
          problem1: [
          ]
        },
        envB: {  // v1
          problem1: [
          ]
        }
      },
      robotB: {
        envA: {
          problem1: [
          ]
        },
        envB: {
          problem1: [
          ]
        }
      }
    },

    modeB: {  // actions
      robotA: {  // dual-arm PR2
        envA: {  // v0
          problem1: [
            { from: 'agent2', responseID: '1', image: 'query_0.png' },
            { from: 'agent1', responseID: '2' },
            { from: 'agent2', responseID: '3' },
            { from: 'agent1', responseID: '4' },
            { from: 'agent2', responseID: '5' },

            { from: 'agent2', responseID: '6', image: 'query_6.png' },
            { from: 'agent1', responseID: '7' },
            { from: 'agent2', responseID: '8' },
            { from: 'agent1', responseID: '9' },
            { from: 'agent2', responseID: '10' },
          ]
        },
        envB: {  // v1
          problem1: [
          ]
        }
      },
      robotB: {
        envA: {
          problem1: [
          ]
        },
        envB: {
          problem1: [
          ]
        }
      }
    },

  }
};

// Function to find and list all valid problem-model combinations with non-empty messages
function listNonEmptyCombinations() {
  let combinations = [];

  for (let model in chatData) {
    for (let mode in chatData[model]) {
      for (let robot in chatData[model][mode]) {
        for (let env in chatData[model][mode][robot]) {
          for (let problem in chatData[model][mode][robot][env]) {
            const messages = chatData[model][mode][robot][env][problem];
            if (messages && messages.length > 0) {
              const problemName = problemNameMapping[problem] || 'Unknown Problem';
              const modelName = modelNameMapping[model] || 'Unknown Model';
              const modeName = modeNameMapping[mode] || 'Unknown Mode';
              const robotName = robotNameMapping[robot] || 'Unknown Robot';
              const envName = envNameMapping[env] || 'Unknown Env';
              // combinations.push(`[Problem = ${problemName}, Model = ${modelName}, Mode = ${modeName}, Robot = ${robotName}, Env = ${envName}]`);
              combinations.push(`[
                <span class="sidenote">${problemName}, ${modelName}, ${modeName}, ${robotName}, ${envName}</span>
                ]`);
            }
          }
        }
      }
    }
  }

  return combinations;
}

// Function to attach event listeners to expand-toggle spans
function attachExpandListeners() {
  document.querySelectorAll('.expand-toggle-1').forEach(function(toggle) {
    toggle.addEventListener('click', function() {
      // Find the closest .message container and then find the .hidden-text within it
      const messageContainer = this.closest('.message');
      const hiddenText = messageContainer.querySelector('.hidden-text-1');

      // Ensure the hiddenText element exists before trying to toggle
      if (hiddenText) {
        if (hiddenText.classList.contains('expanded')) {
          hiddenText.classList.remove('expanded');
          hiddenText.style.display = 'none';  // Hide the content
          this.textContent = '[expand]';      // Change text back to "expand"
        } else {
          hiddenText.classList.add('expanded');
          hiddenText.style.display = 'block'; // Show the content
          this.textContent = '[collapse]';    // Change text to "collapse"
        }
      }
    });
  });
  document.querySelectorAll('.expand-toggle-2').forEach(function(toggle) {
    toggle.addEventListener('click', function() {
      // Find the closest .message container and then find the .hidden-text within it
      const messageContainer = this.closest('.message');
      const hiddenText = messageContainer.querySelector('.hidden-text-2');

      // Ensure the hiddenText element exists before trying to toggle
      if (hiddenText) {
        if (hiddenText.classList.contains('expanded')) {
          hiddenText.classList.remove('expanded');
          hiddenText.style.display = 'none';  // Hide the content
          this.textContent = '[expand]';      // Change text back to "expand"
        } else {
          hiddenText.classList.add('expanded');
          hiddenText.style.display = 'block'; // Show the content
          this.textContent = '[collapse]';    // Change text to "collapse"
        }
      }
    });
  });
}

// Function to fetch the content of a text file from the correct directory based on model and problem
function fetchTextContent(problem, model, mode, robot, env, agent, responseID) {
  const filePath = `chats/${problem}_${model}_${mode}_${robot}_${env}/${responseID}_${agent}.html`;
  return fetch(filePath)
    .then(response => response.text())
    .then(content => {
      return content; // Return the fetched content
    })
    .catch(error => `Error loading response: ${error}`);
}

// Function to display chat based on selected model and problem
async function loadChatContent(problem, model, mode, robot, env) {
  const chatContent = document.getElementById('chat-content');
  chatContent.innerHTML = '';  // Clear existing content

  const messages = chatData[model][mode][robot][env][problem];

  // If messages are empty, show the available options
  if (!messages || messages.length === 0) {
    const problemName = problemNameMapping[problem] || 'Unknown Problem';
    const modelName = modelNameMapping[model] || 'Unknown Model';
    const modeName = modeNameMapping[mode] || 'Unknown Mode';
    const robotName = robotNameMapping[robot] || 'Unknown Robot';
    const envName = envNameMapping[env] || 'Unknown Env';

    // Create a message div to show available options
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'from-agent2');

    // Get all non-empty problem-model combinations
    const availableCombinations = listNonEmptyCombinations();

    // Create the message content listing the available options
    const messageContent = `<p>No conversation found for option <br>[
    <span class="sidenote">${problemName}, ${modelName}, ${modeName}, ${robotName}, ${envName}</span>
    ]</p>
                            <p><br>Here are the available options:</p>
                            <ul>${availableCombinations.map(combo => `<li>${combo}</li>`).join('')}</ul>`;

    messageDiv.innerHTML = messageContent;
    messageDiv.style.maxWidth = '100%';
    messageDiv.style.fontSize = '16px';

    chatContent.appendChild(messageDiv);
    return;  // Exit if no messages are found
  }

  // If messages are available, proceed with fetching and displaying them
  for (const msg of messages) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `from-${msg.from}`);
    messageDiv.id = `message-${msg.responseID}`;

    // Fetch message text from the corresponding text file in the subdirectory
    const messageText = await fetchTextContent(problem, model, mode, robot, env, msg.from, msg.responseID);

    // Add message text to the message div
    messageDiv.innerHTML = messageText; // `<p>${messageText}</p>`;
    
    // If there's an image in the message, add it
    if (msg.image) {
      const imageElement = document.createElement('img');
      imageElement.src = `chats/${problem}_${model}_${mode}_${robot}_${env}/${msg.image}`;
      imageElement.alt = 'Chat Image';
      imageElement.style.maxWidth = '60%';
      imageElement.style.borderRadius = '8px';
      // messageDiv.appendChild(imageElement);
      messageDiv.insertBefore(imageElement, messageDiv.firstChild);
    }

    chatContent.appendChild(messageDiv);
  }

  // // Scroll to the bottom of the chat
  // chatContent.scrollTop = chatContent.scrollHeight;
  // Scroll to the top of the chat window when content is loaded
  chatContent.scrollTop = 0;
  attachExpandListeners();
}

// Update the event listener to handle menu item selection
document.querySelectorAll('.sidebar .problem-section').forEach(item => {
  item.addEventListener('click', () => {
    // Remove 'selected' class from all sections
    document.querySelectorAll('.sidebar .problem-section').forEach(section => section.classList.remove('selected'));
    
    // Add 'selected' class to the clicked section
    item.classList.add('selected');
    
    const problem = item.getAttribute('data-content');
    const model = document.getElementById('model-select').value;  // Get selected model
    const mode = document.getElementById('mode-select').value;  // Get selected mode
    const robot = document.getElementById('robot-select').value;  // Get selected robot
    const env = document.getElementById('env-select').value;  // Get selected env
    loadChatContent(problem, model, mode, robot, env);
  });
});

// Add event listener to the model dropdown
document.getElementById('model-select').addEventListener('change', () => {
  const problem = document.querySelector('.sidebar .problem-section[data-content="problem1"]').getAttribute('data-content');  // Default problem
  const model = document.getElementById('model-select').value;  // Get selected model
  const mode = document.getElementById('mode-select').value;  // Get selected mode
  const robot = document.getElementById('robot-select').value;  // Get selected robot
  const env = document.getElementById('env-select').value;  // Get selected env
  loadChatContent(problem, model, mode, robot, env);
});

// Add event listener to the mode dropdown
document.getElementById('mode-select').addEventListener('change', () => {
  const problem = document.querySelector('.sidebar .problem-section[data-content="problem1"]').getAttribute('data-content');  // Default problem
  const model = document.getElementById('model-select').value;  // Get selected model
  const mode = document.getElementById('mode-select').value;  // Get selected mode
  const robot = document.getElementById('robot-select').value;  // Get selected robot
  const env = document.getElementById('env-select').value;  // Get selected env
  loadChatContent(problem, model, mode, robot, env);
});

// Add event listener to the robot dropdown
document.getElementById('robot-select').addEventListener('change', () => {
  const problem = document.querySelector('.sidebar .problem-section[data-content="problem1"]').getAttribute('data-content');  // Default problem
  const model = document.getElementById('model-select').value;  // Get selected model
  const mode = document.getElementById('mode-select').value;  // Get selected mode
  const robot = document.getElementById('robot-select').value;  // Get selected robot
  const env = document.getElementById('env-select').value;  // Get selected env
  loadChatContent(problem, model, mode, robot, env);
});

// Add event listener to the env dropdown
document.getElementById('env-select').addEventListener('change', () => {
  const problem = document.querySelector('.sidebar .problem-section[data-content="problem1"]').getAttribute('data-content');  // Default problem
  const model = document.getElementById('model-select').value;  // Get selected model
  const mode = document.getElementById('mode-select').value;  // Get selected mode
  const robot = document.getElementById('robot-select').value;  // Get selected robot
  const env = document.getElementById('env-select').value;  // Get selected env
  loadChatContent(problem, model, mode, robot, env);
});

// On page load, set the first problem as selected and load its content
window.onload = function() {
  const firstProblem = document.querySelector('.sidebar .problem-section[data-content="problem1"]');
  
  // Set the first problem as selected
  firstProblem.classList.add('selected');
  
  // Load the default chat content for Model A and Problem 1
  loadChatContent('problem1', 'modelA', 'modeB', 'robotA', 'envA');
};
