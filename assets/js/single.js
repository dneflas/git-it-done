var issuesContainerEl = document.querySelector("#issue-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");


var getRepoName = function() {
    // grab repo name from url query string
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];

    if (repoName) {
        // get repo issues and display repo nam on the page
        getRepoIssues(repoName);
        repoNameEl.textContent = repoName;
    } else {
        // if not repo was given, redirect to the homepage
        document.location.replace("./index.html");
    }
};

var getRepoIssues = function(repo){
    // format the githun api url
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    // make a get request to url
    fetch(apiUrl).then(function(response){
        //request was successful
        if(response.ok){
            response.json().then(function(data){
                displayIssues(data);

                // check is api has paginated issues
                if (response.headers.get("link")) {
                    displayWarning(repo);
                };
            });
        } else {
            // if not successful, redirect to homepage
            document.location.replace("./index.html");
        }
    });
};

var displayIssues = function(issues) {
    if (issues.length === 0) {
        issuesContainerEl.textContent = "This repo has no open issues!";
        return;
    };

    // loop over given issues
    for (var i =0; i < issues.length; i++) {
        // create a link element to take users to the issues on GitHub
        var issuesEl = document.createElement("a");
        issuesEl.classList = "list-item flex-row justify-space-between align-center";
        issuesEl.setAttribute("href", issues[i].html_url);
        issuesEl.setAttribute("target", "_blank");

        // create span to hold the issues title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container
        issuesEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check if issues is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }

        // append to container
        issuesEl.appendChild(typeEl);

        // append to dom
        issuesContainerEl.appendChild(issuesEl);
    }
};

var displayWarning = function(repo) {
    // add text warning to container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    // create link element
    var linkEl = document.createElement("a");
    linkEl.textContent = "GitHub.com"
    linkEl.setAttribute("href", "https://github.com/" + repo +"/issues")
    linkEl.setAttribute("target", "_blank");

    // append to warning container
    limitWarningEl.appendChild(linkEl);
};

getRepoName();
