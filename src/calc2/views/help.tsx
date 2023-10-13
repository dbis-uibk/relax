/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as $ from 'jquery';
// @ts-ignore
import { Choice, Comment, Diagram, NonTerminal, OneOrMore, Optional, Sequence, Skip, Stack, Terminal, ZeroOrMore } from 'railroad-diagrams';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { RailroadDiagram } from '../components/railroadDiagram';
import './help.css';
import { NavigationMobile } from '../components/navigation-mobile';
import { Navigation } from '../components/navigation';

interface Props extends RouteComponentProps<{lang: string}> {
}

// NOTE: as react escapes html entities: use {'<'} for < aka &lt;

export class Help extends React.Component<Props> {
	componentDidMount(){
		// create toc
		// this depends on correct h2 h3 ordering
		const toc = $('#toc');
		let idCounter = 0;
		let h2: JQuery<HTMLElement> | null = null;
		let h3: JQuery<HTMLElement> | null = null;
		let h4: JQuery<HTMLElement> | null = null;

		$('h2, h3, h4, h5, h6').each(function () {
			const e = $(this);

			const anchor = e.attr('name') || e.attr('id') || 'tocId' + (idCounter++);

			e.attr('name', anchor);
			e.attr('id', anchor);

			// tslint:disable-next-line: prefer-template
			const content = '<a href="#' + anchor + '">' + e.text() + '</a>';

			if (e.is('h2')) {
				toc.append($(`<h6>${content}</h6><ul></ul>`));
				h2 = toc.find('ul:last');
			}
			else if (e.is('h3')) {
				if(!h2){
					throw new Error(`malformed headings`);
				}
				h2.append($(`<li>${content}<ul></ul></li>`));
				h3 = h2.find('ul:last');
			}
			else if (e.is('h4')) {
				if(!h3){
					throw new Error(`malformed headings`);
				}
				h3.append($(`<li>${content}<ul></ul></li>`));
				h4 = h3.find('ul:last');
			}
			else {
				if(!h4){
					throw new Error(`malformed headings`);
				}
				h4.append(`<li>${content}</li>`);
			}
		});


		// add a link to each heading to jump to the specific anchor
		$('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]').each(function() {
			$(this).append(` <a class="anchor" href="#${$(this).attr('id')}"><i class="fa fa-link"></i></a>`);
		});
	}
	
	render(){
		return (
			<div className="view-max">
				<Navigation></Navigation>
				<NavigationMobile></NavigationMobile>
				<div className="view-content">
					<div className="container">
							<h1 id="help">RelaX - Help</h1>

							<div id="toc"></div>

							<h2 id="tutorial-user">Tutorial - user</h2>

							<h3 id="tutorial-user-coreconcepts">The core concepts</h3>

							<p>The goal of this tutorial is to give a quick introduction how to use the relational algebra calculator
								and its concepts. It assumes that you already know the relational algebra or are learning it from other
								sources.</p>

							<p>There is no real standard for the relational algebra like there is for SQL. So every book or teacher
								might have its slightly different interpretation and notation.<br />
								The goal of this progam was to support the most commonly used "mathematical" notation used by <a
										href="http://infolab.stanford.edu/~ullman/dscb.html">Database Systems The Complete Book 2nd
									Edition by Hector Garcia-Molina, Jeff Ullman, and Jennifer Widom</a>, <a
										href="http://www3.in.tum.de/teaching/bookDBMSeinf/" lang="de">Datenbanksysteme: Eine Einführung
									by Alfons Kemper and André Eickler</a> and <a
										href="http://en.wikipedia.org/wiki/Relational_algebra">Wikipedia - Relational Algebra</a> and
								others.
							</p>

							<h4 id="tutorial-user-relations">relations</h4>

							<p>The core element of the calculator is the relation (or table) which consists of a fixed number of
								attributes (or columns) in a fixed order (this is called the schema of the relation) and a set of tuples
								or rows containing the specific values.</p>

							<p>Each attribute has three distinct properties: its type, its position and its name.</p>

							<p>The type or domain of an attribute is either <i>string</i>, <i>number</i>, <i>date</i> or <i>boolean</i>.<br />
								The type is used for example to determine if two values can be compared in a boolean expression or if
								two schemas are union compatible. In most cases the type of the attributes are obvious if you look at
								the values.</p>

							<p>The position of each attribute in a schema is fixed and can be used to adress the attributes.<br />
								An example would be the projection of the first and third attribute or column of an arbitrary relation
								R: <code className="example block">&pi; [1], [3] ( R )</code>
							</p>

							<p>The full qualified name of the attribute is a unique identifier of the attribute within the schema of its
								relation.
								It consists of the name itself and a relation qualifier and are written like in SQL as <code>R.a</code>
								where a is the name and R is the relation qualifier.<br />
								An example would be the projectoin of the attributes a, b from a relation R: <code
										className="example block">&pi; R.a, R.b ( R )</code><br />
								The default relation qualifier of each attribute is the name of its relation.<br />

								If the attributes name without the qualifier is unique within the relation's schema, it also can be used
								to address a specific attribute.<br />
								The previous example could also be written as <code>&pi; a, b ( R )</code>.
							</p>

							<p>Each relation has a set of tuples (or rows). This means that there are no duplicate tuples within one
								relation and the duplicate-elimination is implicitly executed after every single step of the
								calculation.<br />
								The tuples in the calculator have a defined order and unlike a normal database system all operations are
								implemented to preserve that order. This should help the users to see what has changed from one step to
								the next.
							</p>

							<p>so far we covered that</p>
							<ul>
								<li>relations are the core elements,</li>
								<li>relations have a schema and a set of tuples,</li>
								<li>each attribute in the schema has
									<ul>
										<li>data-type</li>
										<li>a position</li>
										<li>a fully qualified name (RELATION.attributename)</li>
									</ul>
								</li>
								<li>and that each attribute can be addressed within an operation using
									<ul>
										<li>its position e.g. <code className="">&pi; [1], [2] ( R )</code>,</li>
										<li>the attribute name e.g. <code className="">&pi; a, b ( R )</code></li>
										<li>or its full quallified name if the unqualified is not unique e.g. <code className="">&pi; R.a,
											S.a ( R x S )</code></li>
									</ul>
								</li>
							</ul>

							<h3 id="tutorial-user-plain-text-notation">Alternative plain text notation</h3>

							<p>Before we introduce how to use the operators this should be a quick introduction of a very handy feature
								of the relational algebra calculator: the alternative plain text notation</p>

							<p>The "classNameic" mathematical notation uses greek letters like &pi;, &sigma; for the unary operations and
								special symbols like the join symbol <span className="math">⋈</span> or the union symbol <span className="math">∪</span>
								for some binary operations.<br />
								This symbols can be entered using the toolbar at the top of the editor.
							</p>

							<p>This calculator also supports a alternative syntax for all this symbols that follows two very simple
								rules: Every greek letter can be substituted with its name spelled out ("pi" for &pi;, "gamma"
								for &gamma;) and every other symbol has an equivalent name that is borrowed from SQL, programming
								languages like C and <a href="http://en.wikipedia.org/wiki/Set_theory">Set theory</a>.</p>

							<p>This substitutions should be easy to read and much more important very easy to write because you don't
								need any toolbar or mouse. The calculator also supports autocomplete: just press [CTRL]+[SPACE] to
								complete the current keyword.<br />
								This feature should help you to write your statements more quickly and fluently.
							</p>

							<code className="example block">&pi; R.a, S.a, S.b
				&sigma; R.a = S.a ∧ ( R.a {'>'} 5 ∨ R.a {'<'} 0 ) (
					R ⨯ S
				)</code>

							is equivalent to:

							<code className="example block">pi R.a, S.a, S.b
				sigma R.a = S.a and ( R.a {'>'} 5 or R.a {'<'} 0 ) (
					R cross join S
				)</code>

							In the following table you can see a list of all supported substitutions:
							<div className="scroll-x"><table className="table table-condensed">
								<thead>
								<tr>
									<th>classNameical notation</th>
									<th>alternative notation</th>
								</tr>
								</thead>
								<tbody>
								<tr>
									<td className="math">&pi;</td>
									<td>pi</td>
								</tr>
								<tr>
									<td className="math">&sigma;</td>
									<td>sigma</td>
								</tr>
								<tr>
									<td className="math">&rho;</td>
									<td>rho</td>
								</tr>
								<tr>
									<td className="math">&tau;</td>
									<td>tau</td>
								</tr>
								<tr>
									<td className="math">&gamma;</td>
									<td>gamma</td>
								</tr>
								<tr>
									<td className="math">∩</td>
									<td>intersect</td>
								</tr>
								<tr>
									<td className="math">∪</td>
									<td>union</td>
								</tr>
								<tr>
									<td className="math">-</td>
									<td>\</td>
								</tr>
								<tr>
									<td className="math">÷</td>
									<td>/</td>
								</tr>
								<tr>
									<td className="math">⨯</td>
									<td>
										<ul>
											<li>x</li>
											<li>cross join</li>
										</ul>
									</td>
								</tr>
								<tr>
									<td className="math">⋈</td>
									<td>
										<ul>
											<li>join</li>
											<li>inner join</li>
											<li>natural join</li>
										</ul>
									</td>
								</tr>
								<tr>
									<td className="math">⟕</td>
									<td>
										<ul>
											<li>left join</li>
											<li>left outer join</li>
										</ul>
									</td>
								</tr>
								<tr>
									<td className="math">⟖</td>
									<td>
										<ul>
											<li>right join</li>
											<li>right outer join</li>
										</ul>
									</td>
								</tr>
								<tr>
									<td className="math">⟗</td>
									<td>full outer join</td>
								</tr>
								<tr>
									<td className="math">⋉</td>
									<td>left semi join</td>
								</tr>
								<tr>
									<td className="math">⋊</td>
									<td>right semi join</td>
								</tr>
								<tr>
									<td className="math">▷</td>
									<td>
										<ul>
											<li>anti semi join</li>
											<li>anti join</li>
										</ul>
									</td>
								</tr>
								<tr>
									<td className="math">←</td>
									<td>{'<'}-
										<code className="example block">pi new_name {'<'}- a ( R )</code>
									</td>
								</tr>
								<tr>
									<td className="math">→</td>
									<td>-{'>'}
										<code className="example block">pi a -{'>'} new_name ( R )</code>
									</td>
								</tr>
								</tbody>
							</table></div>


							<ul>
								<li>schema preserving operations - operations where the resulting relation has the same schema as its
									first argument-relation:
									<ul>
										<li>selection</li>
										<li>union</li>
										<li>intersection</li>
										<li>subtraction</li>
										<li>orderby</li>
										<li>left outer join</li>
										<li>left semi join</li>
										<li>anti join</li>
									</ul>
								</li>
							</ul>

							<h3 id="tutorial-user-relalg">Relational algebra</h3>

							<p>For this Part we use the <a href="calc/gist/2cfb981fbc5676182d64">&quot;bank example&quot;
								Dataset</a> with 3 relations: <i>Customers</i>, <i>Accounts</i> and <i>PremiumCustomers</i>. By
								convention relations start with a uppercase letter and attributes with a lower case letter.</p>

							<h4>Open and inspect dataset</h4>

							<p>Open the dataset used in this tutorial using the following link to the <a
									href="calc/gist/2cfb981fbc5676182d64">&quot;bank example&quot; Dataset</a>.</p>

							<p>You find the relations and their attributes listed on the side and if you hover a relations name a
								preview of the first view tuples is displayed.</p>


							<h4 id="tutorial-user-basic-query">The most basic query</h4>

							<p>After you have found the Dataset you can formulate the very first and most basic query in relational
								algebra: a relation without any further manipulation.</p>


							<p>Just enter the name of a relation into the code editor or click on the relation/attribute names to insert
								them into the code editor.<br />Note that the editor supports auto completing the relation/attribute names
								of the current dataset and the operators with [CTRL]+[SPACE]</p>

							<p>So if you want all tuples of the relation <i>Customer</i> you should have the following statement: <code>Customer</code>.
								And get all the tuples if you press the execute button or press [CTRL]+[RETURN].</p>

							<h4 id="tutorial-user-unary-operations">Unary operations</h4>

							<p>All unary operations have the same basic syntax <code><i>FUNCTION</i> ARGUMENT <strong>(</strong>
								CHILD_EXPRESSION <strong>)</strong></code>.</p>

							<p className="hint">The braces around the <code>CHILD_EXPRESSION</code> can be omitted. In this case the
								predefined <a href="#relalg-operator-precedence">operator precedence for relational algebra</a> applies.
							</p>

							<p>A complete list of the supported relalg operations can be found here: <a href="#relalg-syntax">general
								syntax</a>, <a href="#relalg-unary-operations">unary operations</a> and <a
									href="#relalg-binary-operations">binary operations</a>.</p>

							<p>The projection is one of the basic operations that allow to choose which of the attributes of the parent
								relations should be included in the new one and in which order they should be.</p>

							<p>Renaming a relation (&rho;) changes the qualifiers of all the relations attributes but does not touch the
								tuples.</p>

							<p>Renaming an attribute (&rho;) only changes the name of a specific attribute (and leaves his
								relation-qualifier unchanged).</p>

							<p>The statement <code>pi balance ( Accounts )</code> returns a new relation with only the balance
								attribute.</p>

							<p>The next statement gets the balance with the account-id after renaming the relation to <i>A</i> and
								renames one of the attributes.</p>
							<code className="example block">rho account_number {'<'}- aid (
					pi aid, A.balance (
						rho A (
							Accounts
						)
					)
				)</code>

							<p className="hint">Like in SQL or most programming languages you can format your statement and use SQL like
								comments (with <code>-- ...</code> or <code>/* ... */</code>) to increase the readability.</p>

							<p>The next statement uses a selection to filter the tuples of a relation based on a boolean expression. The
								calculator supports complex boolean expression with functions and built in operator precedence.
								<br />The attributes in the boolean expression can be given as name or numeric position like with the
								projection.
							</p>

							<p>The next statement selects all customers-ids of customers who have the same value for their firstname and
								lastname.</p>
							<code className="example block">-- this should return an relation with no tuples:
				pi cid (
					sigma firstname=lastname ( Customers )
				)
							</code>

							<p>The next example uses a more complex expression to get all accounts with a balance over 100 or under
								-100.</p>
							<code className="example block">sigma balance {'>'} 100 or (balance*-1 {'>'} 100) ( Accounts )
				-- (balance {'<'} -100) would also be correct</code>

							<p>As a shorter alternative you can use a <a href="#relalg-valueexpr">function in your expression</a> to get
								the same result:</p>
							<code className="example block">sigma abs(balance) {'>'} 100 ( Accounts )</code>


							<h2 id="tutorial-maintainer">Tutorial - maintainer</h2>

							<p>
								Everybody can provide datasets that can be used in the relational algebra calculator and share them with
								others.<br />
								We assume the scenario of a teacher wanting to provide a dataset for his/her students for this short
								tutorial.
							</p>

							<p>
								The datasets are specified in a simple text format and can be shared with others via <a
									href="https://gist.github.com/">GitHub Gists</a> (a simple and free platform to share snippets).<br />
								The shared gist gets an unique ID and the relational algebra calculator can load the dataset directly
								using this ID.
							</p>

							<h3 id="tutorial-maintainer-create-dataset">Creating a dataset</h3>

							<p>
								The fist step is the creation of the dataset which is actually only a group of relation definitions with
								some additional information and is therefore refered as group in the specified format.<br />
								The relations can then be used by the students to formulate the there statements.<br />
								Lets assume we want to create a dataset of employees of a company.
							</p>

							Every group definition starts with a simple header which (at least) contains the name of the group:

							<code className="example block">group: bank example</code>

							every header field starts with the name of the field and is followed by a colon for single line values.

							The next (optional) header field we should specify is the description. It should contain information like
							who is maintaining this dataset or where to find additional information.<br />
							In the description <a href="http://en.wikipedia.org/wiki/Markdown">Markdown</a> can be used to format the
							text or set links to external resources.

							<p>In our example we add a description that takes more than a single line and therefore we enclose the value
								in double brackets instead of using the colon.</p>

							<code className="example block">group: bank example
				description[[ the data for this dataset was generated using {'<'}http://www.generatedata.com/{'>'}

				* the relation _Customers_ contains basic information about the customers of the bank.
				The relation _Accounts_ contains the basic information of a single account.
				Note that a customer can have any number of accounts.
				* the relation _PremiumCustomers_ contains
				the customer-ids of all customers with a total balance over 1000
				]]
							</code>

							<p>The next step is to actually add the relations the students can use for their queries.<br />

								The relation definitions are use the relational algebra syntax that can be used in this tool.<br />

								Every relation is defined by a single variable assignment where the name of the variable is used as the
								relations name and the result of the expression defines the relation.<br />
								The relalg expression can use all features that can be used in the tool and can also use other relations
								defined within the same dataset.<br />
								Note that the name of the relation is used as the qualifier of each attribute/column.</p>

							<p>For the relation <code>Customers</code> relation we use the <a href="#relalg-inline-relation">inline
								relation</a> syntax as the most basic method to define the relation and can also be edited using the
								relation editor <i className="fa fa-table" title="relation editor"></i> which is a simple spread-sheet like
								editor. <br />
								The inline relations in combination with the editor should be very easy to use if you enter the data
								directly or if you have them as a csv/spread-sheet file.
							</p>

							<code className="example block">{`group: bank example
				description[[ the data for this dataset was generated using {'<'}http://www.generatedata.com/>

				* the relation _Customers_ contains basic information about the customers of the bank.
				* the relation _Accounts_ contains the basic information of a single account. Note that a customer can
				have any number of accounts.
				* the relation _PremiumCustomers_ contains the customer-ids of all customers with a total balance over
				1000
				]]

				Customers = { cid firstname lastname
				1 Dexter Simpson
				2 Kaseem Gallagher
				3 Kuame Hamilton
				4 Robert Thompson
				5 Rhiannon Valentine
				6 Calvin Mays
				}

				Accounts = {
				aid, cid, balance:number
				1, 1, 66
				2, 1, -304
				3, 2, 272
				4, 3, 3472
				5, 4, 975.7
				6, 4, 93
				7, 5, 534
				8, 5, -75.5
				}
				`}</code>

							<p>
								As we can see the name of the relations are defined by the assignments.<br />
								The inline-relations are enclosed by curly braces and contain the names of the attributes/columns in
								the first line and then a tuple/row per line where the values are simply separated by whitespace. You
								can also other seperators and can define the types explicitly as we can see at the Accounts relation.
								For further information can be found at <a href="#relalg-inline-relation">inline relation
								description</a>.
							</p>

							<p>
								Note that, unlike the variables used in a query, the definition of a new relation implicitly sets the
								attribute qualifier to the name of the relation.
								So the schema of the account relation is <code>(Accounts.aid, Accounts.cid, Accounts.balance)</code>.
								This allows each attribute to be accessible with this name.
							</p>

							<p>The last relation we need to add in this example is the relation containing the banks premium Customers.
								<br />
								They are specified by using the other two relations in a simple relational algebra statement that
								selects all customers with a total balance over 1000.
							</p>


							<code className="example block">{`group: bank example
				description[[ the data for this dataset was generated using {'<'}http://www.generatedata.com/>

				* the relation _Customers_ contains basic information about the customers of the bank.
				* the relation _Accounts_ contains the basic information of a single account. Note that a customer can
				have any number of accounts.
				* the relation _PremiumCustomers_ contains the customer-ids of all customers with a total balance over
				1000
				]]

				Customers = { cid firstname lastname
				1 Dexter Simpson
				2 Kaseem Gallagher
				3 Kuame Hamilton
				4 Robert Thompson
				5 Rhiannon Valentine
				6 Calvin Mays
				}

				Accounts = {
				aid, cid, balance:number
				1, 1, 66
				2, 1, -304
				3, 2, 272
				4, 3, 3472
				5, 4, 975.7
				6, 4, 93
				7, 5, 534
				8, 5, -75.5
				}

				PremiumCustomers =
					pi cid (
						sigma sum > 1000 (
							gamma cid; sum(balance)->sum (
								Accounts
								join Customers
							)
						)
					)
				`}</code>

							<p>We have now seen how to define a dataset with its header containing the name and the description followed
								by relational algebra assignments defining the relations of the dataset.</p>

							<p>We can paste this definition directly in the <i>Group Editor</i> to load and use it.<br />
								In the next section we want to look at how we can publish this definition so that we give our students a
								single url or id to directly load the dataset.
							</p>

							<h3 id="tutorial-maintainer-share-dataset">Share a dataset</h3>

							<p>If we want to share the definition of a dataset with other people we could simply give them the
								definition and they load it using the <i>group editor</i>, but that would not be that practical for most
								cases.</p>

							<p>The simpler solution (for the users) is to publish the definition as a <a
									href="https://gist.github.com/">GitHub Gist</a> and share the ID of the gist with others.</p>

							<p>Just create a gist with the definition as its content (the filename does not matter) and publish it. The
								ID of the Gist can now be found at the top of the page as <i>gist:xxxxxxxxxxxx</i> or in the url after
								the last slash.</p>

							<p>This ID can then be shared and loaded in the interface or the calculator can be called directly with a
								specific ID by using using the parameter <code>/calc/gist/xxxxxxxxxxxx</code>.</p>

							<p>For example the simple bank definition of this tutorial has been published as a <a
									href="https://gist.github.com/ragtime/2cfb981fbc5676182d64">Gist with the ID
								2cfb981fbc5676182d64</a> and can therefore be loaded directly with modifying the url by replacing all after <code>DOMAIN/relax/calc/</code> with <code>/gist/2cfb981fbc5676182d64</code>.</p>


							<h2 id="relalg-reference">Reference - relational algebra</h2>

							<h3 id="relalg-syntax">General syntax</h3>

							<div>
								<h4 id="relalg-assignment">assignment</h4>
								<div className="scroll-x"><table className="table table-nonfluid">
									<tbody>
										<tr>
											<th>syntax</th>
											<td><code><i>NAME</i> <strong>=</strong> <i>EXPRESSION</i></code></td>
										</tr>
									</tbody>
								</table></div>

								<div>
									<p>Defines a new local variable with the name <i>NAME</i>; its content is defined by
										<i>EXPRESSION</i></p>

									<p>The name of the new relation must be unique.</p>

									<p>The definition has to be executed with the statement.</p>

									<div className="example">
										<code>TestA = &pi; a,b R
				TestB = &sigma; d {'>'} 0 S

				-- statement using the variable
				TestA join TestB</code>
									</div>

									<p>An assignment (= definition of a variable) is no valid relational algebra expression on its own.
										If you miss the acutal query a error is thrown (<i>Error: only assignments found; query is
											missing</i>).
									</p>

									<div className="example">
										<code>-- this is the definition of the variable
				Test = &pi; Customer.firstname, surname ( Customer )

				-- this is the actual query/statement using the variable
				Test</code>
									</div>

									<p>
										The defined variable can be used like the assigned expression could be used because
										every usage of the variable gets replaced with its definition before the query gets executed.
										<br />This also means that the variable-name has no influence on the schema of the expression
										and the names of the attributes/columns are not affected by assignment:
										<code className="block example">X = R
				X join S</code>
										The attributes of the relation R are only accessible with its original names (R.a, R.b, ..),
										and are not affected by the assignment.
									</p>

									<p>There is a known problem when the last assignment ends with a natural join and the query consists
										of a single relation:</p>
									<code>A = S join R
				A -- this is the query</code>

									<p>
										The statement is ambiguous and the parser interprets it as <code>A = (S join R A)</code>
										where R is interpreted as a column argument for the theta-join and therefore detects a
										cyclic usage of the variable A.
									</p>

									<p>
										Solution: To get the expected behaviour you have to set braces around the assigned expression
										like <code>A = (S join R)
										A</code>
									</p>
								</div>
							</div>

							<div>
								<h4 id="relalg-comment-sl">single-line comment</h4>
								<div className="scroll-x"><table className="table table-nonfluid">
									<tbody>
										<tr>
											<th>syntax</th>
											<td><code><strong>-- </strong><i>COMMENT_TEXT</i><i>EXPRESSION</i></code></td>
										</tr>
									</tbody>
								</table></div>
								<div>
									<p>the '--' must be followed by at least one whitespace charater! inserts a comment; its text goes
										until the end of the line</p>

									<p>comments are recognized as whitespace</p>

									<div className="example"><code>Test =
				<b>-- This is the expression that is assigned to Test:</b>
				&pi; Customer.firstname, surname ( Customer )</code>
									</div>
								</div>
							</div>

							<div>
								<h4 id="relalg-relation-name">pre defined relation</h4>
								<div className="scroll-x"><table className="table table-nonfluid">
									<tbody>
										<tr>
											<th>syntax</th>
											<td><code><i>RELATION_NAME</i></code></td>
										</tr>
									</tbody>
								</table></div>
								<div>
									<p>Uses a pre defined relation with the name <i>RELATION_NAME</i></p>

									<p>The code completion only works for this relations.</p>

									<div className="example"><code>( Customers ) cross join ( Accounts )</code>
									</div>
								</div>
							</div>

							<div>
								<h4 id="relalg-comment-ml">multi-line comment</h4>
								<div className="scroll-x"><table className="table table-nonfluid">
									<tbody>
										<tr>
											<th>syntax</th>
											<td><code><strong>/* </strong><i>COMMENT_TEXT</i><strong> */</strong>
												<i>EXPRESSION</i></code></td>

										</tr>
									</tbody>
								</table></div>
								<div>
									<p>inserts a comment that can span multiple lines</p>

									<p>comments are recognized as whitespace</p>

									<div className="example">
										<code><b>/* This is
				a very
				very
				long comment */</b>
				Test = &pi; Customer.firstname, surname ( Customer )</code>
									</div>
								</div>
							</div>

							<div>
								<h4 id="relalg-inline-relation">inline-relation</h4>
								<div className="scroll-x"><table className="table table-nonfluid">
									<tbody>
										<tr>
											<th>syntax</th>
											<td><code><b>{`{`}</b><i>COLUMN_NAME_1</i>:<i>COLUMN_TYPE_1</i> ...
					<i>ROW_1</i>
					<i>ROW_2</i>
					...
					<b>{'}'}</b></code>
											</td>
										</tr>
									</tbody>
								</table></div>
								<div>
									<p>The inline-relation is a temporary relation that can be defined directly in the statement. It is
										only valid in the defining statement</p>

									<p>Every inline-relation is a valid expression and thus can be used at any position a
										<i>EXPRESSION</i> is expected.</p>

									<p>The inline-relation is defined by a header, that specifies the schema of the relation
										and the rows containing the values and is surrounded by curly braces.</p>

									<div>
										The header is defined by a sequence of
										<code><i>QUALIFIER.COLUMN_NAME</i>:<i>COLUMN_TYPE</i></code> <b>separated by any whitespace,
										comma or semicolon.</b>
										The <i>QUALIFIER</i> is optional. Also the <i>COLUMN_TYPE</i> can be omitted if the type is well
										defined by the values of that column. The first non null value of a column defines its type.
										<br />True and false (case insensitive without quotes) are reserved for a boolean type. They can
										be used as a simple string but they do not define the type of the column as string.
										<br />The <i>COLUMN_TYPE</i> can be one of the following
										<ul>
											<li>string</li>
											<li>number</li>
											<li>date</li>
											<li>boolean</li>
										</ul>
										<div className="too-wide">
											<RailroadDiagram 
												diagram={Diagram(
														Optional(
																Sequence(NonTerminal('qualifier'), '.'),
														),
														NonTerminal('column-name'),
														Optional(
																Sequence(
																		':',
																		Choice(0,
																				'string',
																				'number',
																				'date',
																				'boolean',
																		),
																),
														),
												)} />
										</div>
									</div>

									<p>
										The rows of the relation are defined by a list of values per row with the type of the
										corresponding column. The values are <b>separated by whitespace comma or semicolon.</b>
										<br />Simple strings only containing letters, numbers, hyphens, underlines, dots or periods
										([0-9a-zA-Z\-_\.]+) can be written without single quotes. <i>NULL</i> and <i>null</i> are
										constant values. If null, true or false should be used as string they have te be quoted.
										<br />More complex strings must be surrounded by single quotes: <i>'content'</i> or <i>content</i>
										but '' or 'long content containing spaces and special characters like !' or 'null'.
										<br />Dates are written in ISO-format: YYYY-MM-DD without single quotes
										<br />A null-value can be written as <i>null</i> or <i>NULL</i> (without single quotes).
										<br />Numbers could be integers in the form (-?[0-9]+) or floats in the form (-?[0-9]+\.[0-9]+).
										<br />Numbers in single quotes are recognized as numbers if the column type is defined as number
										or has been detected to be number from a previous value; otherwise it will be a string value..
										<br />A boolean value is denoted as either <i>true</i> or <i>false</i> (case insensitive).
									</p>

									<p>The header and rows can be indented if needed.</p>

									<div className="example">
										<code>{`-- type for column b is defined by the first value
				rho A {
					a:number, b
					1,        2
					3,        4
				}
				cross join
				{
					a:string X.b:date   c:number
					Alpha    1970-01-01 1
					'Beta 2' 1970-01-02 3
					''       1970-01-03 4
				}`}</code>
									</div>
								</div>
							</div>
							<div>
								<h4 id="relalg-relalgexpr">relational algebra expression</h4>

								<div>
									<p>A valid relational algebra expression is built by connecting <i>relation-name</i> or <i>inline-relation</i>
										as atoms with the defined unary and binary operators.</p>

									So a relational algebra expression is recursively defined as follows:

									<div className="too-wide">
										{/** 
										<RailroadDiagram 
											diagram={Diagram(
													Choice(
															0,
															Sequence('(', NonTerminal('RA-expression', '#relalg-relalgexpr'), ')'),
															NonTerminal('relation-name', '#relalg-relation-name'),
															NonTerminal('inline-relation', '#relalg-inline-relation'),
															Sequence(
																	Choice(
																			0,
																			NonTerminal('projection', '#relalg-operations-projection'),
																			NonTerminal('selection', '#relalg-operations-selection'),
																			NonTerminal('rename relation', '#relalg-operations-renamerelation'),
																			NonTerminal('rename column', '#relalg-operations-renamecolumn'),
																			NonTerminal('order by', '#relalg-operations-orderby'),
																			NonTerminal('group by', '#relalg-operations-groupby'),
																	),
																	NonTerminal('RA-expression', '#relalg-relalgexpr'),
															),
													),
													Choice(
															1,
															Skip(),
															Sequence(
																	Choice(
																			0,
																			NonTerminal('intersection', '#relalg-operations-intersection'),
																			NonTerminal('union', '#relalg-operations-union'),
																			NonTerminal('division', '#relalg-operations-division'),
																			NonTerminal('subtraction', '#relalg-operations-subtraction'),
																			NonTerminal('cross product', '#relalg-operations-crossjoin'),
																			NonTerminal('θ-join', '#relalg-operations-innerjoin'),
																			NonTerminal('natural join', '#relalg-operations-naturaljoin'),
																			NonTerminal('left outer join', '#relalg-operations-leftjoin'),
																			NonTerminal('right outer join', '#relalg-operations-rightjoin'),
																			NonTerminal('full outer join', '#relalg-operations-fulljoin'),
																			NonTerminal('left semi join', '#relalg-operations-leftsemijoin'),
																			NonTerminal('right semi join', '#relalg-operations-rightsemijoin'),
																			NonTerminal('anti semi join', '#relalg-operations-antijoin'),
																	),
																	NonTerminal('RA-expression', '#relalg-relalgexpr'),
															),
													),
											)} />
											*/}
									</div>
								</div>
							</div>


							<h3 id="relalg-unary-operations">Unary operations</h3>
							Each unary operation follows the following syntax:
							<div className="b-syntax">
								<code><i>FUNCTION</i> ARGUMENT <strong>(</strong> CHILD_EXPRESSION <strong>)</strong></code>
							</div>
							The parentheses are Optional.


							<div>
								<h4 id="relalg-operations-projection">projection</h4>
								<div className="scroll-x"><table className="table table-nonfluid">
									<tbody>
										<tr>
											<th>symbol</th>
											<td className="math">&pi;</td>
										</tr>
										<tr>
											<th>alternative syntax</th>
											<td>pi</td>
										</tr>
										<tr>
											<th>example</th>
											<td>
												<code className="relalg">pi a, b ( R )</code>
											</td>
										</tr>
									</tbody>
								</table></div>
								<p>The argument is a subset of columns of the schema of the <i>CHILD_EXPRESSION</i> or a <a
										href="#relalg-valueexpr">value expression</a></p>

								<div className="example">
									<code>&pi; Customer.firstname, surname ( Customer )</code>
								</div>

								<div className="example">
									<code>pi c.id, [1] ( &rho; c ( Customer ) )</code>
								</div>

								Expressions can be used to create more complex statements using one or more columns of a single row.

								<div className="example">
									<code>pi c.id, lower(username)-{'>'}user, concat(firstname, concat(' ', lastname))-{'>'}fullname (
					&rho; c ( Customer )
				)</code>
								</div>

								The virtual column <i>ROWNUM</i> used in previous versions is not supported any more but
								the <code>rownum()</code> expression can be used to get the same information. And it can also be used
								directly in the boolean condition of a selection or join.

								<div className="example">
									In this example the top 5 customers with the most orders are selected,
									where countOrders could be the result of a previous aggregation.
									<code>pi firstname, lastname
				sigma rownum() {'<'}= 5
				tau countOrders desc
				Customer
									</code>
								</div>

								<div className="too-wide">
									<RailroadDiagram 
											diagram={Diagram(
												Sequence(
														Choice(0, 'π', 'pi'),
														OneOrMore(NonTerminal('column', '#relalg-column'), ','),
												),
												NonTerminal('RA-expression', '#relalg-relalgexpr'),
										)} />
								</div>
							</div>

							<div>
								<h4 id="relalg-operations-selection">selection</h4>
								<div className="scroll-x"><table className="table table-nonfluid">
									<tbody>
										<tr>
											<th>symbol</th>
											<td className="math">&sigma;</td>
										</tr>
										<tr>
											<th>alternative syntax</th>
											<td>pi</td>
										</tr>
										<tr>
											<th>example</th>
											<td>
												<code className="relalg">sigma a {'>'} 2 ( R )</code>
											</td>
										</tr>
									</tbody>
								</table></div>

								<p>The argument is a <a href="#relalg-valueexpr">boolean expression</a> that each row of <i>CHILD_EXPRESSION</i>
									is checked on</p>

								<div className="example">
									<code>&sigma; firstname = 'Bob' or firstname = 'Alice' ( Customer )</code>
								</div>
								<div className="example">
									<code>&sigma; (id {'>'} 10 and id {'<'} 100) or id = 42 ( Customer )</code>
								</div>
								<div className="example">
									Selecting all customers with a firstname that has an even length.
									<code>&sigma; mod(length(firstname),2) = 0 ( Customer )</code>
								</div>

								<div className="too-wide">
									<RailroadDiagram 
											diagram={Diagram(
												Sequence(
														Choice(0, 'σ', 'sigma'),
														NonTerminal('boolean-expression', '#relalg-valueexpr'),
												),
												NonTerminal('RA-expression', '#relalg-relalgexpr'),
										)} />
								</div>
							</div>

							<div>
								<h4 id="relalg-operations-renamerelation">rename relation</h4>
								<div className="scroll-x"><table className="table table-nonfluid">
									<tbody>
										<tr>
											<th>symbol</th>
											<td className="math">&rho;</td>
										</tr>
										<tr>
											<th>alternative syntax</th>
											<td>rho</td>
										</tr>
										<tr>
											<th>example</th>
											<td>
												<code className="relalg">( R ) join R.a = X.b (rho X ( R ))</code>
											</td>
										</tr>
									</tbody>
								</table></div>

								<div>
									The argument is the new name for the Relation returned by <i>CHILD_EXPRESSION</i>

									<div className="example">
										rename the Relation from "Customer" to "a":
										<code>&pi; a.id, a.firstname ( &rho; a ( Customer ) )</code>
									</div>

									<div className="too-wide">
										<RailroadDiagram 
											diagram={Diagram(
													Sequence(
															Choice(0, 'ρ', 'rho'),
															NonTerminal('new relation name'),
													),
													NonTerminal('RA-expression', '#relalg-relalgexpr'),
											)} />
									</div>
								</div>
							</div>
							<div>
								<h4 id="relalg-operations-renamecolumn">rename column</h4>
								<div className="scroll-x"><table className="table table-nonfluid">
									<tbody>
										<tr>
											<th>symbol</th>
											<td className="math">&rho;</td>
										</tr>
										<tr>
											<th>alternative syntax</th>
											<td>rho</td>
										</tr>
										<tr>
											<th>example</th>
											<td>
												the old and the new column names in a list (see example) <br />
												"←" can be substituted with "{'<'}-"
												<code className="relalg block">{`pi x, b rho a->x {a, b
						1, 2
						3, 4
					}`}</code>
											</td>
										</tr>
									</tbody>
								</table></div>
								<div>
									The argument is the old and the new column names in a list (see example) <br />
									"←" can be substituted with "{'<'}-"

									<div className="example">
										rename the columns id and firstname to myId and foobar:
										<code>&rho; myId←id, foobar←firstname (&pi; id, firstname ( Customer ) )</code>
									</div>

									<div className="too-wide">
										<RailroadDiagram 
											diagram={
												Diagram(
													Sequence(
															Choice(0, 'ρ', 'rho'),
															OneOrMore(
																	Choice(0,
																			Sequence(
																					NonTerminal('new name'),
																					Choice(0, '←', '<-'),
																					NonTerminal('column', '#relalg-column'),
																			),
																			Sequence(
																					NonTerminal('column', '#relalg-column'),
																					Choice(0, '→', '->'),
																					NonTerminal('new name'),
																			),
																	),
																	',',
															),
													),
													NonTerminal('RA-expression', '#relalg-relalgexpr'),
												)
											}
										/>
									</div>
								</div>
							</div>

							<div>
								<h4 id="relalg-operations-orderby">order by</h4>
								<div className="scroll-x"><table className="table table-nonfluid">
									<tbody>
										<tr>
											<th>symbol</th>
											<td className="math">&tau;</td>
										</tr>
										<tr>
											<th>alternative syntax</th>
											<td>tau</td>
										</tr>
										<tr>
											<th>example</th>
											<td>
												<code className="relalg">tau a asc, b desc ( R )</code>
											</td>
										</tr>
									</tbody>
								</table></div>

								<div>
									The argument is a list of columns by which the relation should be ordered (see examples)

									<div className="example">
										order the result by the first column (default is ascending) and the second column descending:
										<code>&tau; [1], firstname desc (&pi; id, firstname ( Customer ) )</code>
									</div>

									<div className="too-wide">
										<RailroadDiagram 
											diagram={Diagram(
													Sequence(
															Choice(0, 'τ', 'tau'),
															OneOrMore(
																	Sequence(
																			NonTerminal('column', '#relalg-column'),
																			Choice(0,
																					Skip(),
																					'asc',
																					'desc',
																			),
																	),
																	',',
															),
													),
													NonTerminal('RA-expression', '#relalg-relalgexpr'),
											)} />
									</div>
								</div>
							</div>

							<div>
								<h4 id="relalg-operations-groupby">group by</h4>
								<div className="scroll-x"><table className="table table-nonfluid">
									<tbody>
										<tr>
											<th>symbol</th>
											<td className="math">&gamma;</td>
										</tr>
										<tr>
											<th>alternative syntax</th>
											<td>gamma</td>
										</tr>
										<tr>
											<th>example</th>
											<td>
												<code className="relalg">gamma a; count(*)-{'>'}x ( R )</code>
											</td>
										</tr>
									</tbody>
								</table></div>
								<div>
									The argument is a list of columns to group by, separated by commas followed by a semicolon
									<br />and a list of aggregate functions to apply with their new name in form <span>AGG( COLUMN ) -{'>'} NEW_NAME</span>

									<div className="example">
										order the result by the first column (default is ascending) and the second column descending:
										<code>&gamma; a, b ; sum(c)-{'>'}x ( Customer )</code>
									</div>

									<p>If no grouping columns are provided the entire relation is the group.</p>

									<div>supported aggregate functions by type:
										<div className="scroll-x"><table className="table">
											<thead>
												<tr>
													<td>&nbsp;</td>
													<th>number</th>
													<th>string</th>
													<th>date</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<th>COUNT( * )</th>
													<td>yes</td>
													<td>yes</td>
													<td>yes</td>
												</tr>
												<tr>
													<th>COUNT( column )</th>
													<td>yes</td>
													<td>yes</td>
													<td>yes</td>
												</tr>
												<tr>
													<th>MIN( column )</th>
													<td>yes</td>
													<td>yes</td>
													<td>yes</td>
												</tr>
												<tr>
													<th>MAX( column )</th>
													<td>yes</td>
													<td>yes</td>
													<td>yes</td>
												</tr>
												<tr>
													<th>SUM( column )</th>
													<td>yes</td>
													<td>no</td>
													<td>no</td>
												</tr>
												<tr>
													<th>AVG( column )</th>
													<td>yes</td>
													<td>no</td>
													<td>no</td>
												</tr>
											</tbody>
										</table></div>
									</div>
								{/*
									<div className="too-wide">
										<RailroadDiagram 
											diagram={Diagram(
													Stack(
															Sequence(
																	Choice(0, 'γ', 'gamma'),
																	Sequence(
																			ZeroOrMore(NonTerminal('column', '#relalg-column'), ','),
																			';',
																			OneOrMore(
																					Sequence(
																							Choice(0,
																									'COUNT(*)',
																									Sequence(
																											Choice(0, 'COUNT', 'MIN', 'MAX', 'SUM', 'AVG'),
																											'(', NonTerminal('column', '#relalg-column'), ')',
																									),
																							),
																							Choice(0, '→', '->'),
																							NonTerminal('new name'),
																					),
																					',',
																			),
																	),
															),
															NonTerminal('RA-expression', '#relalg-relalgexpr'),
													),
											)} />
																									</div> */}
								</div>
							</div>


							<h3 id="relalg-binary-operations">Binary operations</h3>
							Each binary operation follows the following syntax:
							<div className="b-syntax">
								<code><strong>(</strong> CHILD_EXPRESSION <strong>)</strong> <strong>FUNCTION</strong> ARGUMENT <strong>(</strong>
									CHILD_EXPRESSION <strong>)</strong></code>
							</div>
							The parentheses are Optional.

							<div>
								<h4 id="relalg-operations-intersection">intersection - &cap;</h4>
								<div className="scroll-x"><table className="table table-nonfluid">
									<tbody>
										<tr>
											<th>symbol</th>
											<td className="math">&cap;</td>
										</tr>
										<tr>
											<th>alternative syntax</th>
											<td>intersect</td>
										</tr>
									</tbody>
								</table></div>
								<div>no argument

									<div className="example">
										<code>( Customer ) &cap; ( Customer )</code>
									</div>
									the schemas must be unifiable

									<div className="too-wide">
										<RailroadDiagram 
											diagram={Diagram(
													NonTerminal('RA-expression', '#relalg-relalgexpr'),
													Sequence(
															Choice(0, '∩', 'intersect'),
													),
													NonTerminal('RA-expression', '#relalg-relalgexpr'),
											)} />
									</div>
								</div>
							</div>
							<div>
								<h4 id="relalg-operations-union">union - &cup;</h4>
								<div className="scroll-x"><table className="table table-nonfluid">
									<tbody>
										<tr>
											<th>symbol</th>
											<td className="math">&cup;</td>
										</tr>
										<tr>
											<th>alternative syntax</th>
											<td>union</td>
										</tr>
									</tbody>
								</table></div>
								<div>no argument

									<div className="example">
										<code>( Customer ) &cup; ( Customer )</code>
									</div>
									the schemas must be unifiable

									<div className="too-wide">
										<RailroadDiagram 
											diagram={Diagram(
													NonTerminal('RA-expression', '#relalg-relalgexpr'),
													Sequence(
															Choice(0, '∪', 'union'),
													),
													NonTerminal('RA-expression', '#relalg-relalgexpr'),
											)} />
									</div>
								</div>
							</div>
							<div>
								<h4 id="relalg-operations-division">division</h4>
								<div className="scroll-x"><table className="table table-nonfluid">
									<tbody>
										<tr>
											<th>symbol</th>
											<td className="math">÷</td>
										</tr>
										<tr>
											<th>alternative syntax</th>
											<td>/</td>
										</tr>
									</tbody>
								</table></div>
								<div>no argument

									<div className="example">
										<code>( Customer ) ÷ ( Customer )</code>
									</div>
									the schemas must be unifiable

									<div className="too-wide">
										<RailroadDiagram 
											diagram={Diagram(
													NonTerminal('RA-expression', '#relalg-relalgexpr'),
													Sequence(
															Choice(0, '÷', '/'),
													),
													NonTerminal('RA-expression', '#relalg-relalgexpr'),
											)} />
									</div>
								</div>
							</div>
							<div>
								<h4 id="relalg-operations-subtraction">subtraction / set-difference</h4>
								<div className="scroll-x"><table className="table table-nonfluid">
									<tbody>
										<tr>
											<th>-</th>
											<td className="math">&cup;</td>
										</tr>
										<tr>
											<th>alternative syntax</th>
											<td>\<br />
												except
											</td>
										</tr>
									</tbody>
								</table></div>
								<div>no argument

									<div className="example">
										<code>( pi firstname ( Customer ) ) - ( rho test{'<'}-lastname (
					pi lastname ( Customer )
				) )</code>
									</div>
									the schemas must be unifiable

									<div className="too-wide">
										<RailroadDiagram 
											diagram={Diagram(
													NonTerminal('RA-expression', '#relalg-relalgexpr'),
													Sequence(
															Choice(0, '-', '\\', 'except'),
													),
													NonTerminal('RA-expression', '#relalg-relalgexpr'),
											)} />
									</div>
								</div>
							</div>
							<div>
								<h4 id="relalg-operations-crossjoin">cross product</h4>
								<div className="scroll-x"><table className="table table-nonfluid">
									<tbody>
										<tr>
											<th>symbol</th>
											<td className="math">⨯</td>
										</tr>
										<tr>
											<th>alternative syntax</th>
											<td>cross join</td>
										</tr>
									</tbody>
								</table></div>
								<div>no argument
									<div className="too-wide">
										<RailroadDiagram 
											diagram={Diagram(
													NonTerminal('RA-expression', '#relalg-relalgexpr'),
													Sequence(
															Choice(0, '⨯', Sequence('cross', 'join')),
													),
													NonTerminal('RA-expression', '#relalg-relalgexpr'),
											)} />
									</div>
								</div>
							</div>
							<div>
								<h4 id="relalg-operations-innerjoin">Theta-join / θ-join</h4>
								<div className="scroll-x"><table className="table table-nonfluid">
									<tbody>
										<tr>
											<th>symbol</th>
											<td className="math">⋈</td>
										</tr>
										<tr>
											<th>alternative syntax</th>
											<td>join<br />inner join</td>
										</tr>
									</tbody>
								</table></div>
								<div>join condition
									<div className="too-wide">
										{/*
										<RailroadDiagram 
											diagram={Diagram(
													Stack(
															Sequence(
																	NonTerminal('RA-expression', '#relalg-relalgexpr'),
																	Sequence(
																			Choice(0, '⋈', Sequence(Optional('inner'), 'join')),
																			NonTerminal('boolean-expression', '#relalg-valueexpr'),
																	),
															),
															NonTerminal('RA-expression', '#relalg-relalgexpr'),
													),
											)} />
											*/}
									</div>
								</div>

								<p>
									Special case:<br />
									The name of a single boolean column (like <code>R join a S</code>) can not be used directly
									as a join condition due to ambiguities in the relational algebra syntax.<br />

									The column must either be specified with its qualifier (<code>R join R.a S</code>) or wrapped in
									parentheses (<code>R join (a) S</code>).<br />

									This is not necessary for more complex boolean expressions. The problem is only that the single
									column name
									can not be distinguished from a relation name: the expression <code>X=R join S X</code> could be
									interpreted as <code>A=(R join S A)</code> instead of <code>A=(R join S) A</code>.
								</p>
							</div>
							<div>
								<h4 id="relalg-operations-naturaljoin">natural join</h4>
								<div className="scroll-x"><table className="table table-nonfluid">
									<tbody>
										<tr>
											<th>symbol</th>
											<td className="math">⋈</td>
										</tr>
										<tr>
											<th>alternative syntax</th>
											<td>join<br />natural join</td>
										</tr>
									</tbody>
								</table></div>
								<div>no argument

									<div className="example">
										<code className="block">&rho; a ( Customer )
				<span className="math">⋈</span> a.name {'<'} b.name ( &rho; b ( Customer ) )</code>
									</div>

									<div className="too-wide">
										{/** 
										<RailroadDiagram 
											diagram={Diagram(
													NonTerminal('RA-expression', '#relalg-relalgexpr'),
													Sequence(
															Choice(0, '⋈', Sequence('natural', 'join')),
													),
													NonTerminal('RA-expression', '#relalg-relalgexpr'),
											)} />
											*/}
									</div>
								</div>
							</div>
							<div>
								<h4 id="relalg-operations-leftjoin">left outer join</h4>
								<div className="scroll-x"><table className="table table-nonfluid">
									<tbody>
										<tr>
											<th>symbol</th>
											<td className="math">⟕</td>
										</tr>
										<tr>
											<th>alternative syntax</th>
											<td>left outer join<br />left join</td>
										</tr>
									</tbody>
								</table></div>
								<div>optional join condition; if no join condition is given it acts as a natural left outer join
									<div className="too-wide">
										{/**
										<RailroadDiagram 
											diagram={Diagram(
													Stack(
															Sequence(
																	NonTerminal('RA-expression', '#relalg-relalgexpr'),
																	Sequence(
																			Choice(0, '⟕', Sequence('left', Optional('outer'), 'join')),
																			Optional(NonTerminal('boolean-expression', '#relalg-valueexpr')),
																	),
															),
															NonTerminal('RA-expression', '#relalg-relalgexpr'),
													),
											)} />

											 */}
									</div>
								</div>
							</div>
							<div>
								<h4 id="relalg-operations-rightjoin">right outer join</h4>
								<div className="scroll-x"><table className="table table-nonfluid">
									<tbody>
										<tr>
											<th>symbol</th>
											<td className="math">⟖</td>
										</tr>
										<tr>
											<th>alternative syntax</th>
											<td>right outer join<br />right join</td>
										</tr>
									</tbody>
								</table></div>
								<div>optional join condition; if no join condition is given it acts as a natural right outer join
									<div className="too-wide">
										{/** 
										<RailroadDiagram 
											diagram={Diagram(
													Stack(
															Sequence(
																	NonTerminal('RA-expression', '#relalg-relalgexpr'),
																	Sequence(
																			Choice(0, '⟖', Sequence('right', Optional('outer'), 'join')),
																			Optional(NonTerminal('boolean-expression', '#relalg-valueexpr')),
																	),
															),
															NonTerminal('RA-expression', '#relalg-relalgexpr'),
													),
											)} />
											 */}
									</div>
								</div>
							</div>
							<div>
								<h4 id="relalg-operations-fulljoin">full outer join</h4>
								<div className="scroll-x"><table className="table table-nonfluid">
									<tbody>
										<tr>
											<th>symbol</th>
											<td className="math">⟗</td>
										</tr>
										<tr>
											<th>alternative syntax</th>
											<td>full outer join</td>
										</tr>
									</tbody>
								</table></div>
								<div>optional join condition; if no join condition is given it acts as a natural full outer join
									<div className="too-wide">
											 {/*
										<RailroadDiagram 
											diagram={Diagram(
													Stack(
															Sequence(
																	NonTerminal('RA-expression', '#relalg-relalgexpr'),
																	Sequence(
																			Choice(0, '⟗', Sequence('full', 'outer', 'join')),
																			Optional(NonTerminal('boolean-expression', '#relalg-valueexpr')),
																	),
															),
															NonTerminal('RA-expression', '#relalg-relalgexpr'),
													),
											)} />
											 */}
									</div>
								</div>
							</div>
							<div>
								<h4 id="relalg-operations-leftsemijoin">left semi join</h4>
								<div className="scroll-x"><table className="table table-nonfluid">
									<tbody>
										<tr>
											<th>symbol</th>
											<td className="math">⋉</td>
										</tr>
										<tr>
											<th>alternative syntax</th>
											<td>left semi join</td>
										</tr>
									</tbody>
								</table></div>
								<div>no argument
									<div className="too-wide">
										 {/*
										<RailroadDiagram 
											diagram={
											Diagram(
													NonTerminal('RA-expression', '#relalg-relalgexpr'),
													Sequence(
															Choice(0, '⋉', Sequence('left', 'semi', 'join')),
													),
													NonTerminal('RA-expression', '#relalg-relalgexpr'),
											)} />
											 */}
								</div>
							</div>
							<div>
								<h4 id="relalg-operations-rightsemijoin">right semi join</h4>
								<div className="scroll-x"><table className="table table-nonfluid">
									<tbody>
										<tr>
											<th>symbol</th>
											<td className="math">⋊</td>
										</tr>
										<tr>
											<th>alternative syntax</th>
											<td>right semi join</td>
										</tr>
									</tbody>
								</table></div>
								<div>no argument
									<div className="too-wide">
										 {/*
										<RailroadDiagram 
											diagram={Diagram(
													NonTerminal('RA-expression', '#relalg-relalgexpr'),
													Sequence(
															Choice(0, '⋊', Sequence('right', 'semi', 'join')),
													),
													NonTerminal('RA-expression', '#relalg-relalgexpr'),
											)} />
											 */}
									</div>
								</div>
							</div>
							<div>
								<h4 id="relalg-operations-antijoin">anti semi join</h4>
								<div className="scroll-x"><table className="table table-nonfluid">
									<tbody>
										<tr>
											<th>symbol</th>
											<td className="math">▷</td>
										</tr>
										<tr>
											<th>alternative syntax</th>
											<td>anti semi join<br />anti join</td>
										</tr>
									</tbody>
								</table></div>
								<div>no argument
									<br />

									<div className="too-wide">
										{/*
										<RailroadDiagram 
											diagram={Diagram(
													Stack(
															Sequence(
																	NonTerminal('RA-expression', '#relalg-relalgexpr'),
																	Sequence(
																			Choice(0, '▷', Sequence('anti', Optional('semi'), 'join')),
																	),
															),
															NonTerminal('RA-expression', '#relalg-relalgexpr'),
													),
											)} />
																	*/}
									</div>
								</div>
							</div>

							<h3 id="relalg-operator-precedence">Operator precedence</h3>

							<p>The operator precedence allows to obmit most of braces.
								<br />The used precedence is shown in the table below.
								<br />All operators are left associative.
							</p>

							<div className="scroll-x"><table className="table">
								<thead>
									<tr>
										<th>order of precedence</th>
										<th>Operator</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>0</td>
										<td>
											<a href="#relalg-relation-name">relation-name</a>,
											<a href="#relalg-inline-relation">inline-relation</a>
										</td>
									</tr>
									<tr>
										<td>1</td>
										<td>
											<a href="#relalg-operations-projection">projection</a>,
											<a href="#relalg-operations-selection">selection</a>,
											<a href="#relalg-operations-renamecolumn">rename (columns)</a>,
											<a href="#relalg-operations-renamerelation">rename (relations)</a>,
											<a href="#relalg-operations-groupby">group</a>,
											<a href="#relalg-operations-orderby">order by</a>
										</td>
									</tr>
									<tr>
										<td>2</td>
										<td>
											<a href="#relalg-operations-crossjoin">cross product</a>,
											<a href="#relalg-operations-innerjoin">theta join</a>,
											<a href="#relalg-operations-naturaljoin">natural join</a>,
											<a href="#relalg-operations-leftjoin">left outer join</a>,
											<a href="#relalg-operations-rightjoin">right outer join</a>,
											<a href="#relalg-operations-fulljoin">full outer join</a>,
											<a href="#relalg-operations-leftsemijoin">left semi-join</a>,
											<a href="#relalg-operations-rightsemijoin">right semi-join</a>,
											<a href="#relalg-operations-antijoin">anti semi-join</a>,
											<a href="#relalg-operations-division">division</a>
										</td>
									</tr>
									<tr>
										<td>3</td>
										<td>
											<a href="#relalg-operations-intersection">intersection</a>
										</td>
									</tr>
									<tr>
										<td>4</td>
										<td>
											<a href="#relalg-operations-union">union</a>,
											<a href="#relalg-operations-subtraction">subtraction</a>
										</td>
									</tr>
								</tbody>
							</table></div>

							<div className="example">
								<code>A join B x C</code>
								<br />is equal to
								<br /><code>((A join B) x C)</code>
								<br />because the cross product and the natural join are in the same precedence className.
							</div>

							<div className="example">
								<code>sigma true A join sigma true B</code>
								<br />is equal to
								<br /><code>(sigma true (A)) join (sigma true (B))</code>
								<br />because the unary operators have a higher precedence than the binary operators.
							</div>


							<h3 id="relalg-misc">Misc</h3>

							<h4 id="relalg-column">Column</h4>
							column is either
							<ul>
								<li>the name of a column: &quot;columnName&quot;</li>
								<li>the number of the column (starting with 1): &quot;[column-number]&quot;</li>
								<li>a full qualified column: &quot;qualifier.columnName&quot;</li>
								<li>a value expression (if allowed for the specific operation)</li>
							</ul>
							the qualifier is optional if the column is unique in its schema.


							<h4 id="relalg-valueexpr">Value expressions</h4>

							With most operators you can use a value-expression which connects one or more columns of a single row to
							calculate a new value.
							This is possible for:
							<ul>
								<li>the projection creating a new column (make sure to give the column a name)</li>
								<li>the selection any expression evaluating to boolean can be used</li>
								<li>
									for the joins any expression evaluating to boolean can be used;
									note that the <code>rownum()</code> expression always represents the index of the lefthand relation
								</li>
							</ul>

							The expressions always operate on a single row/tuple of a table/relation.

							<br />If you want to calculate values vertically over all values of a specific column/attribute you need to
							use group by with an aggregate function.


							The following table lists all functions and operators that can be used in an expression.
							They can be combined and nested in any arbitrary order but note that they do evaluate to a single type
							defined by the outer most expression.

							The following operators can be used:
							<div className="scroll-x"><table className="table">
								<thead>
									<tr>
										<th>syntax</th>
										<th>returns type</th>
										<th>description</th>
									</tr>
								</thead>
								<tbody>
								<tr>
									<td><code>a AND b</code></td>
									<td>boolean</td>
									<td>logical and</td>
								</tr>
								<tr>
									<td><code>a OR b</code></td>
									<td>boolean</td>
									<td>logical or</td>
								</tr>
								<tr>
									<td><code>a XOR b</code></td>
									<td>boolean</td>
									<td>logical exclusive or</td>
								</tr>
								<tr>
									<td><code>NOT b</code></td>
									<td>boolean</td>
									<td>logical not</td>
								</tr>
								<tr>
									<td>
										<code>a = b
				a != b
				a {'<'} b
				a {'>'} b
				a {'<'}= b
				a {'>'}= b
				a != b</code>
									</td>
									<td>boolean</td>
									<td>compares two values of the same type</td>
								</tr>
								<tr>
									<td><code>a:string LIKE 'PATTERN'</code></td>
									<td>boolean</td>
									<td>returns true if expression evaluating to a string <code>a</code> matches the pattern
										given as the second operand.
										<br />The pattern has to be given as a string literal;

										<p>
											An underscore (<code>_</code>) in the pattern stands for any single character
											and any percent sign (<code>%</code>) stands for any sequence of zero or
											more characters.
										</p>
									</td>
								</tr>
								<tr>
									<td><code>a:string ILIKE 'PATTERN'</code></td>
									<td>boolean</td>
									<td>
										same as <code>LIKE</code> but matches case-insensitive.
										<br />This is not in the SQL standard but is a PostgreSQL extension.
									</td>
								</tr>
								<tr>
									<td>
				<code>a + b
				a - b
				a * b
				a / b
				a % b</code>
									</td>
									<td>number</td>
									<td>arithmetic addition, subtraction, multiplication, division, modulo</td>
								</tr>
								<tr>
									<td><code>rand()</code></td>
									<td>number</td>
									<td>returns a random number in the interval [0, 1]</td>
								</tr>
								<tr>
									<td><code>rownum()</code></td>
									<td>number</td>
									<td>
										returns the index of the current row (starting with 0).
										<br />If the function is used in a binary relational algebra expression (e.g. a join)
										it always represents the index of the left operand.
									</td>
								</tr>

								<tr>
									<td><code>length(a:string)</code></td>
									<td>number</td>
									<td>returns the length of the string</td>
								</tr>

								<tr>
									<td><code>date(a:string)</code></td>
									<td>date</td>
									<td>parses the given string to a date object. The string must be in the form YYYY-MM-DD</td>
								</tr>
								<tr>
									<td><code>adddate(a:date, b:number)</code></td>
									<td>date</td>
									<td>adds the given number of days to date <code>a</code></td>
								</tr>
								<tr>
									<td><code>subdate(a:date, b:number)</code></td>
									<td>date</td>
									<td>subtracts the given number of days from date <code>a</code></td>
								</tr>
								<tr>
									<td><code>now()
										transaction_timestamp()
										statement_timestamp()</code></td>
									<td>date</td>
									<td>returns a timestamp representing the start of the query execution
										<br />transaction- and statement start are the very same value due to the lack of a transaction
										concept
									</td>
								</tr>
								<tr>
									<td><code>clock_timestamp()</code></td>
									<td>date</td>
									<td>returns the current timestamp while executing the query</td>
								</tr>

								<tr>
									<td><code>year(a:date)</code></td>
									<td>number</td>
									<td>returns the year component of a given date</td>
								</tr>
								<tr>
									<td><code>month(a:date)</code></td>
									<td>number</td>
									<td>returns the month component of a given date as a number. (1 = Sunday, 2 = Monday, ..., 7 =
										Saturday)
									</td>
								</tr>
								<tr>
									<td><code>day(a:date)
										dayofmonth(a:date)</code></td>
									<td>number</td>
									<td>returns the day component of a given date as a number in the range 1 to 31</td>
								</tr>
								<tr>
									<td><code>hour(a:date)</code></td>
									<td>number</td>
									<td>returns the hour component of a given date as a number in the range 0 to 23</td>
								</tr>
								<tr>
									<td><code>minute(a:date)</code></td>
									<td>number</td>
									<td>returns the minute component of a given date as a number in the range 0 to 59</td>
								</tr>
								<tr>
									<td><code>second(a:date)</code></td>
									<td>number</td>
									<td>returns the second component of a given date as a number in the range 0 to 59</td>
								</tr>

								<tr>
									<td><code>concat(a:string [, ...])</code></td>
									<td>string</td>
									<td>concatenates the given strings</td>
								</tr>
								<tr>
									<td><code>upper(a:string)
										ucase(a:string)</code></td>
									<td>string</td>
									<td>converts the given string to upper-case</td>
								</tr>
								<tr>
									<td><code>lower(a:string)
										lcase(a:string)</code></td>
									<td>string</td>
									<td>converts the given string to lower-case</td>
								</tr>

								<tr>
									<td><code>strlen(a:string)</code></td>
									<td>number</td>
									<td>number of characters of the string</td>
								</tr>

								<tr>
									<td><code>abs(a:number)</code></td>
									<td>number</td>
									<td>the absolute value of the given number</td>
								</tr>


								<tr>
									<td>
										<code>add(a, b)
				sub(a, b)
				mul(a, b)
				div(a, b)
				mod(a, b)</code>
									</td>
									<td>number</td>
									<td>arithmetic addition, <br />
										subtraction, <br />
										multiplication, <br />
										division or <br />
										modulo of the given numbers
									</td>
								</tr>
								<tr>
									<td>
										<code>round(a)
				floor(a)
				ceil(a)</code>
									</td>
									<td>number</td>
									<td>round to nearest integer, <br />
										largest integer not greater than the argument or<br />
										smallest integer not less than the argument
									</td>
								</tr>
								<tr>
									<td><code className="sql">coalesce(<strong>value</strong> [, ...])</code></td>
									<td>type of <strong>value</strong></td>
									<td>returns the first of its arguments that is not null or null if all arguments are null. Note that
										all arguments must have the same datatype.
									</td>
								</tr>
								<tr>
									<td><code className="sql">CASE WHEN <strong>condition</strong> THEN result
				[WHEN ...]
				[ELSE <strong>result</strong>]
				END</code>
									</td>
									<td>type of <strong>result</strong></td>
									<td>returns the first result where the condition evaluates to true. If all conditions are false the
										else part is executed or null is returnt if the else part is missing. Note that all results must
										have the same datatype.
									</td>
								</tr>
								</tbody>
							</table></div>

							The operator precedence is the same as used in <a
								href="https://dev.mysql.com/doc/refman/5.7/en/operator-precedence.html">MySQL</a> (from strong to weak):
							<div className="scroll-x"><table className="table">
								<thead>
								<tr>
									<th>order of precedence</th>
									<th>Operators</th>
								</tr>
								</thead>
								<tbody>
								<tr>
									<td>0</td>
									<td>functions, constants, columns</td>
								</tr>
								<tr>
									<td>1</td>
									<td>! (boolean not)</td>
								</tr>
								<tr>
									<td>2</td>
									<td>- (unary minus)</td>
								</tr>
								<tr>
									<td>3</td>
									<td>*, /, %</td>
								</tr>
								<tr>
									<td>4</td>
									<td>-, +</td>
								</tr>
								<tr>
									<td>5</td>
									<td>= (comparison), {'>'}=, {'>'}, {'<'}=, {'<'}, {'<'}{'>'}, !=, LIKE, ILIKE</td>
								</tr>
								<tr>
									<td>6</td>
									<td>CASE, WHEN, THEN, ELSE</td>
								</tr>
								<tr>
									<td>7</td>
									<td>AND</td>
								</tr>
								<tr>
									<td>8</td>
									<td>XOR</td>
								</tr>
								<tr>
									<td>9</td>
									<td>OR, ||</td>
								</tr>
								</tbody>
							</table></div>


							<h2 id="sql-reference">Reference - SQL</h2>

							<p>The goal of the SQL mode of the relational algebra calculator is to provide a translation from SQL to
								relational algebra to show how they are related.
								It does not support all features a real database system like <a href="http://www.postgresql.org"
																																								target="_blank">PostgreSQL</a> or <a
										href="https://www.mysql.com/" target="_blank">MySQL</a> does because the goal is to provide a
								translation into relational algebra.
								This means that many features like correlated-substatements are not supported because the translation
								into relational algebra is not trivial and modern database systems use an extended set of operators
								internally that do not require a one-to-one translation into "classNameical" relational algebra.
								Therefore the learning effect for users of this tool would not be that big.
							</p>


							<h3 id="sql-syntax">General syntax</h3>

							<p>All keywords are case insensitv.</p>

							<p>The following Synopsis is a adapted version of <a
									href="http://www.postgresql.org/docs/9.4/static/sql-select.html" target="_blank">PostgreSQL</a> and
								shows the general syntax of the supported SQL. Brackets indicate optional parts. Braces and vertical
								lines indicate that one of the alternatives has to be chosen. Dots mean that the preceding element can
								be repeated.</p>
							<code className="block sql">[ <a href="#sql-with">WITH</a> <strong>with_query</strong> [, ...] ]
				<a href="#sql-select">SELECT</a> [ DISTINCT ]
				* | <strong>expression</strong> [ [ AS ] <strong>output_name</strong> ] [, ...]
				<a href="#sql-from">FROM</a> <strong>from_item</strong> [, ...]
				[ <a href="#sql-where">WHERE</a> <strong>condition</strong> ]
				[ <a href="#sql-groupby">GROUP BY</a> <strong>column</strong> [, ...] ]
				[ <a href="#sql-having">HAVING</a> <strong>condition</strong> ]
				[ {'{'} <a href="#sql-setoperators">UNION</a> | <a href="#sql-setoperators">INTERSECT</a> | <a
						href="#sql-setoperators">EXCEPT</a>  {'}'} [ ALL | DISTINCT ] <strong>select</strong> ]
				[ <a href="#sql-orderby">ORDER BY</a> <strong>column</strong> [ ASC | DESC ] [, ...] ]
				[ <a href="#sql-limit">LIMIT</a> {'{'} <strong>count</strong> | ALL  {'}'} ]
				[ <a href="#sql-limit">OFFSET</a> <strong>start</strong> [ ROW | ROWS ] ]
				[ <a href="#sql-limit">FETCH</a> {'{'} FIRST | NEXT  {'}'} [ <strong>count</strong> ] {'{'} ROW | ROWS {'}'} ONLY ]

				where <strong>from_item</strong> can be one of:

				<strong>table_name</strong> [ AS <strong>alias</strong> ]
				<strong>with_query_name</strong> [ AS <strong>alias</strong> ]
				( <strong>select</strong> ) AS <strong>alias</strong>
				<strong>from_item</strong> CROSS JOIN <strong>from_item</strong>
				<strong>from_item</strong> NATURAL JOIN <strong>from_item</strong>
				<strong>from_item</strong> [ INNER ] JOIN <strong>from_item</strong> ON join_condition
				<strong>from_item</strong> [ INNER ] JOIN <strong>from_item</strong> NATURAL
				<strong>from_item</strong> [ INNER ] JOIN <strong>from_item</strong> USING ( join_column [, ...] )
				<strong>from_item</strong>
				<strong>from_item</strong> {'{'} LEFT | RIGHT | FULL {'}'} [ OUTER ] JOIN ON join_condition
				<strong>from_item</strong>
				<strong>from_item</strong> {'{'} LEFT | RIGHT | FULL {'}'} [ OUTER ] JOIN NATURAL <strong>from_item</strong>
				<strong>from_item</strong> {'{'} LEFT | RIGHT | FULL {'}'}  [ OUTER ] JOIN USING ( join_column [, ...] ) <strong>from_item</strong>

				and <strong>with_query</strong> is:

				<strong>with_query_name</strong> AS ( <strong>select</strong> )</code>

							<div className="too-wide">
								{/*
								<RailroadDiagram 
										diagram={Diagram(
											Stack(
													Optional(
															Sequence(
																	Terminal('WITH', '#sql-with'),
																	OneOrMore(
																			Sequence(
																					NonTerminal('name'),
																					'AS',
																					'(',
																					NonTerminal('select', '#sql-select'),
																					')',
																			),
																			',',
																	),
															),
															'skip',
													),
													Sequence(
															Terminal('SELECT', '#sql-select'),
															Optional('DISTINCT', 'skip'),
															Choice(
																	0,
																	'*',
																	OneOrMore(
																			Choice(
																					0,
																					Sequence(
																							NonTerminal('column'),
																							Optional(Sequence('AS', NonTerminal('output_name'))),
																					),
																					Sequence(
																							NonTerminal('expression', '#sql-valueexpr'),
																							Sequence('AS', NonTerminal('output_name')),
																					),
																			),
																			',',
																	),
															),

															Terminal('FROM', '#sql-from'),
															OneOrMore(
																	Choice(
																			0,
																			Sequence(
																					NonTerminal('table_name'),
																					Optional(Sequence('AS', NonTerminal('alias'))),
																			),
																			Sequence(
																					'(', NonTerminal('select'), ')',
																					Sequence('AS', NonTerminal('alias')),
																			),
																	),
																	',',
															),
													),

													OneOrMore(
															Choice(
																	0,
																	Skip(),
																	Sequence(
																			Choice(
																					0,
																					Sequence(',', Comment('old syntax for cross join')),
																					Sequence(Choice(0, 'CROSS', 'NATURAL'), 'JOIN'),
																					Sequence(
																							Choice(
																									0,
																									Sequence(Optional('INNER'), 'JOIN'),
																									Sequence(Choice(0, 'LEFT', 'RIGHT', 'FULL'), Optional('OUTER'), 'JOIN'),
																							),
																							Choice(
																									0,
																									Sequence('ON', NonTerminal('condition')),
																									Sequence('USING', '(', OneOrMore(NonTerminal('join_column'), ','), ')'),
																									Sequence('NATURAL'),
																							),
																					),
																			),
																			Choice(
																					0,
																					Sequence(
																							NonTerminal('table_name'),
																							Optional(Sequence('AS', NonTerminal('alias'))),
																					),
																					Sequence(
																							'(', NonTerminal('select'), ')',
																							Sequence('AS', NonTerminal('alias')),
																					),
																			),
																	),
															),
													),

													Sequence(
															Optional(
																	Sequence(
																			Terminal('WHERE', '#sql-where'),
																			NonTerminal('condition'),
																	),
																	'skip',
															),
															Optional(
																	Sequence(
																			Terminal('GROUP BY', '#sql-groupby'),
																			NonTerminal('expression', '#sql-valueexpr'),
																	),
																	'skip',
															),
															Optional(
																	Sequence(
																			Terminal('HAVING', '#sql-having'),
																			NonTerminal('condition'),
																	),
																	'skip',
															),
													),

													Sequence(
															Optional(
																	Sequence(
																			Choice(
																					0,
																					'UNION',
																					'INTERSECT',
																					'EXCEPT',
																			),
																			Choice(
																					0,
																					Skip(),
																					'DISTINCT',
																					'ALL',
																			),
																			NonTerminal('select'),
																	),
																	'skip',
															),
															Optional(
																	Sequence(
																			Terminal('ORDER BY', '#sql-orderby'),
																			OneOrMore(
																					Sequence(
																							NonTerminal('expression', '#sql-valueexpr'),
																							Choice(
																									0,
																									'ASC',
																									'DESC',
																							),
																					),
																					',',
																			),
																	),
																	'skip',
															),
													),

													Sequence(
															Optional(
																	Sequence(
																			Terminal('LIMIT', '#sql-limit'),
																			Choice(0,
																					NonTerminal('count'),
																					'ALL',
																			),
																	),
																	'skip',
															),
															Optional(
																	Sequence(
																			Terminal('OFFSET', '#sql-limit'),
																			NonTerminal('start'),
																			Optional('ROWS'),
																	),
																	'skip',
															),
													),


													Sequence(
															Optional(
																	Sequence(
																			Terminal('FETCH FIRST', '#sql-limit'),
																			NonTerminal('count'),
																			Optional('ROWS'),
																			'ONLY',
																	),
																	'skip',
															),
													),
											),
									)} />
																	*/}
							</div>

							<h3 id="sql-translation">Semantic and Translation to relational algebra</h3>


							<h4 id="sql-translation-sequence">Sequence of execution</h4>

							<p>The SQL statement is translated directly into relational algebra. To understand some of the effects of
								the tool it might be helpful to understand the steps of the translation process.
								As mentioned before, real database systems might take a different (more complex) aproach but this should
								help to get an idea of how SQL could be translated into "classNameical" relational algebra.</p>

							<p>The following list shows the translation from SQL into relational algebra starting with the inner most
								relational algebra expression at the top.</p>
							<ol>
								<li>replace all usages of the temporary-tables defined in the WITH-clause with their definitions</li>
								<li>FROM-clause is translated left associative with all joins having the same precedence (<code>,</code>
									is a cross join)
								</li>
								<li>selection with condition from where-clause is added</li>
								<li>group by</li>
								<li>selection with condition from having-clause</li>
								<li>union/intersect/except</li>
								<li>projection is added to choose the requested columns of the SELECT-clause</li>
								<li>the columns are renamed to get the requested output-name specified in the SELECT-clause</li>
								<li>order by</li>
								<li>limit/offset is mapped to a selection</li>
							</ol>

							<h4 id="sql-select">SELECT</h4>

							<p>The direct translation into relational algebra with implicit duplication elimination requires the <code>distinct</code>
								keyword to be equivalent. A warning is shown if you omit it.</p>

							<p>The select-clause is translated into up to two relalg operators.</p>
							<ul>
								<li>The most basic case is <code>select <strong>*</strong> ...</code> where no changes are made to the
									schema of the result. Therefore no projection is needed. You can use the optional table-alias-prefix
									if the columns of a single table/relation should be returned only: <code className="sql">select distinct
										R.* from R inner join S</code></li>
								<li>When a subset of the columns are selected and/or reordered (<code> select a, b from ...</code>) then
									a single <a href="#relalg-operations-projection">projection</a> is used.
								</li>
								<li>Additionally to the previous case a <a href="#relalg-operations-renamecolumn">rename-column
									operator</a> is added after the projection if new output-names are given with <code>as foo</code>.
									e.g. <code>select a <strong>as foo</strong> from ...</code></li>
							</ul>

							<p>The allowed expressions are the same as for the <a href="#relalg-operations-projection">projection</a>.
								So it can be either the name of the column (with optional renaming using <code>as</code>) or a complex
								<a href="#sql-valueexpr">value expression</a>. In the latter case a output-name must be given using
								<code>as</code> because the tool requires every column to have a name.
							</p>

							<h4 id="sql-from">FROM</h4>

							<p>In its simplest form the from-clause holds a single table/relation name that is used directly in the
								relalg statement. If the optional table-alias is specified with <code>table as foo</code> this is
								reflected by wrapping the relation in a <a href="#relalg-operations-renamerelation">rename-relation
									operator</a> with the given output-name.</p>
							<code className="example sql">select distinct x.a, x.b
								from R as x</code>

							<p>Joins can be expressed using the ANSI join syntax</p>

							<code className="example sql">select distinct *
				from A, B
					inner join C on ...
					inner join D natural
					natural join E
					left outer join F on ...
					left outer join G natural
					right outer join H on ...
					right outer join I natural
					full outer join J on ...
					full outer join K natural
				where ...
							</code>

							<p>The comma is part of the old join syntax and is translated into a <a href="#relalg-operations-crossjoin">cross
								join</a>.</p>
							<code className="example sql">select distinct *
				from R, S as s, T
				where s.a = R.a</code>

							<p>Instead of the name of relation a non-correlated substatement can be used. A table alias must be provided
								with <code>(...) as foo</code>.
								<br />A non-correlated substatement can be directly translated into relational algebra by just translate
								the sub-statement into relational algebra and use the resulting operator tree instead of the relation.
							</p>

							<p>Non-correlated means that it must not reference/use any columns of tables defined in the outer scope.
								<br />This limitation is intentionally because the translation into relational algebra is not trivial and
								modern database systems use an extended set of operators internally that do not require a one-to-one
								translation into "classNameical" relational algebra. Therefore the learning effect for users of this tool
								would not be that big.</p>
							<code className="example sql">select distinct *
				from R, (select * from S where a &gt; 0) as x
				where x.a = R.a</code>

							<h4 id="sql-where">WHERE</h4>

							<p>The boolean condition in the where-clause can be any <a href="#sql-valueexpr">expression</a> evaluating
								to boolean.</p>

							<p>The where clause is directly translated to an <a href="#relalg-operations-selection">relational algebra
								selection</a> with the very same condition. This selection is applied after joining relations of the
								from-clause therefore has to use the original column names.</p>

							<p>Subquery Expressions like <code>EXISTS</code>, <code>IN</code>, <code>ANY/SOME</code> or <code>ALL</code>
								are <strong>not supported</strong> because their translation into relational algebra is not trivial and
								modern database systems use an extended set of operators internally that do not require a one-to-one
								translation into "classNameical" relational algebra. Therefore the learning effect for users of this tool
								would not be that big.</p>

							<h4 id="sql-groupby">GROUP BY</h4>

							<p>The GROUP-BY-clause takes a list of column names only argument.</p>

							<p>The GROUP-BY-clause is directly translated to the <a href="#relalg-operations-groupby">relational algebra
								group-by operation</a> and is executed directly after the selection built from the WHERE-clause and
								before the projection/renaming build from the SELECT-clause. Therefore the column names that can be used
								are the ones available after all joining all tables.</p>

							<p>The aggregations used in the <a href="#relalg-operations-groupby">relational algebra group-by
								operation</a> are taken from the SELECT-clause and an output-name must be given using <code>as</code>
								because the tool requires every column to have a name.</p>

							<p>If no aggregations are present in the SELECT-clause a projection is used instead of the group-by
								operation because <a href="#relalg-operations-groupby">sigma</a> without aggregation has the very same
								effect.</p>

							<p>Every non-aggregation-column in the SELECT-clause must be present in the group by clause because the
								would not be available after the grouping.</p>


							<h4 id="sql-having">HAVING</h4>

							<p>The HAVING-Clause represents an optional <a href="#relalg-operations-selection">relational algebra
								selection</a>. The boolean condition can be any <a href="#sql-valueexpr">expression</a> evaluating to
								boolean.</p>

							<p>The resulting selection is executed directly after the <a href="#relalg-operations-groupby">relational
								algebra group-by operation</a>.</p>

							<p>Unlike <a href="http://www.postgresql.org/docs/9.4/static/sql-select.html#SQL-HAVING" target="_blank">PostgreSQL</a>
								the HAVING-clause is only allowed when either a aggregation or grouping is present.</p>


							<h4 id="sql-orderby">ORDER BY</h4>

							<p>Order by takes a list of column names or indices of columns (starting with 1) as its argument.</p>

							<p>It is directly translated to the <a href="#relalg-operations-orderby">extended relational algebra
								operation order by (tau)</a>.</p>


							<h4 id="sql-limit">LIMIT</h4>

							<p>The LIMIT-clause can be either specified with the LIMIT-OFFSET syntax used by PostgreSQL and MySQL or the
								FETCH-FIRST syntax introduced in SQL:2008.</p>

							<p>It is translated into a <a href="#relalg-operations-selection">relational algebra selection</a> using the
								<code>rownum()</code>-function to limit the number of rows returned.</p>

							<h4 id="sql-setoperators">UNION / INTERSECT / EXCEPT</h4>

							<p>The Set-Operators UNION, INTERSECT and EXCEPT directly map to the relational algebra operators <a
									href="#relalg-operations-union">union</a>, <a
									href="#relalg-operations-intersection">intersection</a> and <a
									href="#relalg-operations-subtraction">subtraction</a>.</p>

							<p>The keyword <code>DISTINCT</code> is optional because it represents the default behavior. The keyword
								<code>ALL</code> is ignored and a warning is shown because the targeted relational algebra has a
								implicit elimination duplicate rows.</p>

							<p>
								Parentheses can be used to create more complex statements:<br />
								<code className="example sql">(
					select distinct * from S
					union
					select distinct * from T
				)
				except select distinct * from T
				order by 1
				limit 1</code>
							</p>

							<h4 id="sql-with">WITH</h4>

							<p>The WITH-clause (also known as <i>common table expressions</i>) provides a way to define subqueries for
								single or multiple use in a statement. This can be thought as defining a temporary table for that query
								in SQL terminology or <a href="#relalg-assignment">creating variables in relational algebra</a>.
								Recursive evaluation is not supported.</p>

							<p>Each subquery can be referenced by the name from the WITH-clause. The subquery is automatically renamed
								to the name used in the WITH-clause.</p>


							<h4 id="sql-valueexpr">Value expressions</h4>

							<p>Value expressions are used for boolean expressions for WHERE- and HAVING-clause, the boolean conditions
								of joins and calculated values in the SELECT-clause.
								The type of a expression is either <i>string</i>, <i>number</i>, <i>date</i> or <i>boolean</i> and is
								determined by the used operations and columns.</p>

							<p>The supported functions and operations are the same for SQL and relational algebra: <a
									href="#relalg-valueexpr">value expression</a></p>




							<h2 id="license-help">Licence</h2>
							<p>
								<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
									<img 
										alt="Creative Commons License" 
										style={{borderWidth: 0}}
										src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" 
									/>
								</a><br />
								This document by Johannes Kessler is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
							</p>
						</div>
					</div>
				</div>
				</div>
		);
	}
}
