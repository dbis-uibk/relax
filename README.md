# Relax
A relational algebra calculator

## How to build
* Install yarn https://yarnpkg.com/
* Install node https://nodejs.org/en/
* Clone the repo
* Checkout the `development` branch
* Execute `yarn install` to install all dependencies
* Execute `yarn serve` to locally run the webapp on port 8088
* (Optional) open folder with https://code.visualstudio.com/ and install the workspace recommended extensions (includes tasks)

## How to test
Every pull request runs these checks automatically (see `.github/workflows/ci.yml`). To run them locally:

* Execute `yarn typecheck` to check the types
* Use `NODE_OPTIONS=--openssl-legacy-provider yarn build` to create a build in the `dist` folder
* Execute `yarn test` to run the tests of that build in headless Firefox (requires Firefox)

With `yarn serve` running, you can also see the tests at <http://localhost:8088/test.html>.

Alternatively, you can make use of the Visual Studio Code Dev Containers extension to develop inside a Docker container and take advantage of Visual Studio Code's full feature set. A **development container** is a running container with a well-defined tool/runtime stack and its prerequisites.

To get started, follow these steps:

* Install and configure [Docker Desktop](https://www.docker.com/get-started) for your operating system;
* Install [VS Code](https://code.visualstudio.com/) and the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension;
* Clone this repository and open it in VS Code;
* Use the [**Dev Containers: Reopen in Container**](https://code.visualstudio.com/assets/docs/devcontainers/create-dev-container/dev-containers-reopen.png) command from the Command Palette;
* When VS Code restarts, all dependencies will be installed automatically in the dev container. After that you can open a browser window and access the webapp at <http://localhost:8088/>;
* Close the window to stop the container;
* Any change in the files within the container is kept in the existing repository source code on your filesystem so that you can easily push your contributions.

## How to Release
* Open the [Release workflow](https://github.com/dbis-uibk/relax/actions/workflows/release.yml) and select *Run workflow* on the `development` branch (requires write access to the repo)
* Enter a message like `v0.38 Short description`, which becomes the commit message on `gh-pages`
* The workflow runs all checks, publishes the build to the `gh-pages` branch and waits until it is live

To undo a release, revert its commit on the `gh-pages` branch.

## Contributions
* Contributions are **highly appreciated**
* Please create a **pull request** for the **development** branch

### Add a new Language
* Open `src/locales/languages.csv` as csv with e.g. libreoffice (use ',' as delimiter and '"' as string marker)
* Every column represents a language, every row a value
* Create a new column (use the country code as first row/header cell)
* Insert a string for every language key there is (pay attention to {{variables}} as they must stay untouched)
* When finished, execute the script `writeLanguageFiles.py` which generates the json files based on the csv
* In `src/calc2/i18n.tsx` add an import for this file as well as initializing it in the i18n init function (see other languages for examples)
* Add a new dropdown entry to `src/calc2/calculator.entry.tsx` and `src/calc2/calculator.entry.tsx`
* Test your language
* Create a pull request to the development branch

## Features

### Data Sources
There are two ways to provide a group of tables:

* static groups: the groups and tables are loaded from a text file stored on the server
* github gist: the groups and tables are loaded from a github gits via its unique id

In the group's description markdown code can be used but javascript code will be removed for security reasons.

### Static Groups
Static groups are loaded from the file `data/local_groups`.
In this file multiple groups can be declared in the following text format.

A group starts with the group header:
        
        group:sample group
        description:this is the <b>description</b>

Every keyword can be followed by either a colon and a single line of content terminated with a line break or
the content is surrounded with '[[' and ']]' if the content spans multiple lines.
        
        group:sample group
        description[[this is the <b>description</b>
            that spans multiple lines]]

Headers can also be provided for different languages e.g. `description@de:...`.

After the group header the tables are defined using the variable assignment syntax.
The name of the variable is used for the tables name and the assigned RA-expression defines its content.
Every valid RA-expression can be used if the only relations used are defined in that group.
The qualifier of each column is its tables name and is automatically added at runtime.

        group:sample group
        description:this is the <b>description</b>
        
        A = {a, b
            1, 2
            3, 4
        }
        B = {a, c, d
            1, 'test', 1970-01-01
			3, 'test2', null
			42, 'test3', null
        }
        C = A x B


It is also possible to define example queries in both relational algebra and SQL.
These will be automatically loaded into the editor when the group is loaded for the first time.


        group:sample group
        description:this is the <b>description</b>
	    
        exampleSql - {
          Select * from A where a = 1
        }

 	    exampleRelAlg - {
          sigma R.a = 1 R
        }       

        A = {a, b
            1, 2
            3, 4
        }
        B = {a, c, d
            1, 'test', 1970-01-01
			3, 'test2', null
			42, 'test3', null
        }
        C = A x B




### Github Gist

The program can load groups from a gist.
This allows any user to use their own tables and share them with others.

The format to define a group in the gist ist the same format as for the static group definition.

The data can be loaded by adding the git's id to the query string.
If you call the application with the query string `data=gist:ac267b9cc810ac5f20e2`, 
it tries to load additional groups from the gits with the id _ac267b9cc810ac5f20e2_.

So a user could publish a url like `http://example.com/?data=gist:ac267b9cc810ac5f20e2` to share 
the group with other users.

#### Known Issue: Network Access Limitations

Some users have encountered difficulties accessing certain databases on the Relax page when multiple users are connected through the same network (e.g. university network, eduroam) . In these cases, users are restricted to accessing only the test database, while connections to other databases fail.

- GitHub imposes rate limits on requests from the same IP address, common in shared networks like university environments.
- As a result, GitHub may block additional requests from the same IP, restricting database access.

**Solution/Workaround:**
- **Log into GitHub:** Logging into a GitHub account while using Relax can help bypass rate limits by associating requests with individual accounts instead of a shared IP.
- **Access from a Different Network:** Users can also avoid this issue by connecting to Relax from a network outside the university.


## Contributors
* Spanish translation was contributed by https://github.com/Nifled
* Korean translation was contributed by https://github.com/jeongwhanchoi
