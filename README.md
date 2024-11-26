# Group05-5iveBit

This is the GitLab repository of 5iveBit. This company is a part of our TU Chemnitz MSc Web Engineering Planspiel module (2024-25) and not a real company.

Disclaimer: 5iveBit and its website, products, services, and applications are fictional, created for a university project. This simulation is not a real company, and any resemblance to actual entities is coincidental.

### Group Members:
Amey Rajesh Shaligram (803847)
| GitHub: [ameysh](https://github.com/ameysh)

Ashlyn Higgins (791812) | GitHub: [ashlynth](https://github.com/ashlynth)

Neel Sudhir Koshti (801418) | GitHub: [koshtineel247](https://github.com/koshtineel247)

Saleem Sultani (801632) | GitHub: [saleemsultani](https://github.com/saleemsultani)

Somayeh Rasoli (671776) | GitHub: [CelineRasoli](https://github.com/CelineRasoli)

# Repository Structure:

`/website` : This directory contains code for the Group05-5iveBit's company website.

`/app` : This directory contains code for the Group05-5iveBit's AI Application.

Future directories or files that are not strictly specific to the website or the app will also go here.

# Branches:
We maintain a branching structure to ensure stability and streamline collaboration. Below are the types of branches used in our repository:

1. **main**: The main branch contains the most stable and thoroughly tested version of our code. We aim for this branch to be production-ready and only update it with changes that have been verified in other branches.

2. **development**: The development branch serves as the integration branch for all features and updates. We merge our feature branches into development for testing and staging. Once all changes in development are verified and stable, they are merged into main.

    > Important note: Merge Requests and commits should go to **development** instead of **main** by default. For this reason, our default branch is set to **development** in GitLab settings. Please review the **main** branch for the final versions of the code.

3. **feature**: Feature branches are used to work on new functionality or changes. Each feature branch is specific to a task or issue, allowing us to work in parallel without conflicts.

We follow a certain naming convention to maintain consistency and clarity.

For website features:

`site-feature-developername-featuredescription`

For application features:

`app-feature-developername-featuredescription`

# Merge Requests
We use Merge Requests to review and merge feature branches into the development branch. A Merge Request should always be created once the work for a feature is complete and ready for review. If a Merge Request is relevant to a specific Issue, it is linked to that Issue using its number.

# Issues
Issues are used to track bugs, feature requests, or improvements. They also indicate if they are related to the website or the app. If an Issue is fixed and closed, then it is linked to the relevant Merge Request using its number.

*This file will be continuously updated as the project progresses.*