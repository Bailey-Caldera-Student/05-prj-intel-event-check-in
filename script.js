// Get all needed DOM element
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeList = document.getElementById("attendeeList");
const displayMessage = document.getElementById("greeting");

// Track attendance
let count = 0;
const maxCount = 50;

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get form values
  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].textContent;

  console.log(name, teamName);

  // Increment count
  count++;
  console.log("total check-in: ", count);

  // Update attendee count
  const attendeeCount = document.getElementById("attendeeCount");
  attendeeCount.textContent = count;

  // Update progress bar
  const percentage = Math.round((count / maxCount) * 100) + "%";
  console.log(`Progress: ${percentage}`);

  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = percentage;

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  // Show welcome message or celebration message
  let message = `🎉 Welcome, ${name} from ${teamName}`;

  if (count >= maxCount) {
    const waterCount = parseInt(
      document.getElementById("waterCount").textContent,
    );
    const zeroCount = parseInt(
      document.getElementById("zeroCount").textContent,
    );
    const powerCount = parseInt(
      document.getElementById("powerCount").textContent,
    );

    const teamCounts = [
      { name: "Team Water Wise", count: waterCount },
      { name: "Team Net Zero", count: zeroCount },
      { name: "Team Renewables", count: powerCount },
    ];

    let winningTeam = teamCounts[0];

    for (let index = 1; index < teamCounts.length; index++) {
      if (teamCounts[index].count > winningTeam.count) {
        winningTeam = teamCounts[index];
      }
    }

    message = `🎉 Goal reached! <strong>${winningTeam.name}</strong> is the winning team with ${winningTeam.count} check-ins!`;
  }

  console.log(message);

  displayMessage.innerHTML = message;
  displayMessage.style.display = "block";

  if (count >= maxCount) {
    displayMessage.className = "success-message";
  } else {
    displayMessage.className = "";
  }

  // Attendee list
  if (attendeeList) {
    const emptyMessage = attendeeList.querySelector(".attendee-empty");

    if (emptyMessage) {
      attendeeList.removeChild(emptyMessage);
    }

    const attendeeItem = document.createElement("li");
    attendeeItem.className = `attendee-item ${team}`;
    attendeeItem.innerHTML = `<span class="attendee-name">${name}</span><span class="attendee-team ${team}">${teamName}</span>`;
    attendeeList.appendChild(attendeeItem);
  }

  form.reset();
});
