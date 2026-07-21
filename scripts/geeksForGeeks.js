const codeLanguage = {
  C: '.c',
  'C++': '.cpp',
  'C#': '.cs',
  Java: '.java',
  Python: '.py',
  Python3: '.py',
  JavaScript: '.js',
  Javascript: '.js'
};

let successfulSubmissionFlag = true;

const uploadToGitHubRepository = (
  githubAccessToken,
  linkedRepository,
  solution,
  problemTitle,
  uploadFileName,
  sha,
  commitMessage,
  problemDifficulty,
) => {
  const uploadPathURL = `https://api.github.com/repos/${linkedRepository}/contents/${problemDifficulty}/${problemTitle}/${uploadFileName}`;

  let uploadData = {
    message: commitMessage,
    content: solution,
    sha,
  };

  uploadData = JSON.stringify(uploadData);

  const xhttp = new XMLHttpRequest();
  xhttp.addEventListener('readystatechange', function () {
    if (xhttp.readyState === 4) {
      if (xhttp.status === 200 || xhttp.status === 201) {
        const updatedSha = JSON.parse(xhttp.responseText).content.sha;

        chrome.storage.local.get('userStatistics', (statistics) => {
          let { userStatistics } = statistics;
          if (!userStatistics || Object.keys(userStatistics).length === 0) {

            userStatistics = {};
            userStatistics.solved = 0;
            userStatistics.school = 0;
            userStatistics.basic = 0;
            userStatistics.easy = 0;
            userStatistics.medium = 0;
            userStatistics.hard = 0;
            userStatistics.sha = {};

          }
          const githubFilePath = problemTitle + uploadFileName;

          if (uploadFileName === 'README.md' && sha === null) {
            userStatistics.solved += 1;
            userStatistics.school += problemDifficulty === 'School' ? 1 : 0;
            userStatistics.basic += problemDifficulty === 'Basic' ? 1 : 0;
            userStatistics.easy += problemDifficulty === 'Easy' ? 1 : 0;
            userStatistics.medium += problemDifficulty === 'Medium' ? 1 : 0;
            userStatistics.hard += problemDifficulty === 'Hard' ? 1 : 0;
          }
          userStatistics.sha[githubFilePath] = updatedSha;
          chrome.storage.local.set({ userStatistics }, () => {
            console.log(`${uploadFileName} - Commit Successful`,);
          });
        });
      }
    }
  });
  xhttp.open('PUT', uploadPathURL, true);
  xhttp.setRequestHeader('Authorization', `token ${githubAccessToken}`);
  xhttp.setRequestHeader('Accept', 'application/vnd.github.v3+json');
  xhttp.send(uploadData);
};

function uploadGitHub(
  solution,
  problemName,
  uploadFileName,
  commitMessage,
  problemDifficulty = undefined,
) {
  const difficulty = (problemDifficulty || '').trim();

  chrome.storage.local.get('githubAccessToken', (access_token) => {
    const accessToken = access_token.githubAccessToken;
    if (accessToken) {
      chrome.storage.local.get('current_phase', (phase) => {
        const currentPhase = phase.current_phase;
        if (currentPhase === 'solve_and_push') {
          chrome.storage.local.get('github_LinkedRepository', (linkedRepo) => {
            const linkedRepository = linkedRepo.github_LinkedRepository;
            if (linkedRepository) {
              const githubFilePath = problemName + uploadFileName;
              chrome.storage.local.get('userStatistics', (statistics) => {
                const { userStatistics } = statistics;
                let sha = null;

                if (userStatistics !== undefined && userStatistics.sha !== undefined && userStatistics.sha[githubFilePath] !== undefined) {
                  sha = userStatistics.sha[githubFilePath];
                }
                  uploadToGitHubRepository(
                    accessToken,
                    linkedRepository,
                    solution,
                    problemName,
                    uploadFileName,
                    sha,
                    commitMessage,
                    difficulty,
                  );
              });
            }
          });
        }
      });
    }
  });
}

const convertToKebabCase = (uploadFileName) => {
  return uploadFileName.replace(/[^a-zA-Z0-9\. ]/g, '').replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();
};

function getSolutionLanguage() {
  const languageElement = document.getElementsByClassName('divider text')[0];
  if (!languageElement) {
    return null;
  }
  const lang = languageElement.innerText.split('(')[0].trim();
  if (lang.length > 0 && codeLanguage[lang]) {
    return codeLanguage[lang];
  }
  return null;
}

function getProblemTitle() {
  const problemTitleElement = document.querySelector('[class^="problems_header_content__title"] > h3');
  if (problemTitleElement != null) {
    return problemTitleElement.innerText;
  }
  return '';
}

function getProblemDifficulty() {
  const problemDifficultyElement =
    document.querySelectorAll('[class^="problems_header_description"]')[0]
      ?.children[0]?.innerText;

  if (!problemDifficultyElement) {
    return '';
  }

  return problemDifficultyElement
    .replace(/^Difficulty\s*Level\s*:\s*/i, '')
    .replace(/^Difficulty\s*:\s*/i, '')
    .trim();
}

function getProblemStatement() {
  const problemStatementElement = document.querySelector('[class^="problems_problem_content"]');
  return problemStatementElement ? problemStatementElement.outerHTML : '';
}

function getCompanyAndTopicTags(problemStatement) {
  let tagHeading = document.querySelectorAll('.problems_tag_container__kWANg');
  let tagContent = document.querySelectorAll(".content");

  for (let i = 0; i < tagHeading.length; i++) {
    if (tagHeading[i] && tagHeading[i].innerText === 'Company Tags') {
      if (tagContent[i]) {
        tagContent[i].classList.add("active");
        problemStatement = problemStatement.concat("<p><span style=font-size:18px><strong>Company Tags : </strong><br>");
        const container = tagContent[i].childNodes?.[0];
        if (container && container.children) {
          let numOfTags = container.children.length;
          for (let j = 0; j < numOfTags; j++) {
            const tag = container.children[j];
            if (tag && tag.innerText !== null) {
              const company = tag.innerText;
              problemStatement = problemStatement.concat("<code>" + company + "</code>&nbsp;");  
            }
          }
        }
        tagContent[i].classList.remove("active");
      }
    }
    else if (tagHeading[i] && tagHeading[i].innerText === 'Topic Tags') {
      if (tagContent[i]) {
        tagContent[i].classList.add("active");
        problemStatement = problemStatement.concat("<br><p><span style=font-size:18px><strong>Topic Tags : </strong><br>");
        const container = tagContent[i].childNodes?.[0];
        if (container && container.children) {
          let numOfTags = container.children.length;
          for (let j = 0; j < numOfTags; j++) {
            const tag = container.children[j];
            if (tag && tag.innerText !== null) {
              const company = tag.innerText;
              problemStatement = problemStatement.concat("<code>" + company + "</code>&nbsp;");  
            }
          }
        }
        tagContent[i].classList.remove("active");
      }
    }
  }
  return problemStatement;
}

const loader = setInterval(() => {
  let problemTitle = null;
  let problemStatement = null;
  let problemDifficulty = null;
  let solutionLanguage = null;
  let solution = null;

  if (window.location.href.includes('www.geeksforgeeks.org/problems',) || window.location.href.includes('practice.geeksforgeeks.org/problems',)) {

    const gfgSubmitButton = document.querySelector('[class^="ui button problems_submit_button"]');

    gfgSubmitButton?.addEventListener('click', function () {
      document.querySelector('.problems_header_menu__items__BUrou')?.click();
      successfulSubmissionFlag = true;

      const submissionLoader = setInterval(() => {
        const submissionResultElement = document.querySelectorAll('[class^="problems_content"]')[0];
        const submissionResult = submissionResultElement ? submissionResultElement.innerText : '';
        if (submissionResult.includes('Problem Solved Successfully') && successfulSubmissionFlag) {
          successfulSubmissionFlag = false;
          clearInterval(loader);
          clearInterval(submissionLoader);
          document.querySelector('.problems_header_menu__items__BUrou')?.click();
          problemTitle = getProblemTitle().trim();
          problemDifficulty = getProblemDifficulty();
          problemStatement = getProblemStatement();
          solutionLanguage = getSolutionLanguage();
          console.log("Initialised Upload Variables");

          const probName = problemTitle;
          const questionUrl = window.location.href;
          problemStatement = `<h2><a href="${questionUrl}">${problemTitle}</a></h2><h3>${problemDifficulty}</h3><hr>${problemStatement}`;
          problemStatement = getCompanyAndTopicTags(problemStatement);

          if (solutionLanguage !== null) {
            chrome.storage.local.get('userStatistics', (statistics) => {
              const { userStatistics } = statistics;
              const githubFilePath = probName + convertToKebabCase(problemTitle + solutionLanguage);
              let sha = null;
              if (
                userStatistics !== undefined &&
                userStatistics.sha !== undefined &&
                userStatistics.sha[githubFilePath] !== undefined
              ) {
                sha = userStatistics.sha[githubFilePath];
              }
              if (sha === null) {
                uploadGitHub(
                  btoa(unescape(encodeURIComponent(problemStatement))),
                  probName,
                  'README.md',
                  `Added README.md for ${probName} - GfG to GitHub`,
                  problemDifficulty,
                );
              }

              chrome.runtime.sendMessage({ type: 'getUserSolution' }, function (res) {

                console.log("getUserSolution - Message Sent.");
                setTimeout(function () {
                  solution = document.getElementById('extractedUserSolution').innerText;
                  if (solution !== '') {
                    setTimeout(function () {
                      if (sha === null) {
                        uploadGitHub(
                          btoa(unescape(encodeURIComponent(solution))),
                          probName,
                          convertToKebabCase(problemTitle + solutionLanguage),
                          `Added Solution for ${probName} - GfG to GitHub`,
                          problemDifficulty,
                        );
                      }
                      else {
                        uploadGitHub(
                          btoa(unescape(encodeURIComponent(solution))),
                          probName,
                          convertToKebabCase(problemTitle + solutionLanguage),
                          `Updated Solution for ${probName} - GfG to GitHub`,
                          problemDifficulty,
                        );
                      }
                    }, 1000);
                  }
                }, 1000);
                chrome.runtime.sendMessage({ type:'deleteNode'}, function() {
                  console.log("deleteNode - Message Sent.");
                });
              });
            });
          }
        } 
        
        else if (submissionResult.includes('Compilation Error')) {
          clearInterval(submissionLoader);
        } 
        
        else if (!successfulSubmissionFlag && (submissionResult.includes('Compilation Error') || submissionResult.includes('Correct Answer'))) {
          clearInterval(submissionLoader);
        }
      }, 1000);
    });
  }
}, 1000);