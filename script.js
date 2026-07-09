// Get all needed DOM element
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeList = document.getElementById("attendeeList");
const displayMessage = document.getElementById("greeting");

// Track attendance
const maxCount = 50;
const storageKey = "intelEventAttendance";

let attendanceData = loadAttendanceData();

function loadAttendanceData() {
  const savedAttendance = localStorage.getItem(storageKey);

  if (savedAttendance) {
    try {
      const parsedAttendance = JSON.parse(savedAttendance);

      return {
        count: parsedAttendance.count || 0,
        teams: {
          water:
            parsedAttendance.teams && parsedAttendance.teams.water
              ? parsedAttendance.teams.water
              : 0,
          zero:
            parsedAttendance.teams && parsedAttendance.teams.zero
              ? parsedAttendance.teams.zero
              : 0,
          power:
            parsedAttendance.teams && parsedAttendance.teams.power
              ? parsedAttendance.teams.power
              : 0,
        },
        attendees: Array.isArray(parsedAttendance.attendees)
          ? parsedAttendance.attendees
          : [],
      };
    } catch (error) {
      console.log("Could not load saved attendance data.", error);
    }
  }

  return {
    count: 0,
    teams: {
      water: 0,
      zero: 0,
      power: 0,
    },
    attendees: [],
  };
}

function saveAttendanceData() {
  localStorage.setItem(storageKey, JSON.stringify(attendanceData));
}

function updateAttendanceDisplay() {
  const attendeeCount = document.getElementById("attendeeCount");
  attendeeCount.textContent = attendanceData.count;

  const percentage = Math.round((attendanceData.count / maxCount) * 100) + "%";
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = percentage;

  document.getElementById("waterCount").textContent =
    attendanceData.teams.water;
  document.getElementById("zeroCount").textContent = attendanceData.teams.zero;
  document.getElementById("powerCount").textContent =
    attendanceData.teams.power;

  if (attendeeList) {
    attendeeList.innerHTML = "";

    if (attendanceData.attendees.length === 0) {
      attendeeList.innerHTML =
        '<li class="attendee-empty">No attendees checked in yet.</li>';
      return;
    }

    attendanceData.attendees.forEach(function (attendee) {
      const attendeeItem = document.createElement("li");
      attendeeItem.className = `attendee-item ${attendee.team}`;
      attendeeItem.innerHTML = `<span class="attendee-name">${attendee.name}</span><span class="attendee-team ${attendee.team}">${attendee.teamName}</span>`;
      attendeeList.appendChild(attendeeItem);
    });
  }
}

function showCelebrationMessage() {
  const teamCounts = [
    { name: "Team Water Wise", count: attendanceData.teams.water },
    { name: "Team Net Zero", count: attendanceData.teams.zero },
    { name: "Team Renewables", count: attendanceData.teams.power },
  ];

  let winningTeam = teamCounts[0];

  for (let index = 1; index < teamCounts.length; index++) {
    if (teamCounts[index].count > winningTeam.count) {
      winningTeam = teamCounts[index];
    }
  }

  return `🎉 Goal reached! <strong>${winningTeam.name}</strong> is the winning team with ${winningTeam.count} check-ins!`;
}

updateAttendanceDisplay();

if (attendanceData.count >= maxCount) {
  displayMessage.innerHTML = showCelebrationMessage();
  displayMessage.style.display = "block";
  displayMessage.className = "success-message";
}

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get form values
  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].textContent;

  console.log(name, teamName);

  // Increment count
  attendanceData.count++;
  attendanceData.teams[team]++;
  attendanceData.attendees.push({
    name: name,
    team: team,
    teamName: teamName,
  });
  saveAttendanceData();
  console.log("total check-in: ", attendanceData.count);

  updateAttendanceDisplay();

  // Show welcome message or celebration message
  let message = `🎉 Welcome, ${name} from ${teamName}`;

  if (attendanceData.count >= maxCount) {
    message = showCelebrationMessage();
  }

  console.log(message);

  displayMessage.innerHTML = message;
  displayMessage.style.display = "block";

  if (attendanceData.count >= maxCount) {
    displayMessage.className = "success-message";
  } else {
    displayMessage.className = "";
  }

  form.reset();
});
