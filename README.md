# relational algebra calculator

This is the current development version of the project.

It is a port of the old application written in 2015.
The old application was written in plain es5 and jQuery.
The new port tries to unravel the old structure by using typescript and react.

There is still some old/undocumented old code left within the components.

## TODOs

[ ] cross browser build+tests (>= ie11?)
[ ] port the into tour
[ ] date picker for toolbar
[ ] import via sql-dump
[ ] document publish workflow
[ ] error html in messages is broken
[ ] fix unit-tests
[ ] update _handsontable_ to the new react wrapper
[ ] split bundle to reduce loading time
[ ] statically compiled landing and help page?

### *Possible* future extensions
* generate datasets via <http://www.mockaroo.com/> or <http://www.generatedata.com/> ?
* extensions that would/could be useful in teaching:
    * restrict set of usable operators for a group
    * restrict language/mode for a group
    * get insight about how the result is calculated
    * provide exercises/instructions for a group

## development

* install yarn https://yarnpkg.com/
* install node https://nodejs.org/en/
* clone the repo
* open folder with https://code.visualstudio.com/ and install the workspace recommended extensions

### run the application locally
* execute `yarn install`
* execute `yarn serve`
* open http://127.0.0.1:8088 in browser

## relax-core

see `src/db/README.md`

## Font
FreeSansMinimal contains all glyphs for the relational algebra.
The glyphs are from FreeSans, FreeSerif and FreeMono.

## Changelog

see ./index.htm

## data sources
There are two ways to provide a group of tables:

* static groups: the groups and tables are loaded from a text file stored on the server
* github gist: the groups and tables are loaded from a github gits via its unique id

In the group's description markdown code can be used but javascript code will be removed for security reasons.

### static groups
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

### github gist

The program can load groups from a gist.
This allows any user to use their own tables and share them with others.

The format to define a group in the gist ist the same format as for the static group definition.

The data can be loaded by adding the git's id to the query string.
If you call the application with the query string `data=gist:ac267b9cc810ac5f20e2`, 
it tries to load additional groups from the gits with the id _ac267b9cc810ac5f20e2_.

So a user could publish a url like `http://example.com/?data=gist:ac267b9cc810ac5f20e2` to share 
the group with other users.



## Contributors
* spanish translation was contributed by https://github.com/Nifled