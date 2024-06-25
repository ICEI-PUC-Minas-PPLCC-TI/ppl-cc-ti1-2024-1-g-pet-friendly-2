let originalUserName;
let originalUserAge;
let originalUserLocation;

document.getElementById('editButton').addEventListener('click', function() {
  
  originalUserName = document.getElementById('userName').textContent;
  originalUserAge = document.getElementById('userAge').textContent;
  originalUserLocation = document.getElementById('userLocation').textContent;

  const userName = document.getElementById('userName');
  const userAge = document.getElementById('userAge');
  const userLocation = document.getElementById('userLocation');

  userName.innerHTML = `<input type="text" id="userNameInput" value="${userName.textContent}">`;
  userAge.innerHTML = `<input type="text" id="userAgeInput" value="${userAge.textContent}">`;
  userLocation.innerHTML = `<input type="text" id="userLocationInput" value="${userLocation.textContent}">`;

  document.getElementById('editButton').style.display = 'none';
  document.getElementById('saveButton').style.display = 'inline';
  document.getElementById('cancelButton').style.display = 'inline';
});

document.getElementById('saveButton').addEventListener('click', function() {

  const userNameInput = document.getElementById('userNameInput').value;
  const userAgeInput = document.getElementById('userAgeInput').value;
  const userLocationInput = document.getElementById('userLocationInput').value;

  document.getElementById('userName').textContent = userNameInput;
  document.getElementById('userAge').textContent = userAgeInput;
  document.getElementById('userLocation').textContent = userLocationInput;

  document.getElementById('editButton').style.display = 'inline';
  document.getElementById('saveButton').style.display = 'none';
  document.getElementById('cancelButton').style.display = 'none';
});

document.getElementById('cancelButton').addEventListener('click', function() {

  document.getElementById('userName').textContent = originalUserName;
  document.getElementById('userAge').textContent = originalUserAge;
  document.getElementById('userLocation').textContent = originalUserLocation;

  document.getElementById('editButton').style.display = 'inline';
  document.getElementById('saveButton').style.display = 'none';
  document.getElementById('cancelButton').style.display = 'none';
});

