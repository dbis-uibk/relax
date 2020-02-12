# Relax
A relational algebra calculator

## How to build
* install yarn https://yarnpkg.com/
* install node https://nodejs.org/en/
* clone the repo
* open folder with https://code.visualstudio.com/ and install the workspace recommended extensions

## Contributions
* Contributions are **highly appreciated**
* Please create a **pull request** for the **development** branch
* To add a new language, just copy an existing file in `src/locales` e.g. `src/locales/en.ts` and rewrite the phrases

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

### Github Gist

The program can load groups from a gist.
This allows any user to use their own tables and share them with others.

The format to define a group in the gist ist the same format as for the static group definition.

The data can be loaded by adding the git's id to the query string.
If you call the application with the query string `data=gist:ac267b9cc810ac5f20e2`, 
it tries to load additional groups from the gits with the id _ac267b9cc810ac5f20e2_.

So a user could publish a url like `http://example.com/?data=gist:ac267b9cc810ac5f20e2` to share 
the group with other users.



## Contributors
* Spanish translation was contributed by https://github.com/Nifled
* Korean translation was contributed by https://github.com/jeongwhanchoi
