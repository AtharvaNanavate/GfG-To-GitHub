let begin = false;

chrome.storage.local.get(['darkmodeFlag'], function (darkmode_flag) {
  console.log(darkmode_flag.darkmodeFlag);
  if (darkmode_flag.darkmodeFlag === 1) {
    window.onload = function() {
      $('#darkmode-toggle').click();
    }
  }
});

$('#authentication_button').on('click', () => {
  if (begin) {
    startGitHubOAuthProcess.githubOAuth();
  }
});

$('#index_URL').attr(
  'href', chrome.runtime.getURL('index.html')
);

$('#link_repo_redirect').attr(
  'href', chrome.runtime.getURL('index.html')
);

chrome.storage.local.get('githubAccessToken', (responseToken) => {
  const accessToken = responseToken.githubAccessToken;
  if (accessToken === null || accessToken === undefined) {
    begin = true;
    $('#authentication_phase').attr('style', 'display:inherit;');
  }
  else {
    const gitHubAPI_authURL = 'https://api.github.com/user';

    const xhttp = new XMLHttpRequest();
    xhttp.addEventListener('readystatechange', function () {
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
          chrome.storage.local.get('current_phase', (phase) => {
            if (phase && phase.current_phase === 'solve_and_push') {
              $('#solve_and_push_phase').attr('style', 'display:inherit;');
              chrome.storage.local.get(
                ['userStatistics', 'github_LinkedRepository'],
                (userStats) => {
                  const { userStatistics } = userStats;
                  if (userStatistics && userStatistics.solved) {
                    $('#successful_submissions').text(userStatistics.solved);
                    $('#successful_submissions_school').text(userStatistics.school);
                    $('#successful_submissions_basic').text(userStatistics.basic);
                    $('#successful_submissions_easy').text(userStatistics.easy);
                    $('#successful_submissions_medium').text(userStatistics.medium);
                    $('#successful_submissions_hard').text(userStatistics.hard);
                  }
                  const gitHubLinkedRepository = userStats.github_LinkedRepository;
                  if (gitHubLinkedRepository) {
                    $('#repository_link').html(`<a target="blank" style="color: #104a8e !important; font-size:0.8em;" href="https://github.com/${gitHubLinkedRepository}">${gitHubLinkedRepository}</a>`,);
                  }
                },
              );
            }
            else {
              $('#link_repo_phase').attr('style', 'display:inherit;');
            }
          });
        }
        else if (xhttp.status === 401) {
          chrome.storage.local.set({ githubAccessToken: null }, () => {
            console.log('Something went wrong during authentication. Please try again after some time!',);
            begin = true;
            $('#authentication_phase').attr('style', 'display:inherit;');
          });
        }
      }
    });
    xhttp.open('GET', gitHubAPI_authURL, true);
    xhttp.setRequestHeader('Authorization', `token ${accessToken}`);
    xhttp.send();
  }
});